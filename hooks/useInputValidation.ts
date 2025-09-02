// hooks/useInputValidation.ts
import { useState } from "react";
import * as validators from "@/utils/validators";

export interface ValidationParams {
  onSave: (code: string) => void;
  buildCode: () => string;

  // comunes
  innerText?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  id?: string;
  className?: string;

  // numéricos
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  maxTagCount?: number;
  listHeight?: number;
  listItemHeight?: number;
  step?: number;
  precision?: number;
  minuteStep?: number;
  secondStep?: number;

  // strings adicionales
  addonBefore?: string;
  addonAfter?: string;
  prefix?: string;
  suffix?: string;
  optionFilterProp?: string;
  optionLabelProp?: string;
  notFoundContent?: string;
  dropdownStyle?: string;
  dropdownClassName?: string;

  // selects restringidos
  size?: "small" | "middle" | "large";
  status?: "" | "error" | "warning";
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  mode?: "" | "multiple" | "tags";
  formatDate?: string;
  formatTime?: string;

  // booleans (check/flags)
  block?: boolean;
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
  visibilityToggle?: boolean;
  autoSize?: boolean;
  showCount?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: boolean;
  dropdownMatchSelectWidth?: boolean | number;
  labelInValue?: boolean;
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  bordered?: boolean;
  showArrow?: boolean;
  open?: boolean;
  keyboard?: boolean;
  controls?: boolean;
  dots?: boolean;
  range?: boolean;
  allowHalf?: boolean;
  tooltips?: boolean | React.ReactNode[];
  use12Hours?: boolean;
  checked?: boolean;
  indeterminate?: boolean;

  // options para <Select>
  options?: { label: string; value: string }[];

  // Button
  type?: "default" | "primary" | "dashed" | "text" | "link";
}

