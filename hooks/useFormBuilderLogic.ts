// hooks/useFormBuilderLogic.ts
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";
import { fetchGeneratedCode } from "@/utils/generateCode";

type Version = { id: number; prompt: string; code: string; messages?: any[] };

interface SimpleInputItem {
  id: string;
  label: string;
}

/**
 * Parsea el código y retorna solo *bloques top-level* que coincidan con ciertos patrones.
 * Además devuelve su posición para preservar orden.
 */
function parseInputsFromCodeInOrder(code: string) {
  if (!code) return [] as { block: string; index: number; length: number }[];

  const regexes: RegExp[] = [
    /<Form\.Item[\s\S]*?<\/Form\.Item>/g,
    /<Steps[\s\S]*?<\/Steps>/g,
    /<Descriptions[\s\S]*?<\/Descriptions>/g,
    /<Divider\s?\/?>/g,
    /<Tour[\s\S]*?<\/Tour>/g,
    /<FloatButton[\s\S]*?\/>/g,
    /<Watermark[\s\S]*?<\/Watermark>/g,
    /<QRCode[\s\S]*?\/>/g,
    /<Image\.PreviewGroup[\s\S]*?<\/Image\.PreviewGroup>/g,
  ];

  const raw: { block: string; index: number; length: number }[] = [];

  for (const r of regexes) {
    let m;
    // reset lastIndex por si se reutiliza la regex
    r.lastIndex = 0;
    while ((m = r.exec(code)) !== null) {
      raw.push({ block: m[0], index: m.index, length: m[0].length });
    }
  }

  // ordenar por index asc
  raw.sort((a, b) => a.index - b.index);

  // filtrar para mantener solo top-level (no incluir matches que estén dentro de otro match)
  const topLevel: typeof raw = [];
  for (let i = 0; i < raw.length; i++) {
    const cur = raw[i];
    let isNested = false;
    for (let j = 0; j < raw.length; j++) {
      if (i === j) continue;
      const other = raw[j];
      if (
        other.index <= cur.index &&
        other.index + other.length >= cur.index + cur.length
      ) {
        // cur está contenido en other
        isNested = true;
        break;
      }
    }
    if (!isNested) topLevel.push(cur);
  }

  return topLevel;
}

function getRootName(block: string): string | null {
  const m = block.trim().match(/^<\s*([A-Za-z0-9_.]+)/);
  return m ? m[1] : null;
}

