"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Headers from "@/components/Headers";
import PromptInput from "@/components/PromptInput";
import VersionSelector from "@/components/VersionSelector";
import ActionBar from "@/components/ActionBar";
import SidebarBuilder from "@/components/SidebarBuilder";
import InputList from "@/components/InputList";
import CodeEditor from "@/components/CodeEditor";
import PreviewArea from "@/components/PreviewArea";
import EditActions from "@/components/EditActions";
import { useFormBuilderLogic } from "@/hooks/useFormBuilderLogic";

export default function Home() {
  const logic = useFormBuilderLogic();

  if (!logic.isStylesLoaded) {
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
      <Navbar />
      <div
        className={`relative ${logic.isPreviewExpanded ? "z-[100]" : "z-10"}`}
      >
        <Headers />
        <div className="px-6 md:px-8 max-w-7xl mx-auto space-y-6 pb-6">
          <PromptInput
            prompt={logic.prompt}
            setPrompt={logic.setPrompt}
            onGenerate={logic.onGenerateCode}
            isGenerating={logic.isGenerating}
          />
          <VersionSelector
            versions={logic.versions}
            activeVersionId={logic.activeVersionId}
            setActiveVersionId={logic.handleVersionChange}
          />
          <ActionBar
            showCode={logic.showCode}
            setShowCode={logic.setShowCode}
            code={logic.code}
            copyToClipboard={async (text) => {
              await navigator.clipboard.writeText(text);
              alert("Código copiado!");
            }}
            downloadImage={logic.handleDownloadImage}
          />
        </div>
        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <SidebarBuilder
                onInsert={(codeBlock) =>
                  logic.setCode((prev) => prev + "\n" + codeBlock)
                }
                setEditingMode={logic.setEditingMode}
              />
            </div>
            <div className="lg:col-span-3">
              <InputList
                inputs={logic.inputs}
                onReorder={logic.reorderCodeByInputIds}
                onUpdateInput={logic.handleUpdateInput}
                getCodeBlockByInputId={logic.getCodeBlockByInputId}
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              {logic.showCode || logic.editingMode === "code" ? (
                <CodeEditor
                  localCode={logic.code}
                  setLocalCode={logic.setCode}
                />
              ) : (
                <PreviewArea
                  code={logic.code}
                  components={logic.components}
                  previewRef={logic.previewRef}
                  isExpanded={logic.isPreviewExpanded}
                  setIsExpanded={logic.setIsPreviewExpanded}
                />
              )}
              <EditActions
                hasUnsavedChanges={logic.hasUnsavedChanges}
                onSave={logic.handleSave}
                onCancel={logic.handleCancel}
                onClear={logic.handleClear}
                isPreviewExpanded={logic.isPreviewExpanded}
                setIsPreviewExpanded={logic.setIsPreviewExpanded}
                isPreviewVisible={
                  !logic.showCode && logic.editingMode !== "code"
                }
              />
              {logic.showVersionWarning && (
                <div className="mt-4">
                  <div
                    role="alert"
                    className="rounded-md bg-yellow-50 p-4 text-yellow-800 border border-yellow-400"
                  >
                    Has cambiado a una versión más antigua de Ant Design.
                    Algunos campos podrían no funcionar correctamente.
                    <button
                      onClick={() => logic.setShowVersionWarning(false)}
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
      <Footer />
    </div>
  );
}
