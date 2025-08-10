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
import { useBlockEditing } from "./useBlockEditing";

interface SimpleInputItem {
  id: string;
  label: string;
}

export function useFormBuilderLogic() {
  const { antdVersion, getBaseCode } = useAntdVersion();
  const components = jsxParserComponentsByVersion[antdVersion];
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Estados UI / lógica
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // parsedBlocks
  const parsedBlocks = useMemo(() => parseInputsFromCodeInOrder(code), [code]);

  // Block editing hook
  const {
    idToBlockRef,
    syncIdToBlockMap,
    getCodeBlockByInputId,
    reorderCodeByInputIds,
    handleUpdateInput,
    getUniqueCode,
  } = useBlockEditing(parsedBlocks);

  // Versions hook
  const {
    versions,
    setVersions,
    activeVersionId,
    setActiveVersionId,
    handleVersionChange,
    handleSave,
    handleDeleteVersion,
  } = useVersions();

  // Sincronizar mapa id -> block
  useEffect(() => {
    syncIdToBlockMap();
  }, [parsedBlocks, syncIdToBlockMap]);

  // inputs (id + label)
  const inputs = useMemo<SimpleInputItem[]>(() => {
    const arr: SimpleInputItem[] = [];
    const map = idToBlockRef.current;
    for (const { block } of parsedBlocks) {
      let foundId: string | undefined;
      for (const [id, b] of map.entries()) {
        if (b === block) {
          foundId = id;
          break;
        }
      }
      if (!foundId) {
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
  }, [parsedBlocks, idToBlockRef]);

  // Otros efectos similares a los originales (stylesLoaded, previewExpanded, versiones, etc)
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

  // Wrappers para funciones que requieren setters externos
  const reorderInputs = useCallback(
    (newOrder: string[]) =>
      reorderCodeByInputIds(newOrder, setCode, setHasUnsavedChanges),
    [reorderCodeByInputIds]
  );

  const updateInputBlock = useCallback(
    (inputId: string, newCodeBlock: string) =>
      handleUpdateInput(
        inputId,
        newCodeBlock,
        parsedBlocks,
        setCode,
        setHasUnsavedChanges
      ),
    [handleUpdateInput, parsedBlocks]
  );

  // Funciones de control para versiones usando el hook useVersions
  const onVersionChange = useCallback(
    (id: number | null) =>
      handleVersionChange(id, setCode, setEditingMode, setHasUnsavedChanges),
    [handleVersionChange]
  );

  const onVersionSave = useCallback(
    () => handleSave(code, "Manual edit", setHasUnsavedChanges),
    [handleSave, code]
  );

  const onVersionDelete = useCallback(
    (id: number) => handleDeleteVersion(id, setCode, onVersionChange),
    [handleDeleteVersion, onVersionChange]
  );

  // Resto de funciones (cancel, clear, download, generate) las pones como antes

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
  }, [prompt, code, versions, activeVersionId]);

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

    reorderCodeByInputIds: reorderInputs,
    handleUpdateInput: updateInputBlock,
    getUniqueCode,
    getCodeBlockByInputId,

    handleVersionChange: onVersionChange,
    handleSave: onVersionSave,
    handleDeleteVersion: onVersionDelete,
    handleCancel,
    handleClear,
    handleDownloadImage,
    onGenerateCode,
  };
}
