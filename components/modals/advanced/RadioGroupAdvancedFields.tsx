// advanced/RadioGroupAdvancedFields.tsx
"use client";

import { Select } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";

const { Option } = Select;

interface RadioGroupAdvancedFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
}

export function RadioGroupAdvancedFields({
  fields,
  setField,
}: RadioGroupAdvancedFieldsProps) {
  return (
    <div className="space-y-3">
      {/* Tipo de opción: default / button */}
      <div>
        <label className="block mb-1">Tipo de opción</label>
        <Select
          value={fields.optionType || "default"}
          onChange={(val) => setField("optionType", val)}
          style={{ width: "100%" }}
        >
          <Option value="default">default</Option>
          <Option value="button">button</Option>
        </Select>
      </div>

      {fields.optionType === "button" && (
        <>
          {/* Estilo del botón */}
          <div className="mt-4">
            <label className="block mb-1">Estilo del botón</label>
            <Select
              value={fields.buttonStyle || "outline"}
              onChange={(val) => setField("buttonStyle", val)}
              style={{ width: "100%" }}
            >
              <Option value="outline">outline</Option>
              <Option value="solid">solid</Option>
            </Select>
          </div>

          {/* Tamaño */}
          <div className="mt-4">
            <label className="block mb-1">Tamaño</label>
            <Select
              value={fields.size || "middle"}
              onChange={(val) => setField("size", val)}
              style={{ width: "100%" }}
            >
              <Option value="small">small</Option>
              <Option value="middle">middle</Option>
              <Option value="large">large</Option>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
