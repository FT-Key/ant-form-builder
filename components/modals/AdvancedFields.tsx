"use client";

import { Input, Select, Checkbox } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";
import { DateTimeAdvancedFields } from "./advanced/DateTimeAdvancedFields";

const { Option } = Select;

interface AdvancedFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
  errors?: Record<string, string>;
  show: (keyof BaseInputFields | string)[];
  allowClear?: boolean;
  showCount?: boolean;
  showSearch?: boolean;
  setAllowClear?: (value: boolean) => void;
  setShowCount?: (value: boolean) => void;
  setShowSearch?: (value: boolean) => void;
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
      {/* ---- Input / Input.Password / TextArea ---- */}
      {show.includes("addonBefore") && (
        <Input
          value={fields.addonBefore}
          onChange={(e) => setField("addonBefore", e.target.value)}
          placeholder="addonBefore"
          addonBefore="addonBefore"
          status={errors["errorAddonBefore"] ? "error" : undefined}
        />
      )}
      {show.includes("addonAfter") && (
        <Input
          value={fields.addonAfter}
          onChange={(e) => setField("addonAfter", e.target.value)}
          placeholder="addonAfter"
          addonBefore="addonAfter"
          status={errors["errorAddonAfter"] ? "error" : undefined}
        />
      )}
      {show.includes("prefix") && (
        <Input
          value={fields.prefix}
          onChange={(e) => setField("prefix", e.target.value)}
          placeholder="prefix"
          addonBefore="prefix"
          status={errors["errorPrefix"] ? "error" : undefined}
        />
      )}
      {show.includes("suffix") && (
        <Input
          value={fields.suffix}
          onChange={(e) => setField("suffix", e.target.value)}
          placeholder="suffix"
          addonBefore="suffix"
          status={errors["errorSuffix"] ? "error" : undefined}
        />
      )}
      {show.includes("visibilityToggle") &&
        setVisibilityToggle &&
        antdVersion !== "v3" && (
          <Checkbox
            checked={fields.visibilityToggle}
            onChange={(e) => setVisibilityToggle(e.target.checked)}
          >
            visibilityToggle
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
      {show.includes("showCount") && setShowCount && (
        <Checkbox
          checked={showCount}
          disabled={antdVersion === "v3"}
          onChange={(e) => setShowCount(e.target.checked)}
        >
          showCount
        </Checkbox>
      )}

      {/* ---- Select ---- */}
      {show.includes("allowClear") && setAllowClear && (
        <Checkbox
          checked={allowClear}
          disabled={antdVersion === "v3"}
          onChange={(e) => setAllowClear(e.target.checked)}
        >
          allowClear
        </Checkbox>
      )}
      {show.includes("showSearch") && setShowSearch && (
        <Checkbox
          checked={showSearch}
          onChange={(e) => setShowSearch(e.target.checked)}
        >
          showSearch
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
      {show.includes("dropdownMatchSelectWidth") && (
        <Checkbox
          checked={fields.dropdownMatchSelectWidth !== false}
          onChange={(e) =>
            setField("dropdownMatchSelectWidth", e.target.checked)
          }
        >
          dropdownMatchSelectWidth
        </Checkbox>
      )}
      {show.includes("labelInValue") && (
        <Checkbox
          checked={fields.labelInValue || false}
          onChange={(e) => setField("labelInValue", e.target.checked)}
        >
          labelInValue
        </Checkbox>
      )}
      {show.includes("optionLabelProp") && (
        <Input
          value={fields.optionLabelProp || ""}
          onChange={(e) => setField("optionLabelProp", e.target.value)}
          addonBefore="optionLabelProp"
        />
      )}
      {show.includes("defaultActiveFirstOption") && (
        <Checkbox
          checked={fields.defaultActiveFirstOption !== false}
          onChange={(e) =>
            setField("defaultActiveFirstOption", e.target.checked)
          }
        >
          defaultActiveFirstOption
        </Checkbox>
      )}
      {show.includes("virtual") && (
        <Checkbox
          checked={fields.virtual !== false}
          onChange={(e) => setField("virtual", e.target.checked)}
        >
          virtual
        </Checkbox>
      )}
      {show.includes("bordered") && (
        <Checkbox
          checked={fields.bordered !== false}
          onChange={(e) => setField("bordered", e.target.checked)}
        >
          bordered
        </Checkbox>
      )}
      {show.includes("showArrow") && (
        <Checkbox
          checked={fields.showArrow !== false}
          onChange={(e) => setField("showArrow", e.target.checked)}
        >
          showArrow
        </Checkbox>
      )}
      {show.includes("open") && (
        <Checkbox
          checked={fields.open || false}
          onChange={(e) => setField("open", e.target.checked)}
        >
          open
        </Checkbox>
      )}
      {show.includes("notFoundContent") && (
        <Input
          value={fields.notFoundContent || ""}
          onChange={(e) => setField("notFoundContent", e.target.value)}
          addonBefore="notFoundContent"
        />
      )}
      {show.includes("dropdownStyle") && (
        <Input
          value={fields.dropdownStyle || ""}
          onChange={(e) => setField("dropdownStyle", e.target.value)}
          addonBefore="dropdownStyle"
        />
      )}
      {show.includes("dropdownClassName") && (
        <Input
          value={fields.dropdownClassName || ""}
          onChange={(e) => setField("dropdownClassName", e.target.value)}
          addonBefore="dropdownClassName"
        />
      )}
      {show.includes("listHeight") && (
        <Input
          type="number"
          suffix="px"
          value={fields.listHeight ?? ""}
          onChange={(e) =>
            setField(
              "listHeight",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          addonBefore="listHeight"
        />
      )}
      {show.includes("listItemHeight") && (
        <Input
          type="number"
          suffix="px"
          value={fields.listItemHeight ?? ""}
          onChange={(e) =>
            setField(
              "listItemHeight",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          addonBefore="listItemHeight"
        />
      )}
      {show.includes("placement") && (
        <>
          <p>Placement</p>
          <Select
            value={fields.placement}
            onChange={(v) => setField("placement", v)}
            style={{ width: "100%" }}
          >
            <Option value="bottomLeft">bottomLeft</Option>
            <Option value="bottomRight">bottomRight</Option>
            <Option value="topLeft">topLeft</Option>
            <Option value="topRight">topRight</Option>
          </Select>
        </>
      )}

      {/* ---- InputNumber ---- */}
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

      {/* ---- Slider / Rate ---- */}
      {show.includes("dots") && (
        <Checkbox
          checked={fields.dots}
          onChange={(e) => setField("dots", e.target.checked)}
        >
          dots
        </Checkbox>
      )}
      {show.includes("range") && (
        <Checkbox
          checked={fields.range}
          onChange={(e) => setField("range", e.target.checked)}
        >
          range
        </Checkbox>
      )}
      {show.includes("allowHalf") && (
        <Checkbox
          checked={fields.allowHalf}
          onChange={(e) => setField("allowHalf", e.target.checked)}
        >
          allowHalf
        </Checkbox>
      )}
      {show.includes("tooltips") && (
        <Checkbox
          checked={!!fields.tooltipsEnabled}
          onChange={(e) => setField("tooltipsEnabled", e.target.checked)}
        >
          tooltips
        </Checkbox>
      )}

      {/* ---- DatePicker / TimePicker / RangePicker (delegado) ---- */}
      <DateTimeAdvancedFields show={show} fields={fields} setField={setField} />

      {/* ---- Generales (id, className, size, status) ---- */}
      {show.includes("inputId") && (
        <Input
          value={fields.inputId}
          onChange={(e) => setField("inputId", e.target.value)}
          placeholder="ID"
          addonBefore="id"
          status={errors["errorId"] ? "error" : undefined}
        />
      )}
      {show.includes("size") && (
        <Select
          value={fields.size}
          onChange={(value) => setField("size", value)}
          style={{ width: "100%" }}
        >
          <Option value="small">small</Option>
          <Option value="middle">middle</Option>
          <Option value="large">large</Option>
        </Select>
      )}
      {show.includes("status") && antdVersion !== "v3" && (
        <Select
          value={fields.status}
          onChange={(value) => setField("status", value)}
          style={{ width: "100%" }}
        >
          <Option value="">none</Option>
          <Option value="error">error</Option>
          <Option value="warning">warning</Option>
        </Select>
      )}
      {show.includes("className") && (
        <Input
          value={fields.className}
          onChange={(e) => setField("className", e.target.value)}
          placeholder="className"
          addonBefore="className"
          status={errors["errorClassName"] ? "error" : undefined}
        />
      )}
      {show.includes("checked") && (
        <Checkbox
          checked={!!fields.checked} // forzamos a booleano
          onChange={(e) => setField("checked", e.target.checked)}
        >
          checked
        </Checkbox>
      )}
      {show.includes("indeterminate") && (
        <Checkbox
          indeterminate={!!fields.indeterminate}
          checked={!!fields.indeterminate}
          onChange={(e) => setField("indeterminate", e.target.checked)}
        >
          indeterminate
        </Checkbox>
      )}
    </div>
  );
}
