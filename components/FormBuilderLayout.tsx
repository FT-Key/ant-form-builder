"use client";

import { Alert, message } from "antd";
import PromptInput from "./PromptInput";
import VersionSelector from "./VersionSelector";
import ActionBar from "./ActionBar";
import SidebarBuilder from "./SidebarBuilder";
import PreviewArea from "./PreviewArea";
import CodeEditor from "./CodeEditor";
import EditActions from "./EditActions";

export default function FormBuilderLayout({
  state,
  actions,
}: {
  state: any;
  actions: any;
}) {
  const {
    prompt,
    setPrompt,
    isGenerating,
    versions,
    activeVersionId,
    localCode,
    showCode,
    editingMode,
    hasUnsavedChanges,
    components,
    previewRef,
    showVersionWarning,
  } = state;

  const {
    fetchGeneratedCode,
    handleVersionChange,
    setShowCode,
    handleInsert,
    setEditingMode,
    setLocalCode,
    handleSave,
    handleCancel,
    handleClear,
    handleDownloadImage,
  } = actions;

  return (
    <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-6">
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
              onClose={() => actions.setShowVersionWarning(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
