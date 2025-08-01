"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Alert, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";

import Header from "../components/Headers";
import PromptInput from "../components/PromptInput";
import VersionSelector from "../components/VersionSelector";
import ActionBar from "../components/ActionBar";
import SidebarBuilder from "../components/SidebarBuilder";
import PreviewArea from "../components/PreviewArea";
import CodeEditor from "../components/CodeEditor";
import EditActions from "../components/EditActions";

import { useAntdVersion } from "../context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";

export default function Home() {
  const { antdVersion, getBaseCode } = useAntdVersion();
  const components = jsxParserComponentsByVersion[antdVersion];

  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [manualCode, setManualCode] = useState<string>("");
  const [localCode, setLocalCode] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  // Init styles
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsStylesLoaded(true);
    } else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Antd version downgrade warning
  useEffect(() => {
    if (prevAntdVersion && antdVersion < prevAntdVersion) {
      setShowVersionWarning(true);
    }
    setPrevAntdVersion(antdVersion);
  }, [antdVersion]);

  // Set initial base code on load
  useEffect(() => {
    const baseCode = getBaseCode(antdVersion);
    setManualCode(baseCode);
  }, [antdVersion, getBaseCode]);

  // Sync manual → local
  useEffect(() => {
    setLocalCode(manualCode);
  }, [manualCode]);

  // Detect changes
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
    const baseMessages = activeVersion ? activeVersion.messages : [];
    return [systemMessage, codeContext, ...baseMessages];
  };

  const fetchGeneratedCode = async () => {
    if (!prompt.trim()) return alert("Prompt vacío");
    setIsGenerating(true);

    const userMessage = { role: "user", content: prompt.trim() };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: buildMessages().concat(userMessage) }),
      });

      const data = await res.json();
      if (data.error) {
        alert("Error API: " + data.error);
        return;
      }

      const maxId =
        versions.length > 0 ? Math.max(...versions.map((v) => v.id)) : 0;
      const rawCode = data.code || "";
      const cleanedCode = rawCode.includes("<Form")
        ? rawCode.replace(/<Form[^>]*>([\s\S]*?)<\/Form>/i, "$1").trim()
        : rawCode;

      const newVersion = {
        id: maxId + 1,
        prompt: prompt.trim(),
        code: cleanedCode,
        messages: [
          ...(activeVersion?.messages || []),
          userMessage,
          { role: "assistant", content: data.code },
        ],
      };

      setVersions((prev) => [...prev, newVersion]);
      setActiveVersionId(newVersion.id);
      setManualCode(cleanedCode);
      setLocalCode(cleanedCode);
      setPrompt("");
      setShowCode(false);
      setEditingMode("builder");

      setTimeout(() => setHasUnsavedChanges(false), 0);
    } catch (e) {
      alert("Error al generar: " + e);
    } finally {
      setIsGenerating(false);
    }
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

  if (!isStylesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 font-medium text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <Header />

        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={fetchGeneratedCode}
          isGenerating={isGenerating}
        />

        <VersionSelector
          versions={versions}
          activeVersionId={activeVersionId}
          setActiveVersionId={handleVersionChange}
        />

        <ActionBar
          showCode={showCode}
          setShowCode={setShowCode}
          code={localCode}
          copyToClipboard={async (text) => {
            try {
              await navigator.clipboard.writeText(text);
              message.success("Código copiado!");
            } catch {
              message.error("Error al copiar");
            }
          }}
          downloadImage={handleDownloadImage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SidebarBuilder
              onInsert={handleInsert}
              setEditingMode={setEditingMode}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            {showCode || editingMode === "code" ? (
              <CodeEditor localCode={localCode} setLocalCode={setLocalCode} />
            ) : (
              <PreviewArea
                manualCode={localCode}
                components={components}
                previewRef={previewRef}
              />
            )}

            <EditActions
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={handleSave}
              onCancel={handleCancel}
              onClear={handleClear}
            />

            {showVersionWarning && (
              <Alert
                type="warning"
                showIcon
                message="Has cambiado a una versión más antigua de Ant Design. Algunos campos podrían no funcionar correctamente."
                closable
                onClose={() => setShowVersionWarning(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
