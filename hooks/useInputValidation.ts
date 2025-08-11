// hooks/useInputValidation.ts
import { useState } from "react";
import { validateLabel, validateName } from "@/utils/validators";

export function useInputValidation({
  label,
  name,
  onSave,
  buildCode,
}: {
  label: string;
  name: string;
  onSave: (code: string) => void;
  buildCode: () => string;
}) {
  const [errorLabel, setErrorLabel] = useState("");
  const [errorName, setErrorName] = useState("");

  const validateAndSave = () => {
    const labelValidation = validateLabel(label);
    const nameValidation = validateName(name);

    setErrorLabel(labelValidation.error || "");
    setErrorName(nameValidation.error || "");

    if (!labelValidation.valid || !nameValidation.valid) return;

    const code = buildCode();
    onSave(code);
  };

  return {
    errorLabel,
    errorName,
    validateAndSave,
    setErrorLabel,
    setErrorName,
  };
}