export function useFormBuilderLogic() {
  const { antdVersion, getBaseCode } = useAntdVersion();
  const components = jsxParserComponentsByVersion[antdVersion];
  const previewRef = useRef<HTMLDivElement | null>(null);

  // mapa estable id -> block
  const idToBlockRef = useRef<Map<string, string>>(new Map());

  // estados UI / lógica
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // parse blocks top-level con indices
  const parsedBlocks = useMemo(() => parseInputsFromCodeInOrder(code), [code]);

  // sincronizar idToBlockRef con parsedBlocks: preserve ids existentes cuando el block string es igual,
  // y generar id nuevos para bloques nuevos; eliminar ids que ya no existen.
  useEffect(() => {
    const prevMap = idToBlockRef.current;
    const newMap = new Map<string, string>();

    // helper: buscar id existente por bloque (value)
    const findIdForBlock = (block: string) => {
      for (const [id, b] of prevMap.entries()) {
        if (b === block) return id;
      }
      return null;
    };

    for (const { block } of parsedBlocks) {
      const existingId = findIdForBlock(block);
      if (existingId) {
        newMap.set(existingId, block);
      } else {
        newMap.set(uuidv4(), block);
      }
    }

    idToBlockRef.current = newMap;
  }, [parsedBlocks]);

  // inputs array simple (id + label) en el orden de parsedBlocks
  const inputs = useMemo<SimpleInputItem[]>(() => {
    const arr: SimpleInputItem[] = [];
    const map = idToBlockRef.current;
    for (const { block } of parsedBlocks) {
      // buscar id que tenga ese block (debe existir porque sincronizamos)
      let foundId: string | undefined;
      for (const [id, b] of map.entries()) {
        if (b === block) {
          foundId = id;
          break;
        }
      }
      if (!foundId) {
        // safety: si no existe (raro) generamos uno
        foundId = uuidv4();
        map.set(foundId, block);
      }

      const root = getRootName(block);
      let label = root || "Bloque";
      if (root === "Form.Item") {
        label =
          block.match(/name="([^"]+)"/)?.[1] ||
          block.match(/label="([^"]+)"/)?.[1] ||
          "Form.Item";
      }
      arr.push({ id: foundId, label });
    }
    return arr;
  }, [parsedBlocks]);

  const getCodeBlockByInputId = useCallback((id: string) => {
    if (!id.includes("::")) {
      // Id raíz
      return idToBlockRef.current.get(id) ?? undefined;
    }

    // Id hijo: "parentId::childLabel"
    const [parentId, childLabel] = id.split("::");
    const parentBlock = idToBlockRef.current.get(parentId);
    if (!parentBlock) return undefined;

    // Regex para extraer Form.Item hijo con label exacto
    const childRegex = new RegExp(
      `<Form\\.Item[\\s\\S]*?label="${childLabel}"[\\s\\S]*?<\\/Form\\.Item>`,
      "g"
    );
    const matches = parentBlock.match(childRegex);
    return matches && matches.length > 0 ? matches[0] : undefined;
  }, []);

  // reorder basado en ids: newOrder es array de ids en el nuevo orden
  const reorderCodeByInputIds = useCallback((newOrder: string[]) => {
    const idToBlock = idToBlockRef.current;
    const reorderedBlocks: string[] = [];
    for (const id of newOrder) {
      const b = idToBlock.get(id);
      if (b) reorderedBlocks.push(b);
    }
    // reemplaza todo el code por los bloques reordenados (join con saltos)
    setCode(reorderedBlocks.join("\n"));
    setHasUnsavedChanges(true);
  }, []);

  // actualizar un bloque por id (nuevo código -> reemplaza ese bloque en la lista)
  const handleUpdateInput = useCallback(
    (inputId: string, newCodeBlock: string) => {
      const idToBlock = idToBlockRef.current;
      if (!idToBlock.has(inputId)) return;

      // actualiza map
      idToBlock.set(inputId, newCodeBlock);

      // reconstruye code respetando order de parsedBlocks actual,
      // reemplazando el bloque que tenga el id target
      const rebuilt: string[] = [];
      // parsedBlocks tiene el orden actual del code. Para cada block en parsedBlocks, buscamos su id (por matching value)
      for (const { block } of parsedBlocks) {
        // buscar id para este block (antes de la edición)
        let foundId: string | undefined;
        for (const [id, b] of idToBlock.entries()) {
          // Si el mapa ya fue actualizado y la entrada actualizada tiene el nuevo block igual al parsed block,
          // también corresponderá correctamente.
          if (b === block) {
            foundId = id;
            break;
          }
        }
        // fallback (si no encontramos por coincidencia exacta, puede ocurrir cuando estamos editando el propio bloque)
        if (!foundId) {
          // si el inputId corresponde al block que estamos buscando, insertamos el nuevo
          // (esto cubre el caso en el que el parsedBlocks todavía contiene la versión vieja)
          // mejor approach: si el block no se encuentra, intentar comprobar si the inputId was the one edited:
          const currentForId = idToBlock.get(inputId);
          if (
            currentForId &&
            block !== currentForId &&
            block === idToBlock.get(inputId)
          ) {
            foundId = inputId;
          }
        }

        if (foundId) {
          // si este foundId es el que editamos, insertamos la nueva code del mapa (ya actualizada)
          rebuilt.push(idToBlock.get(foundId)!);
        } else {
          // si no encontramos id por match, lo más prudente es mantener el block original (evita pérdida)
          rebuilt.push(block);
        }
      }

      // En caso extremo (parsedBlocks vacío) reconstruimos a partir de idToBlock ordenado
      if (rebuilt.length === 0) {
        rebuilt.push(...Array.from(idToBlock.values()));
      }

      setCode(rebuilt.join("\n"));
      setHasUnsavedChanges(true);
    },
    [parsedBlocks]
  );

  // helpers: versioning, download, generate, etc. (muy similar a tu versión)
  useEffect(() => {
    if (document.readyState === "complete") setIsStylesLoaded(true);
    else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    if (!code.trim()) {
      const base = getBaseCode(antdVersion);
      setCode(base);
    }
  }, [antdVersion, getBaseCode]);

  useEffect(() => {
    const activeVersion = versions.find((v) => v.id === activeVersionId);
    setHasUnsavedChanges(code.trim() !== (activeVersion?.code || "").trim());
  }, [code, activeVersionId, versions]);

  useEffect(() => {
    if (prevAntdVersion && antdVersion < prevAntdVersion)
      setShowVersionWarning(true);
    setPrevAntdVersion(antdVersion);
  }, [antdVersion]);

  useEffect(() => {
    document.body.style.overflow = isPreviewExpanded ? "hidden" : "";
  }, [isPreviewExpanded]);

  const handleVersionChange = (id: number) => {
    const version = versions.find((v) => v.id === id);
    if (version) {
      setActiveVersionId(id);
      setCode(version.code);
      setEditingMode("builder");
      setHasUnsavedChanges(false);
    }
  };

  const handleSave = () => {
    const maxId = versions.length ? Math.max(...versions.map((v) => v.id)) : 0;
    const newVersion: Version = {
      id: maxId + 1,
      prompt: "Manual edit",
      code,
      messages: versions.find((v) => v.id === activeVersionId)?.messages || [],
    };
    setVersions((prev) => [...prev, newVersion]);
    setActiveVersionId(newVersion.id);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    const activeVersion = versions.find((v) => v.id === activeVersionId);
    setCode(activeVersion?.code || getBaseCode(antdVersion));
    setHasUnsavedChanges(false);
    setEditingMode("builder");
  };

  const handleClear = () => {
    setCode("");
    setHasUnsavedChanges(true);
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `form-version-${activeVersionId ?? "latest"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("No se pudo exportar la imagen.");
    }
  };

  const onGenerateCode = async () => {
    if (!prompt.trim()) return alert("Prompt vacío");
    setIsGenerating(true);
    try {
      await fetchGeneratedCode(
        prompt,
        code,
        versions.find((v) => v.id === activeVersionId),
        versions,
        ({ code: newCode, messages, newVersionId }) => {
          setCode(newCode);
          setVersions((prev) => [
            ...prev,
            { id: newVersionId, prompt, code: newCode, messages },
          ]);
          setActiveVersionId(newVersionId);
          setPrompt("");
          setShowCode(false);
          setEditingMode("builder");
          setHasUnsavedChanges(false);
        }
      );
    } catch (e) {
      alert("Error al generar: " + e);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    // refs
    previewRef,
    components,
    // estados
    isStylesLoaded,
    prompt,
    setPrompt,
    code,
    setCode,
    versions,
    setVersions,
    activeVersionId,
    showCode,
    setShowCode,
    editingMode,
    setEditingMode,
    hasUnsavedChanges,
    isGenerating,
    showVersionWarning,
    setShowVersionWarning,
    isPreviewExpanded,
    setIsPreviewExpanded,
    // datos calculados
    inputs, // array {id,label} en orden
    // funciones
    reorderCodeByInputIds,
    handleUpdateInput,
    handleVersionChange,
    handleSave,
    handleCancel,
    handleClear,
    handleDownloadImage,
    onGenerateCode,
    getCodeBlockByInputId,
  };
}
