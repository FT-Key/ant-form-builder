"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { useAntdVersion } from "@/context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";
import { fetchGeneratedCode } from "@/utils/generateCode";

import {
  parseInputsFromCodeInOrder,
  getRootName,
} from "@/utils/formBuilderUtils";
import { useVersions } from "./useVersions";
import { useBlockEditing, ParsedBlock } from "./useBlockEditing";

interface SimpleInputItem {
  id: string;
  label: string;
}

export function useFormBuilderLogic() {
  const { antdVersion, getBaseCode } = useAntdVersion();
  const components = jsxParserComponentsByVersion[antdVersion];
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Estados UI y lógicos
  const [code, setCode] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Estado del prompt para generación AI
  const [prompt, setPrompt] = useState("");

  // Parsear bloques en orden (recalcula al cambiar código)
  const parsedBlocks: ParsedBlock[] = useMemo(
    () => parseInputsFromCodeInOrder(code),
    [code]
  );

  // Hook para manejar id->block, actualización y sincronización
  const {
    idToBlockRef,
    syncIdToBlockMap,
    getCodeBlockByInputId,
    reorderCodeByInputIds,
    handleUpdateInput,
    getUniqueCode,
  } = useBlockEditing(parsedBlocks);

  // Hook para versiones
  const {
    versions,
    setVersions,
    activeVersionId,
    setActiveVersionId,
    handleVersionChange,
    handleSave,
    handleDeleteVersion,
  } = useVersions();

  // Sincronizar mapa id->block cuando cambian parsedBlocks
  useEffect(() => {
    syncIdToBlockMap();
  }, [parsedBlocks, syncIdToBlockMap]);

  // Construir inputs: id + label, basado en parsedBlocks y mapa id->block
  const inputs = useMemo<SimpleInputItem[]>(() => {
    const arr: SimpleInputItem[] = [];
    const map = idToBlockRef.current;

    for (const { block } of parsedBlocks) {
      let foundId: string | undefined;
      // Buscar id por bloque exacto
      for (const [id, b] of map.entries()) {
        if (b === block) {
          foundId = id;
          break;
        }
      }
      // Si no existe id, crear uno y agregar al mapa
      if (!foundId) {
        foundId = uuidv4();
        map.set(foundId, block);
      }

      // Etiqueta del input, priorizando nombre o label dentro del bloque
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
  }, [parsedBlocks, idToBlockRef]);

  // Efecto para detectar cambio de versión menor a mayor (mostrar warning)
  useEffect(() => {
    if (prevAntdVersion && antdVersion < prevAntdVersion)
      setShowVersionWarning(true);
    setPrevAntdVersion(antdVersion);
  }, [antdVersion, prevAntdVersion]);

  // Efecto para cargar estilos (ej: esperar a que cargue la página)
  useEffect(() => {
    if (document.readyState === "complete") setIsStylesLoaded(true);
    else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Efecto para cargar código base si está vacío (ej: al cambiar versión)
  useEffect(() => {
    if (!code.trim()) {
      const base = getBaseCode(antdVersion);
      setCode(base);
    }
  }, [antdVersion, code, getBaseCode]);

  // Efecto para comparar código actual con versión activa y marcar cambios
  useEffect(() => {
    const activeVersion = versions.find((v) => v.id === activeVersionId);
    setHasUnsavedChanges(code.trim() !== (activeVersion?.code || "").trim());
  }, [code, activeVersionId, versions]);

  // Controlar overflow del body según preview expandido
  useEffect(() => {
    document.body.style.overflow = isPreviewExpanded ? "hidden" : "";
  }, [isPreviewExpanded]);

  // Wrappers que usan setters internos para reorder y update
  const reorderCodeByInputIdsWrapped = useCallback(
    (newOrder: string[]) =>
      reorderCodeByInputIds(newOrder, setCode, setHasUnsavedChanges),
    [reorderCodeByInputIds]
  );

  const handleUpdateInputWrapped = useCallback(
    (inputId: string, newCodeBlock: string) => {
      return handleUpdateInput(
        inputId,
        newCodeBlock,
        parsedBlocks,
        setCode,
        setHasUnsavedChanges
      );
    },
    [handleUpdateInput, parsedBlocks]
  );

  // Wrappers para control de versiones (manejan setters)
  const handleVersionChangeWrapped = useCallback(
    (id: number | null) =>
      handleVersionChange(id, setCode, setEditingMode, setHasUnsavedChanges),
    [handleVersionChange]
  );

  const handleSaveWrapped = useCallback(
    () => handleSave(code, "Manual edit", setHasUnsavedChanges),
    [handleSave, code]
  );

  const handleDeleteVersionWrapped = useCallback(
    (id: number) =>
      handleDeleteVersion(id, setCode, handleVersionChangeWrapped),
    [handleDeleteVersion, handleVersionChangeWrapped]
  );

  // Funciones adicionales del builder (cancelar, limpiar, descargar, generar)
  const handleCancel = useCallback(() => {
    const activeVersion = versions.find((v) => v.id === activeVersionId);
    setCode(activeVersion?.code || getBaseCode(antdVersion));
    setHasUnsavedChanges(false);
    setEditingMode("builder");
  }, [activeVersionId, versions, getBaseCode, antdVersion]);

  const handleClear = useCallback(() => {
    setCode("");
    setHasUnsavedChanges(true);
  }, []);

  const handleDownloadImage = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        backgroundColor: "#fff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `form-version-${activeVersionId ?? "latest"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("No se pudo exportar la imagen.");
    }
  }, [activeVersionId]);

  const onGenerateCode = useCallback(async () => {
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
  }, [
    prompt,
    code,
    versions,
    activeVersionId,
    setVersions,
    setActiveVersionId,
  ]);

  return {
    previewRef,
    components,
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
    inputs,

    reorderCodeByInputIds: reorderCodeByInputIdsWrapped,
    handleUpdateInput: handleUpdateInputWrapped,
    getUniqueCode,
    getCodeBlockByInputId,

    handleVersionChange: handleVersionChangeWrapped,
    handleSave: handleSaveWrapped,
    handleDeleteVersion: handleDeleteVersionWrapped,
    handleCancel,
    handleClear,
    handleDownloadImage,
    onGenerateCode,
  };
}
