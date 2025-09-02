"use client";

import { Input, Checkbox, Select } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";

const { Option } = Select;

interface DateTimeAdvancedFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
  show: (keyof BaseInputFields | string)[];
}

export function DateTimeAdvancedFields({
  fields,
  setField,
  show,
}: DateTimeAdvancedFieldsProps) {
  return (
    <>
      {/* ---- Formato de fecha ---- */}
      {show.includes("formatDate") && (
        <Select
          value={fields.formatDate}
          onChange={(v) => setField("formatDate", v)}
          style={{ width: "100%" }}
        >
          <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
          <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
          <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
          <Option value="YYYY/MM/DD">YYYY/MM/DD</Option>
        </Select>
      )}

      {/* ---- Formato de hora ---- */}
      {show.includes("formatTime") && (
        <Select
          value={fields.formatTime}
          onChange={(v) => setField("formatTime", v)}
          style={{ width: "100%" }}
        >
          <Option value="HH:mm:ss">HH:mm:ss</Option>
          <Option value="HH:mm">HH:mm</Option>
          <Option value="hh:mm:ss a">hh:mm:ss a</Option>
          <Option value="hh:mm a">hh:mm a</Option>
        </Select>
      )}

      {/* ---- Use 12 Hours ---- */}
      {show.includes("use12Hours") && (
        <Checkbox
          checked={fields.use12Hours || false}
          onChange={(e) => setField("use12Hours", e.target.checked)}
        >
          use12Hours
        </Checkbox>
      )}

      {/* ---- Minute Step ---- */}
      {show.includes("minuteStep") && (
        <Input
          type="number"
          value={fields.minuteStep ?? ""}
          onChange={(e) =>
            setField(
              "minuteStep",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          addonBefore="minuteStep"
        />
      )}

      {/* ---- Second Step ---- */}
      {show.includes("secondStep") && (
        <Input
          type="number"
          value={fields.secondStep ?? ""}
          onChange={(e) =>
            setField(
              "secondStep",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          addonBefore="secondStep"
        />
      )}
    </>
  );
}
