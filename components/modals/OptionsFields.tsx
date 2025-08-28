"use client";

import { Input, Button, Space, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface OptionsFieldsProps {
  options: { label: string; value: string }[];
  mode?: "" | "multiple" | "tags";
  setMode: (value: "" | "multiple" | "tags") => void;
  setOptions: (options: { label: string; value: string }[]) => void;
  errors?: Record<string, string>;
  show?: string[];
}

export function OptionsFields({
  options,
  mode,
  setMode,
  setOptions,
  errors = {},
  show = ["options"],
}: OptionsFieldsProps) {
  return (
    <div className="space-y-3">
      {/* Modo de selección */}
      <div>
        <Select
          value={mode ?? ""}
          onChange={(v) => setMode(v as "" | "multiple" | "tags")}
          style={{ width: "100%", marginBottom: 12 }}
          status={errors["errorMode"] ? "error" : undefined}
        >
          <Option value="">default</Option>
          <Option value="multiple">multiple</Option>
          <Option value="tags">tags</Option>
        </Select>
        {errors["errorMode"] && (
          <div className="text-red-500 text-sm">{errors["errorMode"]}</div>
        )}
      </div>

      {/* Lista de opciones dinámicas */}
      {options.map((opt, idx) => (
        <Space
          key={idx}
          style={{ display: "flex", marginBottom: 8 }}
          align="start"
        >
          {/* Label */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Input
              placeholder="Label"
              value={opt.label}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx].label = e.target.value;
                setOptions(newOptions);
              }}
              status={errors[`errorOption${idx}Label`] ? "error" : undefined}
            />
            {errors[`errorOption${idx}Label`] && (
              <div className="text-red-500 text-sm">
                {errors[`errorOption${idx}Label`]}
              </div>
            )}
          </div>

          {/* Value */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Input
              placeholder="Value"
              value={opt.value}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx].value = e.target.value;
                setOptions(newOptions);
              }}
              status={errors[`errorOption${idx}Value`] ? "error" : undefined}
            />
            {errors[`errorOption${idx}Value`] && (
              <div className="text-red-500 text-sm">
                {errors[`errorOption${idx}Value`]}
              </div>
            )}
          </div>

          {/* Botón eliminar */}
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              const newOptions = options.filter((_, i) => i !== idx);
              setOptions(newOptions);
            }}
          />
        </Space>
      ))}

      {/* Botón para agregar opción */}
      <Button
        icon={<PlusOutlined />}
        onClick={() => setOptions([...options, { label: "", value: "" }])}
      >
        Agregar opción
      </Button>
    </div>
  );
}
