// hooks/useInputValidation.ts
import { useState } from "react";
import {
  validateLabel,
  validateName,
  validatePlaceholder,
  validateMinLength,
  validateMaxLength,
  validateMin,
  validateMax,
  validateAddonValue,
  validateId,
  validateSize,
  validateStatus,
  validateClassName,
  validateButtonType,
  validateButtonLabel,
  validateButtonSize,
} from "@/utils/validators";

export interface ValidationParams {
  onSave: (code: string) => void;
  buildCode: () => string;

  // Campos opcionales: el modal decide cuáles enviar
  label?: string;
  name?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
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

  // Estado de errores
  const [errorLabel, setErrorLabel] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const [errorMinLength, setErrorMinLength] = useState("");
  const [errorMaxLength, setErrorMaxLength] = useState("");
  const [errorMin, setErrorMin] = useState("");
  const [errorMax, setErrorMax] = useState("");
  const [errorAddonBefore, setErrorAddonBefore] = useState("");
  const [errorAddonAfter, setErrorAddonAfter] = useState("");
  const [errorPrefix, setErrorPrefix] = useState("");
  const [errorSuffix, setErrorSuffix] = useState("");
  const [errorId, setErrorId] = useState("");
  const [errorSize, setErrorSize] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [errorClassName, setErrorClassName] = useState("");
  const [errorButtonType, setErrorButtonType] = useState("");
  const [errorButtonLabel, setErrorButtonLabel] = useState("");
  const [errorButtonSize, setErrorButtonSize] = useState("");

  const validateAndSave = () => {
    let hasError = false;
    const code = buildCode();

    // Validar solo los campos que existan
    if (label !== undefined) {
      const res = validateLabel(label);
      setErrorLabel(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (name !== undefined) {
      const res = validateName(name);
      setErrorName(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (placeholder !== undefined) {
      const res = validatePlaceholder(placeholder);
      setErrorPlaceholder(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (minLength !== undefined) {
      const res = validateMinLength(minLength);
      setErrorMinLength(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (maxLength !== undefined) {
      const res = validateMaxLength(maxLength);
      setErrorMaxLength(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (addonBefore !== undefined) {
      const res = validateAddonValue(addonBefore);
      setErrorAddonBefore(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (addonAfter !== undefined) {
      const res = validateAddonValue(addonAfter);
      setErrorAddonAfter(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (prefix !== undefined) {
      const res = validateAddonValue(prefix);
      setErrorPrefix(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (suffix !== undefined) {
      const res = validateAddonValue(suffix);
      setErrorSuffix(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (id !== undefined) {
      const res = validateId(id);
      setErrorId(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (size !== undefined) {
      const res = validateSize(size);
      setErrorSize(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (status !== undefined) {
      const res = validateStatus(status);
      setErrorStatus(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (className !== undefined) {
      const res = validateClassName(className);
      setErrorClassName(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (type !== undefined) {
      const res = validateButtonType(type);
      setErrorButtonType(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (label !== undefined && type !== undefined) {
      const res = validateButtonLabel(label);
      setErrorButtonLabel(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (size !== undefined && type !== undefined) {
      const res = validateButtonSize(size);
      setErrorButtonSize(res.valid ? "" : res.error || "");
      if (!res.valid) hasError = true;
    }

    if (!hasError) {
      onSave(code);
    }
  };

  return {
    errorLabel,
    errorName,
    errorPlaceholder,
    errorMinLength,
    errorMaxLength,
    errorMin,
    errorMax,
    errorAddonBefore,
    errorAddonAfter,
    errorPrefix,
    errorSuffix,
    errorId,
    errorSize,
    errorStatus,
    errorClassName,
    errorButtonType,
    errorButtonLabel,
    errorButtonSize,
    validateAndSave,
    // Setters manuales si algún modal los necesita
    setErrorLabel,
    setErrorName,
    setErrorPlaceholder,
    setErrorMinLength,
    setErrorMaxLength,
    setErrorMin,
    setErrorMax,
    setErrorAddonBefore,
    setErrorAddonAfter,
    setErrorPrefix,
    setErrorSuffix,
    setErrorId,
    setErrorSize,
    setErrorStatus,
    setErrorClassName,
    setErrorButtonType,
    setErrorButtonLabel,
    setErrorButtonSize,
  };
}
