// components/SidebarBuilder.tsx
"use client";
import { useAntdVersion } from "../context/AntdVersionContext";
import { componentsByVersion } from "@/constants/antd/componentsByVersion";
import AntdVersionSelector from "./AntdVersionSelector";

export default function SidebarBuilder({
  onInsert,
  setEditingMode,
}: {
  onInsert: (code: string) => void;
  setEditingMode: (mode: "builder" | "code") => void;
}) {
  const { antdVersion } = useAntdVersion();

  const buttons = componentsByVersion[antdVersion] || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
          <h3 className="text-gray-900 text-lg font-medium">Components</h3>
        </div>
      </div>
      <div className="p-4">
        <AntdVersionSelector />
      </div>
      <div className="p-4 space-y-2">
        {buttons.map(({ label, code }) => (
          <button
            key={label}
            onClick={() => onInsert("\n" + code)}
            className="block w-full text-left px-3 py-2 border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded"
          >
            <span className="text-gray-400 mr-2">+</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
