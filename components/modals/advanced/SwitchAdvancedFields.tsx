"use client";

import { Input, Select } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";

const { Option } = Select;

interface SwitchAdvancedFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
  errors?: Record<string, string>;
}

export function SwitchAdvancedFields({
  fields,
  setField,
  errors = {},
}: SwitchAdvancedFieldsProps) {
  return (
    <div className="space-y-3">
      <Input
        value={fields.checkedChildren || ""}
        onChange={(e) => setField("checkedChildren", e.target.value)}
        placeholder="checkedChildren"
        addonBefore="checkedChildren"
        status={errors["errorCheckedChildren"] ? "error" : undefined}
      />

      <Input
        value={fields.unCheckedChildren || ""}
        onChange={(e) => setField("unCheckedChildren", e.target.value)}
        placeholder="unCheckedChildren"
        addonBefore="unCheckedChildren"
        status={errors["errorUnCheckedChildren"] ? "error" : undefined}
      />

      <Select
        value={fields.switchSize || "default"}
        onChange={(value) => setField("switchSize", value)}
        style={{ width: "100%" }}
      >
        <Option value="default">default</Option>
        <Option value="small">small</Option>
      </Select>
    </div>
  );
}
