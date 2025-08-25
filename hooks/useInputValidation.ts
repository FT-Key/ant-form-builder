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

  /**
   * Ahora devuelve los errores actuales para poder usarlos fuera.
   */
  const validateAndSave = (): Record<string, string> => {
    let hasError = false;
    const newErrors: Record<string, string> = {};
    const code = buildCode();

    const checkField = (field: string, value: any, validator: Function) => {
      const res = validator(value);
      newErrors[field] = res.valid ? "" : res.error || "";
      if (!res.valid) hasError = true;
    };

    if (label !== undefined)
      checkField("errorLabel", label, validators.validateLabel);
    if (name !== undefined)
      checkField("errorName", name, validators.validateName);
    if (placeholder !== undefined)
      checkField(
        "errorPlaceholder",
        placeholder,
        validators.validatePlaceholder
      );
    if (minLength !== undefined)
      checkField("errorMinLength", minLength, validators.validateMinLength);
    if (maxLength !== undefined)
      checkField("errorMaxLength", maxLength, validators.validateMaxLength);
    if (min !== undefined) checkField("errorMin", min, validators.validateMin);
    if (max !== undefined) checkField("errorMax", max, validators.validateMax);
    if (addonBefore !== undefined)
      checkField(
        "errorAddonBefore",
        addonBefore,
        validators.validateAddonValue
      );
    if (addonAfter !== undefined)
      checkField("errorAddonAfter", addonAfter, validators.validateAddonValue);
    if (prefix !== undefined)
      checkField("errorPrefix", prefix, validators.validateAddonValue);
    if (suffix !== undefined)
      checkField("errorSuffix", suffix, validators.validateAddonValue);
    if (id !== undefined) checkField("errorId", id, validators.validateId);
    if (size !== undefined)
      checkField("errorSize", size, validators.validateSize);
    if (status !== undefined)
      checkField("errorStatus", status, validators.validateStatus);
    if (className !== undefined)
      checkField("errorClassName", className, validators.validateClassName);
    if (type !== undefined)
      checkField("errorButtonType", type, validators.validateButtonType);
    if (label !== undefined && type !== undefined)
      checkField("errorButtonLabel", label, validators.validateButtonLabel);
    if (size !== undefined && type !== undefined)
      checkField("errorButtonSize", size, validators.validateButtonSize);

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
