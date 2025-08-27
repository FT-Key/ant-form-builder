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
  show: (keyof BaseInputFields | "allowClear" | "showCount" | "showSearch")[]; // agregado showSearch
  allowClear?: boolean;
  showCount?: boolean;
  showSearch?: boolean; // agregado
  setAllowClear?: (value: boolean) => void;
  setShowCount?: (value: boolean) => void;
  setShowSearch?: (value: boolean) => void; // agregado
  setVisibilityToggle?: (value: boolean) => void;
  antdVersion?: "v3" | "v4" | "v5";
}

export function AdvancedFields({
  fields,
  setField,
  errors = {},
  show,
  allowClear,
  showCount,
  showSearch,
  setAllowClear,
  setShowCount,
  setShowSearch,
  setVisibilityToggle,
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

      {setShowSearch && show.includes("showSearch") && (
        <Checkbox
          checked={showSearch}
          onChange={(e) => setShowSearch(e.target.checked)}
        >
          showSearch
        </Checkbox>
      )}

      {show.includes("autoSize") && (
        <Checkbox
          checked={fields.autoSize || false}
          onChange={(e) => setField("autoSize", e.target.checked)}
          disabled={antdVersion === "v3"}
        >
          autoSize
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

      {setVisibilityToggle &&
        show.includes("visibilityToggle") &&
        antdVersion !== "v3" && (
          <Checkbox
            checked={fields.visibilityToggle}
            onChange={(e) => setVisibilityToggle(e.target.checked)}
          >
            visibilityToggle
          </Checkbox>
        )}

      {show.includes("size") && (
        <>
          <label className="block mb-1">Size</label>
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
          <label className="block mb-1">Status</label>
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

      {show.includes("step") && (
        <Input
          type="number"
          value={fields.step ?? ""}
          onChange={(e) =>
            setField(
              "step",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Step"
          addonBefore="step"
        />
      )}

      {show.includes("precision") && (
        <Input
          type="number"
          value={fields.precision ?? ""}
          onChange={(e) =>
            setField(
              "precision",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Precision"
          addonBefore="precision"
        />
      )}

      {show.includes("keyboard") && (
        <Checkbox
          checked={fields.keyboard}
          onChange={(e) => setField("keyboard", e.target.checked)}
        >
          keyboard
        </Checkbox>
      )}

      {show.includes("controls") && (
        <Checkbox
          checked={fields.controls}
          onChange={(e) => setField("controls", e.target.checked)}
        >
          controls
        </Checkbox>
      )}

      {show.includes("filterOption") && (
        <Checkbox
          checked={fields.filterOption !== false}
          onChange={(e) => setField("filterOption", e.target.checked)}
        >
          filterOption
        </Checkbox>
      )}

      {show.includes("loading") && (
        <Checkbox
          checked={fields.loading || false}
          onChange={(e) => setField("loading", e.target.checked)}
        >
          loading
        </Checkbox>
      )}

      {show.includes("optionFilterProp") && (
        <Input
          value={fields.optionFilterProp || ""}
          onChange={(e) => setField("optionFilterProp", e.target.value)}
          addonBefore="optionFilterProp"
        />
      )}

      {show.includes("maxTagCount") && (
        <Input
          type="number"
          value={fields.maxTagCount ?? ""}
          onChange={(e) =>
            setField(
              "maxTagCount",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          addonBefore="maxTagCount"
        />
      )}
    </div>
  );
}
