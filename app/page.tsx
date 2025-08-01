"use client";

import Header from "../components/Headers";
import LoadingScreen from "../components/LoadingScreen";
import FormBuilderLayout from "../components/FormBuilderLayout";
import { useFormBuilderLogic } from "../hooks/useFormBuilderLogic";
import { useAntdVersion } from "../context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";

export default function Home() {
  const { antdVersion, getBaseCode } = useAntdVersion();

  const logic = useFormBuilderLogic(
    antdVersion,
    getBaseCode,
    jsxParserComponentsByVersion
  );

  if (!logic.isStylesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Header />
      <FormBuilderLayout
        state={{
          ...logic,
        }}
        actions={{
          fetchGeneratedCode: async () => {
            const userMessage = { role: "user", content: logic.prompt.trim() };
            if (!logic.prompt.trim()) return alert("Prompt vacío");
            logic.setIsGenerating(true);
            try {
              const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  messages: logic.buildMessages().concat(userMessage),
                }),
              });

              const data = await res.json();
              if (data.error) {
                alert("Error API: " + data.error);
                return;
              }

              const maxId =
                logic.versions.length > 0
                  ? Math.max(...logic.versions.map((v) => v.id))
                  : 0;

              const rawCode = data.code || "";
              const cleanedCode = rawCode.includes("<Form")
                ? rawCode.replace(/<Form[^>]*>([\s\S]*?)<\/Form>/i, "$1").trim()
                : rawCode;

              const newVersion = {
                id: maxId + 1,
                prompt: logic.prompt.trim(),
                code: cleanedCode,
                messages: [
                  ...(logic.activeVersion?.messages || []),
                  userMessage,
                  { role: "assistant", content: data.code },
                ],
              };

              logic.setVersions((prev) => [...prev, newVersion]);
              logic.setActiveVersionId(newVersion.id);
              logic.setManualCode(cleanedCode);
              logic.setLocalCode(cleanedCode);
              logic.setPrompt("");
              logic.setShowCode(false);
              logic.setEditingMode("builder");

              setTimeout(() => logic.setHasUnsavedChanges(false), 0);
            } catch (e) {
              alert("Error al generar: " + e);
            } finally {
              logic.setIsGenerating(false);
            }
          },
          ...logic,
        }}
      />
    </div>
  );
}
