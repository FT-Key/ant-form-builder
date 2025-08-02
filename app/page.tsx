"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SidebarBuilder from "../components/SidebarBuilder";
import PreviewArea from "../components/PreviewArea";
import CodeEditor from "../components/CodeEditor";
import InputList from "../components/InputList";
import EditActions from "../components/EditActions";
import PromptInput from "../components/PromptInput";
import VersionSelector from "../components/VersionSelector";
import ActionBar from "../components/ActionBar";
import Headers from "../components/Headers";
import { useAntdVersion } from "../context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";
import { buildMessages, fetchGeneratedCode } from "../utils/generateCode";

export default function Home() {
  const { antdVersion, getBaseCode } = useAntdVersion();
  const components = jsxParserComponentsByVersion[antdVersion];
  const previewRef = useRef<HTMLDivElement>(null);

  // Estados generales
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [prevAntdVersion, setPrevAntdVersion] = useState<string | null>(null);

  // --- Nuevo: manejo inputs para InputList ---
  // Parse simple inputs en base a <Form.Item> bloques
  const parseInputsFromCode = useCallback((codeStr: string) => {
    const regex = /<Form\.Item[^>]*>([\s\S]*?)<\/Form\.Item>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(codeStr))) {
      matches.push(match[0]);
    }
    return matches;
  }, []);

  const inputsBlocks = parseInputsFromCode(code);

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

      setCode(newCode);
      setHasUnsavedChanges(true);
    },
    [inputs, inputsBlocks]
  );

  // Load styles
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsStylesLoaded(true);
    } else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Carga base de código al cambiar versión
  useEffect(() => {
    if (!code.trim()) {
      const baseCode = getBaseCode(antdVersion);
      setCode(baseCode);
    }
  }, [antdVersion, getBaseCode]);

  // Detectar cambios
  useEffect(() => {
    const activeVersion = versions.find((v) => v.id === activeVersionId);
    const trimmedCode = code.trim();
    const trimmedCurrent = (activeVersion?.code || "").trim();
    setHasUnsavedChanges(trimmedCode !== trimmedCurrent);
  }, [code, activeVersionId, versions]);

  // Aviso downgrade versión
  useEffect(() => {
    if (prevAntdVersion && antdVersion < prevAntdVersion) {
      setShowVersionWarning(true);
    }
    setPrevAntdVersion(antdVersion);
  }, [antdVersion]);

  const handleUpdateInput = useCallback(
    (inputId: string, newCodeBlock: string) => {
      const updatedBlocks = inputsBlocks.map((block, index) => {
        const id = inputs[index].id;
        return id === inputId ? newCodeBlock : block;
      });

      const updatedCode = updatedBlocks.join("\n");
      setCode(updatedCode);
      setHasUnsavedChanges(true);
    },
    [inputs, inputsBlocks]
  );

  // Handlers versiones y código
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
    const newVersion = {
      id: maxId + 1,
      prompt: "Manual edit",
      code,
      messages: versions.find((v) => v.id === activeVersionId)?.messages || [],
    };
    setVersions([...versions, newVersion]);
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

  // Generación código con IA
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

  const getCodeBlockByInputId = (id: string) => {
    const index = inputs.findIndex((input) => input.id === id);
    return inputsBlocks[index];
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

      <div className="relative z-10">
        {/* Header */}
        <Headers />

        {/* Contenido con márgenes laterales */}
        <div className="px-6 md:px-8 max-w-7xl mx-auto space-y-6 pb-6">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={onGenerateCode}
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
            code={code}
            copyToClipboard={async (text) => {
              try {
                await navigator.clipboard.writeText(text);
                alert("Código copiado!");
              } catch {
                alert("Error al copiar");
              }
            }}
            downloadImage={handleDownloadImage}
          />
        </div>

        {/* Grilla sin márgenes laterales para aprovechar todo el ancho */}
        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <SidebarBuilder
                onInsert={(codeBlock) =>
                  setCode((prev) => prev + "\n" + codeBlock)
                }
                setEditingMode={setEditingMode}
              />
            </div>

            <div className="lg:col-span-3">
              <InputList
                inputs={inputs}
                onReorder={reorderCodeByInputIds}
                onUpdateInput={handleUpdateInput}
                getCodeBlockByInputId={getCodeBlockByInputId}
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              {showCode || editingMode === "code" ? (
                <CodeEditor localCode={code} setLocalCode={setCode} />
              ) : (
                <PreviewArea
                  code={code}
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
                <div className="mt-4">
                  <div
                    role="alert"
                    className="rounded-md bg-yellow-50 p-4 text-yellow-800 border border-yellow-400"
                  >
                    Has cambiado a una versión más antigua de Ant Design.
                    Algunos campos podrían no funcionar correctamente.
                    <button
                      onClick={() => setShowVersionWarning(false)}
                      className="ml-4 underline"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
