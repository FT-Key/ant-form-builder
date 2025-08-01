"use client";

import { useEffect, useRef, useState } from "react";
import {
  Input,
  Select,
  message,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Checkbox,
  Radio,
} from "antd";
import html2canvas from "html2canvas";
import {
  RocketOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  CodeOutlined,
  CopyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import Header from "../components/Headers";
import PromptInput from "../components/PromptInput";
import VersionSelector from "../components/VersionSelector";
import ActionBar from "../components/ActionBar";
import SidebarBuilder from "../components/SidebarBuilder";
import PreviewArea from "../components/PreviewArea";
import CodeEditor from "../components/CodeEditor";
import EditActions from "../components/EditActions";

import ReactJsxParser from "react-jsx-parser";
import { useAntdVersion } from "../context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";

const { TextArea } = Input;
const { Option } = Select;

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
  const previewRef = useRef<HTMLDivElement>(null);

  const [nameCounters, setNameCounters] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const baseCode = getBaseCode(antdVersion);
    setManualCode(baseCode);
  }, [antdVersion, getBaseCode]);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsStylesLoaded(true);
    } else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Sync manualCode → localCode
  useEffect(() => {
    setLocalCode(manualCode);
  }, [manualCode]);

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  // Detect changes
  useEffect(() => {
    const trimmedLocal = localCode.trim();
    const trimmedCurrent = (activeVersion?.code || manualCode).trim();
    setHasUnsavedChanges(trimmedLocal !== trimmedCurrent);
  }, [localCode, activeVersion, manualCode]);

  const currentCode = manualCode;

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

      // Obtener máximo ID actual para asignar uno nuevo
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

      // Actualizar todo en el orden correcto
      setVersions((prev) => [...prev, newVersion]);
      setActiveVersionId(newVersion.id);
      setManualCode(cleanedCode);
      setLocalCode(cleanedCode);
      setPrompt("");
      setShowCode(false);
      setEditingMode("builder");

      // Asegurar que no hay cambios pendientes después de generar
      // Usar setTimeout para asegurar que todos los estados se actualicen primero
      setTimeout(() => {
        setHasUnsavedChanges(false);
      }, 0);
    } catch (e) {
      alert("Error al generar: " + e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Código copiado!");
    } catch {
      message.error("No se pudo copiar el código");
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;
    await document.fonts.ready;
    await new Promise((res) => setTimeout(res, 100));
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `form-version-${activeVersionId ?? "latest"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  function generateUniqueName(baseName: string, existingCode: string) {
    const regex = new RegExp(`${baseName}(\\d*)`, "g");
    const matches = [];
    let match;
    while ((match = regex.exec(existingCode)) !== null) {
      const num = match[1] ? parseInt(match[1], 10) : 0;
      matches.push(num);
    }
    matches.sort((a, b) => a - b);

    let i = 1;
    while (matches.includes(i)) {
      i++;
    }
    return baseName + i;
  }

  const handleInsert = (code: string, label: string) => {
    const baseName = label.toLowerCase().replace(/\s+/g, "");
    const uniqueName = generateUniqueName(baseName, localCode); // usa localCode ahora

    const newCode = code.replace(/name="[^"]*"/, `name="${uniqueName}"`);
    const updatedCode = localCode + "\n" + newCode;

    setLocalCode(updatedCode); // solo localCode
    // NO actualizar manualCode
  };

  const handleSave = () => {
    const maxId =
      versions.length > 0 ? Math.max(...versions.map((v) => v.id)) : 0;

    const newVersion = {
      id: maxId + 1,
      prompt: "Manual edit",
      code: localCode,
      messages: activeVersion?.messages || [],
    };

    setVersions((prev) => [...prev, newVersion]);
    setManualCode(localCode); // ✅ este es el nuevo punto de verdad
    setActiveVersionId(newVersion.id);
    setEditingMode("builder");
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setLocalCode(activeVersion?.code || manualCode);
    setHasUnsavedChanges(false);
    setEditingMode("builder");
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

  if (!isStylesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto spinner"></div>
          <p className="mt-2 text-lg font-semibold">Ant Form Builder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
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
          code={currentCode}
          copyToClipboard={copyToClipboard}
          downloadImage={downloadImage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                manualCode={localCode} // ← usamos localCode para que se vea lo que se edita
                components={components}
                previewRef={previewRef}
              />
            )}

            {/* Botones siempre visibles */}
            <EditActions
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
