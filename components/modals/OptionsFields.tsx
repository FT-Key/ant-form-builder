"use client";

import { Input, Button, Space, Checkbox, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
  optionType?: "default" | "button"; // ✅ agregado para Radio
}

interface OptionsFieldsProps {
  options: OptionItem[];
  setOptions: (options: OptionItem[]) => void;
  errors?: Record<string, string>;
  show?: string[];
  type?: "checkbox" | "radio"; // ✅ diferencia de uso
}

export function OptionsFields({
  options,
  setOptions,
  errors = {},
  show = ["options"],
  type = "checkbox",
}: OptionsFieldsProps) {
  return (
    <div className="space-y-3">
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

          {/* Disabled */}
          <Checkbox
            checked={opt.disabled ?? false}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[idx].disabled = e.target.checked;
              setOptions(newOptions);
            }}
          >
            Disabled
          </Checkbox>

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
        onClick={() =>
          setOptions([
            ...options,
            { label: "", value: "", disabled: false, optionType: "default" },
          ])
        }
      >
        Agregar opción {type === "radio" ? "de radio" : "de checkbox"}
      </Button>
    </div>
  );
}
