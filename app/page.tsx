"use client";

import Header from "../components/Headers";
import LoadingScreen from "../components/LoadingScreen";
import FormBuilderLayout from "../components/FormBuilderLayout";
import { useFormBuilderLogic } from "../hooks/useFormBuilderLogic";
import { useAntdVersion } from "../context/AntdVersionContext";
import { jsxParserComponentsByVersion } from "@/constants/antd/jsxParserComponentsByVersion";
import { fetchGeneratedCode } from "@/utils/generateCode";

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
        state={logic}
        actions={{
          ...logic,
          fetchGeneratedCode: async () => {
            if (!logic.prompt.trim()) return alert("Prompt vacío");

            logic.setIsGenerating(true);

            try {
              await fetchGeneratedCode(
                logic.prompt,
                logic.code,
                logic.activeVersion,
                logic.versions,
                ({ code, messages, newVersionId }) => {
                  const newVersion = {
                    id: newVersionId,
                    prompt: logic.prompt.trim(),
                    code,
                    messages,
                  };

                  logic.setVersions((prev) => [...prev, newVersion]);
                  logic.setActiveVersionId(newVersionId);
                  logic.setCode(code);
                  logic.setLocalCode(code);
                  logic.setPrompt("");
                  logic.setShowCode(false);
                  logic.setEditingMode("builder");

                  setTimeout(() => logic.setHasUnsavedChanges(false), 0);
                }
              );
            } catch (e) {
              alert("Error al generar: " + e);
            } finally {
              logic.setIsGenerating(false);
            }
          },
        }}
      />
    </div>
  );
}
