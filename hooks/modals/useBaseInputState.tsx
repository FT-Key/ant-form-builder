// hooks/useBaseInputState.ts
import { useState } from "react";
import { BaseInputFields } from "@/types/BaseInputFields"; // <--- importamos desde types

export function useBaseInputState(initial?: Partial<BaseInputFields>) {
  const [fields, setFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    placeholder: "",
    disabled: false,
    readOnly: false,
    autoFocus: false,
    size: "middle",
    status: "",
    inputId: "",
    ...initial,
  });

  const setField = <K extends keyof BaseInputFields>(
    key: K,
    value: BaseInputFields[K]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  return { fields, setField, setFields };
}
