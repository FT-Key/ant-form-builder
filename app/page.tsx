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
  PlusOutlined,
  ClearOutlined,
  EditOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import ReactJsxParser from "react-jsx-parser";
import domtoimage from "dom-to-image-more";

const { TextArea } = Input;
const { Option } = AntSelect;

function extractJSX(code: string): string {
  const match = code.match(/return\s*\(([\s\S]*?)\);/);
  return match ? match[1].trim() : "";
}

function extractInnerFormJSX(code: string): string {
  const match = code.match(/<Form[^>]*>([\s\S]*?)<\/Form>/);
  return match ? match[1].trim() : extractJSX(code);
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

      // ✅ Orden correcto para evitar render roto
      setVersions((prev) => [...prev, newVersion]);
      setManualCode(extractInnerFormJSX(data.code || ""));
      setActiveVersionId(newVersion.id);
      setPrompt("");
      setShowCode(false);
      setEditingMode("builder"); // Fuerza volver a vista previa
    } catch (e) {
      alert("Error al generar: " + e);
    } finally {
      setIsGenerating(false);
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

  const downloadImageDOM = async () => {
  if (!previewRef.current) return;

  await document.fonts.ready;
  await new Promise((res) => setTimeout(res, 200)); // esperar render

  const blob = await domtoimage.toBlob(previewRef.current, {
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
    },
    filter: (node) => {
      return true; // capturá todo
    },
  });

  const link = document.createElement("a");
  link.download = `form-version-${activeVersionId ?? "latest"}.png`;
  link.href = URL.createObjectURL(blob);
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

  const currentCode = manualCode;

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6 py-8">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                Form Builder
              </h1>
              <div className="w-12 h-px bg-gray-900 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Create professional Ant Design forms with precision and elegance.
            </p>
          </div>

          {/* Prompt Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="space-y-6">
              <div className="relative">
                <TextArea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe your form requirements..."
                  className="w-full border-gray-200 text-gray-900 placeholder-gray-400 rounded-md resize-none focus:border-gray-400 focus:ring-0"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.6",
                    fontWeight: "400",
                  }}
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-md">
                    <div className="flex items-center gap-3 text-gray-700">
                      <ThunderboltOutlined className="animate-spin text-lg" />
                      <span className="font-medium text-sm">
                        Generating form...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  onClick={fetchGeneratedCode}
                  loading={isGenerating}
                  className="flex-1 sm:flex-none h-11 bg-gray-900 border-gray-900 hover:bg-gray-800 font-medium"
                >
                  {isGenerating ? "Generating..." : "Generate Form"}
                </Button>

                <AntSelect
                  value={activeVersionId ?? undefined}
                  placeholder="Select version"
                  onChange={(id) => setActiveVersionId(id)}
                  size="large"
                  style={{ width: 200 }}
                  disabled={versions.length === 0}
                  className="version-select-elegant"
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
            <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm sticky top-4 z-20">
              <div className="flex justify-between items-center">
                <Button
                  icon={showCode ? <EyeOutlined /> : <CodeOutlined />}
                  onClick={() => setShowCode(!showCode)}
                  size="large"
                  className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
                >
                  {showCode ? "Preview Form" : "View Code"}
                </Button>

                {showCode ? (
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(currentCode)}
                    size="large"
                    className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
                  >
                    Copy Code
                  </Button>
                ) : (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={downloadImage}
                    size="large"
                    className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
                  >
                    Export
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Component Sidebar */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <h3 className="text-gray-900 text-lg font-medium">
                    Components
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Text Field" name="text" rules={[{ required: true }]}><Input placeholder="Enter text" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Text Input
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Password" name="password" rules={[{ required: true }]}><Input.Password placeholder="Enter password" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Password
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input placeholder="Enter email" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Email
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Number" name="number"><InputNumber style={{ width: '100%' }} placeholder="Enter number" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Number
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Date" name="date"><DatePicker style={{ width: '100%' }} placeholder="Select date" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Date Picker
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Select" name="select"><Select placeholder="Choose option"><Option value="option1">Option 1</Option><Option value="option2">Option 2</Option></Select></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Select
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item name="checkbox" valuePropName="checked"><Checkbox>I agree to the terms</Checkbox></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Checkbox
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Options" name="radio"><Radio.Group><Radio value="1">Option 1</Radio><Radio value="2">Option 2</Radio></Radio.Group></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Radio Group
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item label="Message" name="message"><TextArea rows={4} placeholder="Enter your message" /></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Text Area
                </Button>

                <Button
                  block
                  size="middle"
                  onClick={() =>
                    setManualCode(
                      (prev) =>
                        prev +
                        `\n<Form.Item><Button type="primary" htmlType="submit" className="bg-gray-900 border-gray-900 hover:bg-gray-800">Submit</Button></Form.Item>`
                    )
                  }
                  className="text-left justify-start border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-400 mr-2">+</span>
                  Submit Button
                </Button>
              </div>

              <div className="p-4 border-t border-gray-100 space-y-2">
                <Button
                  block
                  icon={<ClearOutlined />}
                  onClick={() => setManualCode("")}
                  className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  size="middle"
                >
                  Clear Form
                </Button>

                <Button
                  block
                  icon={<EditOutlined />}
                  onClick={() => setEditingMode("code")}
                  className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                  size="middle"
                >
                  Edit Code
                </Button>
              </div>
            </div>

            {/* Main Preview/Code Area */}
            <div
              className="form-capture-area lg:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-96"
              ref={previewRef}
            >
              {showCode || editingMode === "code" ? (
                <div className="p-6">
                  <div className="relative">
                    <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <TextArea
                      rows={20}
                      value={currentCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="text-sm bg-gray-50 border-gray-200 rounded-lg p-4 font-mono"
                      style={{
                        fontFamily:
                          "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    />
                    {editingMode === "code" && (
                      <Button
                        type="primary"
                        className="mt-4 bg-gray-900 border-gray-900 hover:bg-gray-800"
                        onClick={() => setEditingMode("builder")}
                      >
                        Save & Return
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  {currentCode || manualCode ? (
                    <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
                      <Form
                        layout="vertical"
                        className="max-w-lg mx-auto"
                        onFinish={(values) =>
                          console.log("Form values:", values)
                        }
                      >
                        <ReactJsxParser
                          jsx={manualCode}
                          components={JSXPARSER_COMPONENTS}
                          key={manualCode} // <- Esto fuerza a recrear el componente cuando el código cambia
                        />
                      </Form>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <RocketOutlined className="text-2xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Ready to create
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        Start by describing your form requirements or add
                        components manually from the sidebar.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
