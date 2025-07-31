import { Input, Button, Alert } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export default function CodeEditor({
  manualCode,
  setManualCode,
  setEditingMode,
  activeVersion,
  setVersions,
  setActiveVersionId,
}: {
  manualCode: string;
  setManualCode: (value: string) => void;
  setEditingMode: (mode: "builder" | "code") => void;
  activeVersion: any;
  setVersions: (versions: any[]) => void;
  setActiveVersionId: (id: number) => void;
}) {
  const [localCode, setLocalCode] = useState(manualCode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalCode(manualCode);
  }, [manualCode]);

  useEffect(() => {
    setHasUnsavedChanges(
      localCode.trim() !== (activeVersion?.code || "").trim()
    );
  }, [localCode, activeVersion]);

  const handleSave = () => {
    const newVersion = {
      id: activeVersion?.id ? activeVersion.id + 1 : 1,
      prompt: "Manual edit",
      code: localCode,
      messages: activeVersion?.messages || [],
    };
    setVersions((prev) => [...prev, newVersion]);
    setManualCode(localCode);
    setActiveVersionId(newVersion.id);
    setEditingMode("builder");
  };

  const handleCancel = () => {
    setLocalCode(activeVersion?.code || "");
    setHasUnsavedChanges(false);
    setEditingMode("builder");
  };

  return (
    <div className="p-6 w-full">
      <div className="relative">
        <TextArea
          rows={20}
          value={localCode}
          onChange={(e) => setLocalCode(e.target.value)}
          className="text-sm bg-gray-50 border-gray-200 rounded-lg p-4 font-mono"
          style={{
            fontFamily:
              "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        />

        {hasUnsavedChanges && (
          <Alert
            message="Cambios sin guardar"
            type="warning"
            showIcon
            className="mt-4"
          />
        )}

        <div className="mt-4 flex gap-4">
          <Button
            type="default"
            onClick={handleCancel}
            className="border-gray-300 text-gray-600 hover:border-gray-400"
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            className="bg-gray-900 border-gray-900 hover:bg-gray-800"
            onClick={handleSave}
          >
            Save & Return
          </Button>
        </div>
      </div>
    </div>
  );
}
