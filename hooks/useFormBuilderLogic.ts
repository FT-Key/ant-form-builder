import { useEffect, useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { message } from "antd";
import type { AntdVersion } from "../context/AntdVersionContext";

export function useFormBuilderLogic(
  antdVersion: AntdVersion,
  getBaseCode: (v: AntdVersion) => string,
  jsxParserComponentsByVersion: Record<string, any>
) {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [code, setCode] = useState("");
  const [localCode, setLocalCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<AntdVersion | null>(
    null
  );
  const previewRef = useRef<HTMLDivElement>(null);

  const activeVersion = versions.find((v) => v.id === activeVersionId);
  const components = jsxParserComponentsByVersion[antdVersion];

  // --- Nuevo: manejo inputs para InputList ---
  function parseInputsFromCode(codeStr: string): string[] {
    const blocks: string[] = [];

    // 1. Agrupar el bloque especial de Transfer
    const transferRegex =
      /<Form\.Item[^>]*label="[^"]*Transfer"[^>]*>[\s\S]*?<\/Form\.Item>\s*<Form\.Item[^>]*name="[^"]+"[^>]*hidden>[\s\S]*?<\/Form\.Item>/g;
    const transferMatches = codeStr.match(transferRegex);
    if (transferMatches) {
      blocks.push(...transferMatches);
      codeStr = codeStr.replace(transferRegex, ""); // eliminar los ya procesados
    }

    // 2. Agarrar el resto de bloques Form.Item
    const genericRegex = /<Form\.Item[\s\S]*?<\/Form\.Item>/g;
    const genericMatches = codeStr.match(genericRegex);
    if (genericMatches) {
      blocks.push(...genericMatches);
    }

    return blocks;
  }

  const inputsBlocks = parseInputsFromCode(localCode);

  const inputs = inputsBlocks.map((block, i) => ({
    id: `input-${i}`,
    label: block.match(/name="([^"]+)"/)?.[1] || `Input ${i + 1}`,
  }));

  const reorderCodeByInputIds = useCallback(
    (newOrder: string[]) => {
      const idToBlock: Record<string, string> = {};
      inputs.forEach(({ id }, idx) => {
        idToBlock[id] = inputsBlocks[idx];
      });

      const reorderedBlocks = newOrder
        .map((id) => idToBlock[id])
        .filter(Boolean);

      const newCode = reorderedBlocks.join("\n");

      setLocalCode(newCode);
      setCode(newCode);
      setHasUnsavedChanges(true);
    },
    [inputs, inputsBlocks]
  );

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsStylesLoaded(true);
    } else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    if (prevAntdVersion && antdVersion < prevAntdVersion) {
      setShowVersionWarning(true);
    }
    setPrevAntdVersion(antdVersion);
  }, [antdVersion]);

  useEffect(() => {
    const baseCode = getBaseCode(antdVersion);
    setCode(baseCode);
  }, [antdVersion, getBaseCode]);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  useEffect(() => {
    const trimmedLocal = localCode.trim();
    const trimmedCurrent = (activeVersion?.code || code).trim();
    setHasUnsavedChanges(trimmedLocal !== trimmedCurrent);
  }, [localCode, activeVersion, code]);

  const handleInsert = (insertedCode: string, label: string) => {
    const baseName = label.toLowerCase().replace(/\s+/g, "");
    const regex = new RegExp(`${baseName}(\\d*)`, "g");
    const matches = Array.from(localCode.matchAll(regex)).map((m) =>
      m[1] ? parseInt(m[1]) : 0
    );
    const nextIndex = Math.max(0, ...matches) + 1;
    const uniqueName = `${baseName}${nextIndex}`;
    const updated = insertedCode.replace(
      /name="[^"]*"/,
      `name="${uniqueName}"`
    );
    setLocalCode((prev) => prev + "\n" + updated);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const maxId = versions.length ? Math.max(...versions.map((v) => v.id)) : 0;
    const newVersion = {
      id: maxId + 1,
      prompt: "Manual edit",
      code: localCode,
      messages: activeVersion?.messages || [],
    };
    setVersions([...versions, newVersion]);
    setCode(localCode);
    setActiveVersionId(newVersion.id);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setLocalCode(activeVersion?.code || code);
    setHasUnsavedChanges(false);
    setEditingMode("builder");
  };

  const handleClear = () => {
    setCode("");
    setLocalCode("");
    setHasUnsavedChanges(true);
  };

  const handleVersionChange = (id: number) => {
    const version = versions.find((v) => v.id === id);
    if (version) {
      setActiveVersionId(id);
      setCode(version.code);
      setLocalCode(version.code);
      setEditingMode("builder");
      setHasUnsavedChanges(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `form-version-${activeVersionId ?? "latest"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Image export failed", err);
      message.error("No se pudo exportar la imagen.");
    }
  };

  return {
    code,
    setCode,
    localCode,
    setLocalCode,
    prompt,
    setPrompt,
    versions,
    setVersions,
    activeVersionId,
    setActiveVersionId,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    editingMode,
    setEditingMode,
    showCode,
    setShowCode,
    isGenerating,
    setIsGenerating,
    showVersionWarning,
    setShowVersionWarning,
    previewRef,
    activeVersion,
    components,
    handleInsert,
    handleSave,
    handleCancel,
    handleClear,
    handleVersionChange,
    handleDownloadImage,
    isStylesLoaded,
    inputs,
    reorderCodeByInputIds,
  };
}