export function useInputValidation(params: ValidationParams) {
  const { onSave, buildCode, ...fields } = params;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSave = (): Record<string, string> => {
    let hasError = false;
    const newErrors: Record<string, string> = {};
    const code = buildCode();

    const checkField = (field: string, value: any, validator: Function) => {
      const res = validator(value);
      newErrors[field] = res.valid ? "" : res.error || "";
      if (!res.valid) hasError = true;
    };

    // ---- Strings ----
    if (fields.innerText !== undefined)
      checkField(
        "errorInnerText",
        fields.innerText,
        validators.validateInnerText
      );
    if (fields.label !== undefined)
      checkField("errorLabel", fields.label, validators.validateLabel);
    if (fields.name !== undefined)
      checkField("errorName", fields.name, validators.validateName);
    if (fields.placeholder !== undefined)
      checkField(
        "errorPlaceholder",
        fields.placeholder,
        validators.validatePlaceholder
      );
    if (fields.addonBefore !== undefined)
      checkField(
        "errorAddonBefore",
        fields.addonBefore,
        validators.validateAddonValue
      );
    if (fields.addonAfter !== undefined)
      checkField(
        "errorAddonAfter",
        fields.addonAfter,
        validators.validateAddonValue
      );
    if (fields.prefix !== undefined)
      checkField("errorPrefix", fields.prefix, validators.validateAddonValue);
    if (fields.suffix !== undefined)
      checkField("errorSuffix", fields.suffix, validators.validateAddonValue);
    if (fields.optionFilterProp !== undefined)
      checkField(
        "errorOptionFilterProp",
        fields.optionFilterProp,
        validators.validateOptionFilterProp
      );
    if (fields.optionLabelProp !== undefined)
      checkField(
        "errorOptionLabelProp",
        fields.optionLabelProp,
        validators.validateOptionLabelProp
      );
    if (fields.notFoundContent !== undefined)
      checkField(
        "errorNotFoundContent",
        fields.notFoundContent,
        validators.validateStringProp
      );
    if (fields.dropdownStyle !== undefined)
      checkField(
        "errorDropdownStyle",
        fields.dropdownStyle,
        validators.validateStringProp
      );
    if (fields.dropdownClassName !== undefined)
      checkField(
        "errorDropdownClassName",
        fields.dropdownClassName,
        validators.validateClassName
      );

    // ---- Numéricos ----
    if (fields.minLength !== undefined)
      checkField(
        "errorMinLength",
        fields.minLength,
        validators.validateMinLength
      );
    if (fields.maxLength !== undefined)
      checkField(
        "errorMaxLength",
        fields.maxLength,
        validators.validateMaxLength
      );
    if (fields.min !== undefined)
      checkField("errorMin", fields.min, validators.validateMin);
    if (fields.max !== undefined)
      checkField("errorMax", fields.max, validators.validateMax);
    if (fields.maxTagCount !== undefined)
      checkField(
        "errorMaxTagCount",
        fields.maxTagCount,
        validators.validatePositiveInteger
      );
    if (fields.listHeight !== undefined)
      checkField(
        "errorListHeight",
        fields.listHeight,
        validators.validatePositiveInteger
      );
    if (fields.listItemHeight !== undefined)
      checkField(
        "errorListItemHeight",
        fields.listItemHeight,
        validators.validatePositiveInteger
      );
    if (fields.step !== undefined)
      checkField("errorStep", fields.step, validators.validatePositiveNumber);
    if (fields.precision !== undefined)
      checkField(
        "errorPrecision",
        fields.precision,
        validators.validatePositiveInteger
      );
    if (fields.minuteStep !== undefined)
      checkField(
        "errorMinuteStep",
        fields.minuteStep,
        validators.validateMinuteStep
      );
    if (fields.secondStep !== undefined)
      checkField(
        "errorSecondStep",
        fields.secondStep,
        validators.validateSecondStep
      );

    // ---- Booleans ----
    const booleanFields: (keyof ValidationParams)[] = [
      "block",
      "danger",
      "loading",
      "disabled",
      "visibilityToggle",
      "autoSize",
      "showCount",
      "allowClear",
      "showSearch",
      "filterOption",
      "dropdownMatchSelectWidth",
      "labelInValue",
      "defaultActiveFirstOption",
      "virtual",
      "bordered",
      "showArrow",
      "open",
      "keyboard",
      "controls",
      "dots",
      "range",
      "allowHalf",
      "tooltips",
      "use12Hours",
      "checked",
      "indeterminate",
    ];

    booleanFields.forEach((key) => {
      if (fields[key as keyof typeof fields] !== undefined) {
        let validatorFn = validators.validateCheckbox;
        if (key === "checked") validatorFn = validators.validateChecked;
        if (key === "indeterminate")
          validatorFn = validators.validateIndeterminate;

        const { valid, error } = validatorFn(
          fields[key as keyof typeof fields]
        );
        newErrors[`error${key[0].toUpperCase() + key.slice(1)}`] = valid
          ? ""
          : error || "";
        if (!valid) hasError = true;
      }
    });

    // ---- Selects restringidos ----
    if (fields.size !== undefined)
      checkField("errorSize", fields.size, validators.validateSize);
    if (fields.status !== undefined)
      checkField("errorStatus", fields.status, validators.validateStatus);
    if (fields.placement !== undefined)
      checkField(
        "errorPlacement",
        fields.placement,
        validators.validatePlacement
      );
    if (fields.mode !== undefined)
      checkField("errorMode", fields.mode, validators.validateSelectMode);
    if (fields.formatDate !== undefined)
      checkField(
        "errorFormatDate",
        fields.formatDate,
        validators.validateFormatDate
      );
    if (fields.formatTime !== undefined)
      checkField(
        "errorFormatTime",
        fields.formatTime,
        validators.validateFormatTime
      );

    // ---- Button ----
    if (fields.type !== undefined)
      checkField("errorButtonType", fields.type, validators.validateButtonType);
    if (fields.label !== undefined && fields.type !== undefined)
      checkField(
        "errorButtonLabel",
        fields.label,
        validators.validateButtonLabel
      );
    if (fields.size !== undefined && fields.type !== undefined)
      checkField("errorButtonSize", fields.size, validators.validateButtonSize);

    // ---- Options de Select ----
    if (fields.options !== undefined) {
      const res = validators.validateOptionsArray(fields.options);
      if (!res.valid) {
        Object.assign(newErrors, res.errors);
        hasError = true;
      }
    }

    // ---- Id y className ----
    if (fields.id !== undefined)
      checkField("errorId", fields.id, validators.validateId);
    if (fields.className !== undefined)
      checkField(
        "errorClassName",
        fields.className,
        validators.validateClassName
      );

    setErrors(newErrors);

    if (!hasError) {
      onSave(code);
    }

    return newErrors;
  };

  return {
    errors,
    validateAndSave,
    setErrors,
  };
}
