// hooks/useInputValidation.ts
import { useState } from "react";
import * as validators from "@/utils/validators";

export interface ValidationParams {
  onSave: (code: string) => void;
  buildCode: () => string;

  // Campos opcionales: el modal decide cuáles enviar
  label?: string;
  name?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  addonBefore?: string;
  addonAfter?: string;
  prefix?: string;
  suffix?: string;
  id?: string;
  size?: "small" | "middle" | "large";
  status?: "" | "error" | "warning";
  className?: string;
  type?: "default" | "primary" | "dashed" | "text" | "link";
  block?: boolean;
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function useInputValidation(params: ValidationParams) {
  const {
    onSave,
    buildCode,
    label,
    name,
    placeholder,
    minLength,
    maxLength,
    min,
    max,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    id,
    size,
    status,
    className,
    type,
  } = params;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any, validator: Function) => {
    const res = validator(value);
    setErrors((prev) => ({
      ...prev,
      [field]: res.valid ? "" : res.error || "",
    }));
    return res.valid;
  };

  const validateAndSave = () => {
    let hasError = false;
    const code = buildCode();

    if (label !== undefined)
      hasError =
        !validateField("errorLabel", label, validators.validateLabel) ||
        hasError;
    if (name !== undefined)
      hasError =
        !validateField("errorName", name, validators.validateName) || hasError;
    if (placeholder !== undefined)
      hasError =
        !validateField(
          "errorPlaceholder",
          placeholder,
          validators.validatePlaceholder
        ) || hasError;
    if (minLength !== undefined)
      hasError =
        !validateField(
          "errorMinLength",
          minLength,
          validators.validateMinLength
        ) || hasError;
    if (maxLength !== undefined)
      hasError =
        !validateField(
          "errorMaxLength",
          maxLength,
          validators.validateMaxLength
        ) || hasError;
    if (min !== undefined)
      hasError =
        !validateField("errorMin", min, validators.validateMin) || hasError;
    if (max !== undefined)
      hasError =
        !validateField("errorMax", max, validators.validateMax) || hasError;
    if (addonBefore !== undefined)
      hasError =
        !validateField(
          "errorAddonBefore",
          addonBefore,
          validators.validateAddonValue
        ) || hasError;
    if (addonAfter !== undefined)
      hasError =
        !validateField(
          "errorAddonAfter",
          addonAfter,
          validators.validateAddonValue
        ) || hasError;
    if (prefix !== undefined)
      hasError =
        !validateField("errorPrefix", prefix, validators.validateAddonValue) ||
        hasError;
    if (suffix !== undefined)
      hasError =
        !validateField("errorSuffix", suffix, validators.validateAddonValue) ||
        hasError;
    if (id !== undefined)
      hasError =
        !validateField("errorId", id, validators.validateId) || hasError;
    if (size !== undefined)
      hasError =
        !validateField("errorSize", size, validators.validateSize) || hasError;
    if (status !== undefined)
      hasError =
        !validateField("errorStatus", status, validators.validateStatus) ||
        hasError;
    if (className !== undefined)
      hasError =
        !validateField(
          "errorClassName",
          className,
          validators.validateClassName
        ) || hasError;
    if (type !== undefined)
      hasError =
        !validateField(
          "errorButtonType",
          type,
          validators.validateButtonType
        ) || hasError;

    if (label !== undefined && type !== undefined)
      hasError =
        !validateField(
          "errorButtonLabel",
          label,
          validators.validateButtonLabel
        ) || hasError;
    if (size !== undefined && type !== undefined)
      hasError =
        !validateField(
          "errorButtonSize",
          size,
          validators.validateButtonSize
        ) || hasError;

    if (!hasError) {
      onSave(code);
    }
  };

  return {
    errors, // ✅ agregamos errors al return
    validateAndSave,
    setErrors,
  };
}
