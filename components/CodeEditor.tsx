"use client";
import { Input } from "antd";

const { TextArea } = Input;

export default function CodeEditor({
  localCode,
  setLocalCode,
}: {
  localCode: string;
  setLocalCode: (code: string) => void;
}) {
  return (
    <div className="p-6 w-full">
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
    </div>
  );
}
