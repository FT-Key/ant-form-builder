"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select as AntSelect,
  message,
} from "antd";
import {
  SendOutlined,
  DownloadOutlined,
  CopyOutlined,
  EyeOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import ReactJsxParser from "react-jsx-parser";

const { TextArea } = Input;
const { Option } = AntSelect;

function extractJSX(code: string): string {
  const match = code.match(/return\s*\(([\s\S]*?)\);/);
  return match ? match[1].trim() : "";
}

const JSXPARSER_COMPONENTS = {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Checkbox,
  Radio,
  Select: AntSelect,
  TextArea,
  Option,
  FormItem: Form.Item,
  "Input.Password": Input.Password,
  "Radio.Group": Radio.Group,
};

export default function Home() {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [versions, setVersions] = useState<
    { id: number; prompt: string; code: string; messages: any[] }[]
  >([]);

  const [editingMode, setEditingMode] = useState<"builder" | "code">("builder");
  const [manualCode, setManualCode] = useState<string>("");

  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsStylesLoaded(true);
    } else {
      const onLoad = () => setIsStylesLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  if (!isStylesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          {/* Spinner CSS puro */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto spinner"></div>
          <p className="mt-2 text-lg font-semibold">Ant Form Builder</p>
        </div>
      </div>
    );
  }

  const activeVersion = versions.find((v) => v.id === activeVersionId);

  const buildMessages = () => {
    if (!activeVersion && !manualCode.trim()) return [];

    const systemMessage = {
      role: "system",
      content:
        "You generate React forms using Ant Design only. Use <Form>, <Form.Item>, <Input>, <Button>, etc. Return ONLY JSX code without explanations.",
    };

    const codeContext = {
      role: "user",
      content: `Current form code:\n${manualCode.trim()}`,
    };

    const baseMessages = activeVersion ? activeVersion.messages : [];

    // Devolvemos el sistema, el código manual y luego la conversación previa
    return [systemMessage, codeContext, ...baseMessages];
  };

  const fetchGeneratedCode = async () => {
    if (!prompt.trim()) {
      alert("Por favor escribe un prompt válido");
      return;
    }

    setIsGenerating(true);
    const userMessage = { role: "user", content: prompt.trim() };
    const prevMessages = activeVersion ? activeVersion.messages : [];
    const messagesToSend = activeVersion
      ? [...prevMessages, userMessage]
      : [userMessage];

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: buildMessages().concat(userMessage) }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error de API: " + data.error);
        return;
      }

      const newVersion = {
        id: versions.length + 1,
        prompt: prompt.trim(),
        code: data.code || "",
        messages: messagesToSend.concat({
          role: "assistant",
          content: data.code,
        }),
      };

      setManualCode(data.code || "");
      setVersions([...versions, newVersion]);
      setActiveVersionId(newVersion.id);
      setPrompt("");
      setShowCode(false);
    } catch (e) {
      alert("Error al generar: " + e);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Código copiado!");
    } catch (err) {
      message.error("No se pudo copiar el código");
    }
  };

  const currentCode = activeVersion?.code || manualCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in-down">
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                Ant Form Builder
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Generate stunning Ant Design forms with AI. Describe your vision
              and watch it come to life.
            </p>
          </div>

          {/* Prompt Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up animation-delay-300">
            <div className="space-y-6">
              <div className="relative">
                <TextArea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="✨ Describe your dream form: login, contact, registration, survey..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm rounded-xl resize-none transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-white">
                      <ThunderboltOutlined className="animate-spin text-2xl text-yellow-400" />
                      <span className="text-lg font-medium">
                        Generating magic...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  onClick={fetchGeneratedCode}
                  loading={isGenerating}
                  className="flex-1 md:flex-none h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderColor: "transparent",
                  }}
                >
                  {isGenerating ? "Generating..." : "Generate / Improve Form"}
                </Button>

                <AntSelect
                  value={activeVersionId ?? undefined}
                  placeholder="🎯 Select version"
                  onChange={(id) => setActiveVersionId(id)}
                  size="large"
                  style={{ width: 200 }}
                  disabled={versions.length === 0}
                  className="version-select"
                  classNames={{ popup: { root: "version-dropdown" } }}
                >
                  {versions.map((v) => (
                    <Option key={v.id} value={v.id}>
                      Version {v.id}
                    </Option>
                  ))}
                </AntSelect>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {(activeVersion || manualCode.trim()) && (
            <div
              id="action-bar"
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl px-6 py-4 shadow-xl sticky top-4 z-20 animate-slide-in-right animation-delay-600"
            >
              <div className="flex justify-between items-center">
                <Button
                  icon={showCode ? <EyeOutlined /> : <CodeOutlined />}
                  onClick={() => setShowCode(!showCode)}
                  size="large"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  {showCode ? "Preview Form" : "View Code"}
                </Button>

                {showCode ? (
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(currentCode)}
                    size="large"
                    className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Copy Code
                  </Button>
                ) : (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={downloadImage}
                    size="large"
                    className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Download Image
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Preview/Code Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up animation-delay-900">
            {/* Sidebar builder */}
            <div className="space-y-4 bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg">
              <h3 className="text-white text-lg font-semibold mb-2">
                🧱 Components
              </h3>
              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev + `\n<Form.Item label="Text"><Input /></Form.Item>`
                  )
                }
              >
                + Input
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Password"><Input.Password /></Form.Item>`
                  )
                }
              >
                + Password
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item>`
                  )
                }
              >
                + Email
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Number"><InputNumber /></Form.Item>`
                  )
                }
              >
                + Number
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Date"><DatePicker /></Form.Item>`
                  )
                }
              >
                + Date
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Select"><Select><Option value="A">Option A</Option><Option value="B">Option B</Option></Select></Form.Item>`
                  )
                }
              >
                + Select
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Checkbox"><Checkbox>Accept terms</Checkbox></Form.Item>`
                  )
                }
              >
                + Checkbox
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Radio Group"><Radio.Group><Radio value="1">Option 1</Radio><Radio value="2">Option 2</Radio></Radio.Group></Form.Item>`
                  )
                }
              >
                + Radio Group
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item label="Textarea"><TextArea rows={4} /></Form.Item>`
                  )
                }
              >
                + TextArea
              </Button>

              <Button
                block
                onClick={() =>
                  setManualCode(
                    (prev) =>
                      prev +
                      `\n<Form.Item><Button type="primary" htmlType="submit">Submit</Button></Form.Item>`
                  )
                }
              >
                + Submit Button
              </Button>

              <Button
                block
                onClick={() => setManualCode("")}
                danger
                className="mt-2"
              >
                Clear Form
              </Button>

              <Button
                block
                type="primary"
                onClick={() => setEditingMode("code")}
                className="mt-4"
              >
                Edit Code
              </Button>
            </div>

            {/* Main preview or editor */}
            <div
              className="md:col-span-3 backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10 min-h-96"
              ref={previewRef}
            >
              {showCode || editingMode === "code" ? (
                <div className="relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <TextArea
                    rows={20}
                    value={activeVersion?.code || manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="textArea text-sm font-mono bg-gray-900/50 text-white rounded-xl p-4 border border-gray-700/50"
                  />
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => {
                      setEditingMode("builder");
                    }}
                  >
                    Save & Return
                  </Button>
                </div>
              ) : (
                <div className="previewArea bg-white rounded-xl p-8 shadow-inner min-h-80 transition-all duration-500 hover:shadow-2xl">
                  <Form layout="vertical">
                    <ReactJsxParser
                      jsx={manualCode.replace(/Form\.Item/g, "FormItem")}
                      components={JSXPARSER_COMPONENTS}
                    />
                  </Form>
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {!activeVersion && (
            <div className="text-center py-20 animate-fade-in-up animation-delay-600">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Ready to build something amazing?
              </h3>
              <p className="text-gray-300 text-lg max-w-md mx-auto">
                Start by describing your form in the prompt above. Let AI do the
                magic!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
