// components/SidebarBuilder.tsx
"use client";
import { useState, useMemo } from "react";
import { useAntdVersion } from "../context/AntdVersionContext";
import { componentsByVersion } from "@/constants/antd/componentsByVersion";
import AntdVersionSelector from "./AntdVersionSelector";
import { Input } from "antd";

export default function SidebarBuilder({
  onInsert,
  setEditingMode,
}: {
  onInsert: (code: string, type: string) => void;
  setEditingMode: (mode: "builder" | "code") => void;
}) {
  const { antdVersion } = useAntdVersion();
  const [search, setSearch] = useState("");

  const buttons = componentsByVersion[antdVersion] || [];

  const filteredButtons = useMemo(() => {
    const lower = search.toLowerCase();
    return buttons.filter(({ label }) => label.toLowerCase().includes(lower));
  }, [search, buttons]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[500px] max-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
          <h3 className="text-gray-900 text-lg font-medium">Components</h3>
        </div>
      </div>
      <div className="p-4 border-b border-gray-100">
        <AntdVersionSelector />
        <div className="mt-3">
          <Input
            allowClear
            placeholder="Search components"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
        {filteredButtons.map(({ label, code }) => (
          <button
            key={label}
            onClick={() => onInsert("\n" + code, label)}
            className="block w-full text-left px-3 py-2 border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded"
          >
            <span className="text-gray-400 mr-2">+</span>
            {label}
          </button>
        ))}
        {filteredButtons.length === 0 && (
          <div className="text-gray-400 text-sm text-center">
            No components found
          </div>
        )}
      </div>
    </div>
  );
}
