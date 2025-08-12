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
} from "@/utils/validators";

interface ValidationParams {
  label: string;
  name: string;
  placeholder?: string;
  minLength?: number | string;
  maxLength?: number | string;
  min?: number | string;
  max?: number | string;
  addonBefore?: string;
  addonAfter?: string;
  prefix?: string;
  suffix?: string;
  id?: string;
  size?: string;
  status?: string;
  onSave: (code: string) => void;
  buildCode: () => string;
}

export function useInputValidation(params: ValidationParams) {
  const {
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
    onSave,
    buildCode,
  } = params;

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

  const validateAndSave = () => {
    const labelValidation = validateLabel(label);
    const nameValidation = validateName(name);
    const placeholderValidation = validatePlaceholder(placeholder || "");
    const minLengthValidation = validateMinLength(minLength);
    const maxLengthValidation = validateMaxLength(maxLength);
    const minValidation = validateMin(min);
    const maxValidation = validateMax(max);
    const addonBeforeValidation = validateAddonValue(addonBefore || "");
    const addonAfterValidation = validateAddonValue(addonAfter || "");
    const prefixValidation = validateAddonValue(prefix || "");
    const suffixValidation = validateAddonValue(suffix || "");
    const idValidation = id ? validateId(id) : { valid: true, error: "" };
    const sizeValidation = size
      ? validateSize(size)
      : { valid: true, error: "" };
    const statusValidation = status
      ? validateStatus(status)
      : { valid: true, error: "" };

    setErrorLabel(labelValidation.error || "");
    setErrorName(nameValidation.error || "");
    setErrorPlaceholder(placeholderValidation.error || "");
    setErrorMinLength(minLengthValidation.error || "");
    setErrorMaxLength(maxLengthValidation.error || "");
    setErrorMin(minValidation.error || "");
    setErrorMax(maxValidation.error || "");
    setErrorAddonBefore(addonBeforeValidation.error || "");
    setErrorAddonAfter(addonAfterValidation.error || "");
    setErrorPrefix(prefixValidation.error || "");
    setErrorSuffix(suffixValidation.error || "");
    setErrorId(idValidation.error || "");
    setErrorSize(sizeValidation.error || "");
    setErrorStatus(statusValidation.error || "");

    // Validación lógica adicional: minLength ≤ maxLength, min ≤ max
    if (
      minLength !== undefined &&
      maxLength !== undefined &&
      Number(minLength) > Number(maxLength)
    ) {
      setErrorMinLength("minLength no puede ser mayor que maxLength");
      setErrorMaxLength("maxLength no puede ser menor que minLength");
      return;
    }
    if (min !== undefined && max !== undefined && Number(min) > Number(max)) {
      setErrorMin("min no puede ser mayor que max");
      setErrorMax("max no puede ser menor que min");
      return;
    }

    if (
      !labelValidation.valid ||
      !nameValidation.valid ||
      !placeholderValidation.valid ||
      !minLengthValidation.valid ||
      !maxLengthValidation.valid ||
      !minValidation.valid ||
      !maxValidation.valid ||
      !addonBeforeValidation.valid ||
      !addonAfterValidation.valid ||
      !prefixValidation.valid ||
      !suffixValidation.valid ||
      !idValidation.valid ||
      !sizeValidation.valid ||
      !statusValidation.valid
    ) {
      return;
    }

    onSave(buildCode());
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
    validateAndSave,
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
  };
}
