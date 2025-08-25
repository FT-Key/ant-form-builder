import { Input, Checkbox } from "antd";
import { BaseInputFields } from "@/types/BaseInputFields";

interface BasicFieldsProps {
  fields: BaseInputFields;
  setField: <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => void;
  errors?: Record<string, string>;
  show: (keyof BaseInputFields)[];
}

export function BasicFields({
  fields,
  setField,
  errors = {},
  show,
}: BasicFieldsProps) {
  return (
    <div className="space-y-3">
      {show.includes("label") && (
        <>
          <Input
            value={fields.label}
            onChange={(e) => setField("label", e.target.value)}
            placeholder="Etiqueta"
            addonBefore="label"
            status={errors["errorLabel"] ? "error" : undefined}
          />
          {errors["errorLabel"] && (
            <div className="text-red-500">{errors["errorLabel"]}</div>
          )}
        </>
      )}

      {show.includes("name") && (
        <>
          <Input
            value={fields.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Nombre (name)"
            addonBefore="name"
            status={errors["errorName"] ? "error" : undefined}
          />
          {errors["errorName"] && (
            <div className="text-red-500">{errors["errorName"]}</div>
          )}
        </>
      )}

      {show.includes("placeholder") && (
        <>
          <Input
            value={fields.placeholder}
            onChange={(e) => setField("placeholder", e.target.value)}
            placeholder="Placeholder"
            addonBefore="placeholder"
            status={errors["errorPlaceholder"] ? "error" : undefined}
          />
          {errors["errorPlaceholder"] && (
            <div className="text-red-500">{errors["errorPlaceholder"]}</div>
          )}
        </>
      )}

      {show.includes("minLength") && (
        <>
          <Input
            type="number"
            value={fields.minLength ?? ""}
            onChange={(e) =>
              setField(
                "minLength",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Min Length"
            addonBefore="minLength"
            status={errors["errorMinLength"] ? "error" : undefined}
          />
          {errors["errorMinLength"] && (
            <div className="text-red-500">{errors["errorMinLength"]}</div>
          )}
        </>
      )}

      {show.includes("maxLength") && (
        <>
          <Input
            type="number"
            value={fields.maxLength ?? ""}
            onChange={(e) =>
              setField(
                "maxLength",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Max Length"
            addonBefore="maxLength"
            status={errors["errorMaxLength"] ? "error" : undefined}
          />
          {errors["errorMaxLength"] && (
            <div className="text-red-500">{errors["errorMaxLength"]}</div>
          )}
        </>
      )}

      {show.includes("disabled") && (
        <Checkbox
          checked={fields.disabled}
          onChange={(e) => setField("disabled", e.target.checked)}
        >
          disabled
        </Checkbox>
      )}

      {show.includes("readOnly") && (
        <Checkbox
          checked={fields.readOnly}
          onChange={(e) => setField("readOnly", e.target.checked)}
        >
          readOnly
        </Checkbox>
      )}

      {show.includes("autoFocus") && (
        <Checkbox
          checked={fields.autoFocus}
          onChange={(e) => setField("autoFocus", e.target.checked)}
        >
          autoFocus
        </Checkbox>
      )}
    </div>
  );
}
