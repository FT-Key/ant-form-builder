import { Input, Select, Checkbox } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";

const { Option } = Select;

interface AdvancedFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
  errors?: Record<string, string>;
  show: (keyof BaseInputFields | "allowClear" | "showCount")[];
  allowClear?: boolean;
  showCount?: boolean;
  setAllowClear?: (value: boolean) => void;
  setShowCount?: (value: boolean) => void;
  antdVersion?: "v3" | "v4" | "v5";
}

export function AdvancedFields({
  fields,
  setField,
  errors = {},
  show,
  allowClear,
  showCount,
  setAllowClear,
  setShowCount,
  antdVersion,
}: AdvancedFieldsProps) {
  return (
    <div className="space-y-3">
      {show.includes("addonBefore") && (
        <>
          <Input
            value={fields.addonBefore}
            onChange={(e) => setField("addonBefore", e.target.value)}
            placeholder="addonBefore"
            addonBefore="addonBefore"
            status={errors["errorAddonBefore"] ? "error" : undefined}
          />
          {errors["errorAddonBefore"] && (
            <div className="text-red-500">{errors["errorAddonBefore"]}</div>
          )}
        </>
      )}

      {show.includes("addonAfter") && (
        <>
          <Input
            value={fields.addonAfter}
            onChange={(e) => setField("addonAfter", e.target.value)}
            placeholder="addonAfter"
            addonBefore="addonAfter"
            status={errors["errorAddonAfter"] ? "error" : undefined}
          />
          {errors["errorAddonAfter"] && (
            <div className="text-red-500">{errors["errorAddonAfter"]}</div>
          )}
        </>
      )}

      {show.includes("prefix") && (
        <>
          <Input
            value={fields.prefix}
            onChange={(e) => setField("prefix", e.target.value)}
            placeholder="prefix"
            addonBefore="prefix"
            status={errors["errorPrefix"] ? "error" : undefined}
          />
          {errors["errorPrefix"] && (
            <div className="text-red-500">{errors["errorPrefix"]}</div>
          )}
        </>
      )}

      {show.includes("suffix") && (
        <>
          <Input
            value={fields.suffix}
            onChange={(e) => setField("suffix", e.target.value)}
            placeholder="suffix"
            addonBefore="suffix"
            status={errors["errorSuffix"] ? "error" : undefined}
          />
          {errors["errorSuffix"] && (
            <div className="text-red-500">{errors["errorSuffix"]}</div>
          )}
        </>
      )}

      {show.includes("inputId") && (
        <>
          <Input
            value={fields.inputId}
            onChange={(e) => setField("inputId", e.target.value)}
            placeholder="ID"
            addonBefore="id"
            status={errors["errorId"] ? "error" : undefined}
          />
          {errors["errorId"] && (
            <div className="text-red-500">{errors["errorId"]}</div>
          )}
        </>
      )}

      {setAllowClear && show.includes("allowClear") && (
        <Checkbox
          checked={allowClear}
          disabled={antdVersion === "v3"}
          onChange={(e) => setAllowClear(e.target.checked)}
        >
          allowClear
        </Checkbox>
      )}

      {setShowCount && show.includes("showCount") && (
        <Checkbox
          checked={showCount}
          disabled={antdVersion === "v3"}
          onChange={(e) => setShowCount(e.target.checked)}
        >
          showCount
        </Checkbox>
      )}

      {show.includes("size") && (
        <>
          <Select
            value={fields.size}
            onChange={(value) => setField("size", value)}
            style={{ width: "100%" }}
            status={errors["errorSize"] ? "error" : undefined}
          >
            <Option value="small">small</Option>
            <Option value="middle">middle</Option>
            <Option value="large">large</Option>
          </Select>
          {errors["errorSize"] && (
            <div className="text-red-500">{errors["errorSize"]}</div>
          )}
        </>
      )}

      {show.includes("status") && antdVersion !== "v3" && (
        <>
          <Select
            value={fields.status}
            onChange={(value) => setField("status", value)}
            style={{ width: "100%" }}
            status={errors["errorStatus"] ? "error" : undefined}
          >
            <Option value="">none</Option>
            <Option value="error">error</Option>
            <Option value="warning">warning</Option>
          </Select>
          {errors["errorStatus"] && (
            <div className="text-red-500">{errors["errorStatus"]}</div>
          )}
        </>
      )}

      {show.includes("className") && (
        <>
          <Input
            value={fields.className}
            onChange={(e) => setField("className", e.target.value)}
            placeholder="className"
            addonBefore="className"
            status={errors["errorClassName"] ? "error" : undefined}
          />
          {errors["errorClassName"] && (
            <div className="text-red-500">{errors["errorClassName"]}</div>
          )}
        </>
      )}
    </div>
  );
}
