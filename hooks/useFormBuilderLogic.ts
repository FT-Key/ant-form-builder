"use client";

import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { toPng } from "html-to-image";
import type { AntdVersion } from "../context/AntdVersionContext";

export function useFormBuilderLogic(
  antdVersion: AntdVersion,
  getBaseCode: (v: AntdVersion) => string,
  jsxParserComponentsByVersion: Record<string, any>
) {
  const components = jsxParserComponentsByVersion[antdVersion];
  const previewRef = useRef<HTMLDivElement>(null);

  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [localCode, setLocalCode] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  useEffect(() => {
    if (document.readyState === "complete") setIsStylesLoaded(true);
    else {
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
    setManualCode(baseCode);
  }, [antdVersion, getBaseCode]);

  useEffect(() => {
    setLocalCode(manualCode);
  }, [manualCode]);

  useEffect(() => {
    const trimmedLocal = localCode.trim();
    const trimmedCurrent = (activeVersion?.code || manualCode).trim();
    setHasUnsavedChanges(trimmedLocal !== trimmedCurrent);
  }, [localCode, activeVersion, manualCode]);

  const buildMessages = () => {
    const systemMessage = {
      role: "system",
      content:
        "You generate React forms using Ant Design only. Use <Form>, <Form.Item>, <Input>, <Button>, etc. Return ONLY JSX code without explanations.",
    };
    const codeContext = {
      role: "user",
      content: `Current form code:\n${manualCode}`,
    };
    const baseMessages = activeVersion?.messages || [];
    return [systemMessage, codeContext, ...baseMessages];
  };

  const handleInsert = (code: string, label: string) => {
    const baseName = label.toLowerCase().replace(/\s+/g, "");
    const regex = new RegExp(`${baseName}(\\d*)`, "g");
    const matches = Array.from(localCode.matchAll(regex)).map((m) =>
      m[1] ? parseInt(m[1]) : 0
    );
    const nextIndex = Math.max(0, ...matches) + 1;
    const uniqueName = `${baseName}${nextIndex}`;
    const updated = code.replace(/name="[^"]*"/, `name="${uniqueName}"`);
    setLocalCode((prev) => prev + "\n" + updated);
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
    setManualCode(localCode);
    setActiveVersionId(newVersion.id);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setLocalCode(activeVersion?.code || manualCode);
    setHasUnsavedChanges(false);
    setEditingMode("builder");
  };

  const handleClear = () => {
    setManualCode("");
    setLocalCode("");
    setHasUnsavedChanges(true);
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

  const handleVersionChange = (id: number) => {
    const version = versions.find((v) => v.id === id);
    if (version) {
      setActiveVersionId(id);
      setManualCode(version.code);
      setLocalCode(version.code);
      setEditingMode("builder");
      setHasUnsavedChanges(false);
    }
  };

  return {
    previewRef,
    prompt,
    setPrompt,
    manualCode,
    setManualCode,
    localCode,
    setLocalCode,
    hasUnsavedChanges,
    versions,
    setVersions,
    editingMode,
    setEditingMode,
    activeVersionId,
    setActiveVersionId,
    showCode,
    setShowCode,
    isGenerating,
    setIsGenerating,
    showVersionWarning,
    setShowVersionWarning,
    handleInsert,
    handleSave,
    handleCancel,
    handleClear,
    handleDownloadImage,
    handleVersionChange,
    buildMessages,
    components,
    isStylesLoaded,
    activeVersion,
    setHasUnsavedChanges,
  };
}
