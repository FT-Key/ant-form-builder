import { Input } from "antd";
import { useRef } from "react";
import { useCodeEditorShortcuts } from "@/hooks/useCodeEditorShortcuts";

const { TextArea } = Input;

export default function CodeEditor({
  localCode,
  setLocalCode,
  onSave,
}: {
  localCode: string;
  setLocalCode: (code: string) => void;
  onSave: () => void;
}) {
  const textareaRef = useRef<any>(null);

  useCodeEditorShortcuts({
    textareaRef,
    onSave,
    onChange: setLocalCode,
  });

  return (
    <div className="p-6 w-full">
      <TextArea
        ref={textareaRef} // <-- Aquí el ref al componente Antd TextArea
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
    </div>
  );
}
