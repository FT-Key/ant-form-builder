// utils/validators.ts

function containsInvalidJSXChars(value: string): boolean {
  return /[<>{}]/.test(value);
}

function isNumber(value: unknown): boolean {
  return (
    (typeof value === "number" && !isNaN(value)) ||
    (typeof value === "string" && /^\d+$/.test(value))
  );
}

export function validateInnerText(value: any): {
  valid: boolean;
  error?: string;
} {
  if (typeof value !== "string") {
    return { valid: false, error: "Debe ser texto" };
  }
  if (value.trim() === "") {
    return { valid: false, error: "El texto no puede estar vacío" };
  }
  return { valid: true };
}

// ✅ Valida strings simples (no vacíos si son requeridos, sin chars peligrosos)
export function validateLabel(label: string) {
  /* 
  if (!label.trim()) {
    return { valid: false, error: "El label no puede estar vacío" };
  } */
  if (containsInvalidJSXChars(label)) {
    return { valid: false, error: "El label no puede contener <, >, {, }" };
  }
  return { valid: true };
}

export function validateName(name: string) {
  if (!name.trim()) {
    return { valid: false, error: "El nombre (name) no puede estar vacío" };
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(name)) {
    return {
      valid: false,
      error:
        "El nombre (name) debe comenzar con letra o guion bajo y solo contener letras, números, guion bajo o guion medio",
    };
  }
  return { valid: true };
}

export function validatePlaceholder(placeholder: string) {
  if (containsInvalidJSXChars(placeholder)) {
    return {
      valid: false,
      error: "El placeholder no puede contener <, >, {, }",
    };
  }
  return { valid: true };
}

export function validateId(value: string) {
  if (containsInvalidJSXChars(value)) {
    return { valid: false, error: "El id no puede contener <, >, {, }" };
  }
  if (!/^([a-zA-Z_][a-zA-Z0-9-_:.]*)?$/.test(value)) {
    return {
      valid: false,
      error:
        "El id debe comenzar con letra o guion bajo y solo contener letras, números, guiones, guion bajo, puntos o dos puntos",
    };
  }
  return { valid: true };
}

export function validateClassName(value: string) {
  if (!value.trim()) return { valid: true };
  const classNames = value.split(/\s+/);
  for (const cls of classNames) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(cls)) {
      return {
        valid: false,
        error: `La clase "${cls}" no es válida.`,
      };
    }
  }
  return { valid: true };
}

export function validateAddonValue(value: string) {
  if (!value.trim()) return { valid: true };
  if (containsInvalidJSXChars(value)) {
    return { valid: false, error: "No puede contener <, >, {, }" };
  }
  return { valid: true };
}

// ✅ Valida booleanos
export function validateCheckbox(value: unknown) {
  if (typeof value !== "boolean") {
    return { valid: false, error: "Debe ser verdadero o falso" };
  }
  return { valid: true };
}

export function validateBooleanProp(value: unknown) {
  if (value === undefined || value === null) return { valid: true };
  if (typeof value !== "boolean") {
    return { valid: false, error: "Debe ser booleano" };
  }
  return { valid: true };
}

// ✅ Valida numéricos generales
export function validateMin(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  const num = Number(value);
  if (isNaN(num))
    return { valid: false, error: "min debe ser un número válido" };
  return { valid: true };
}

export function validateMax(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  const num = Number(value);
  if (isNaN(num))
    return { valid: false, error: "max debe ser un número válido" };
  return { valid: true };
}

export function validateMinLength(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  if (!isNumber(value))
    return { valid: false, error: "minLength debe ser un número" };
  const num = Number(value);
  if (num < 0) return { valid: false, error: "Debe ser ≥ 0" };
  return { valid: true };
}

export function validateMaxLength(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  if (!isNumber(value))
    return { valid: false, error: "maxLength debe ser un número" };
  const num = Number(value);
  if (num < 0) return { valid: false, error: "Debe ser ≥ 0" };
  return { valid: true };
}

// Enteros positivos
export function validatePositiveInt(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  if (!isNumber(value))
    return { valid: false, error: "Debe ser un número entero" };
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0)
    return { valid: false, error: "Debe ser ≥ 0" };
  return { valid: true };
}

// Decimales positivos
export function validatePositiveNumber(value: unknown) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  const num = Number(value);
  if (isNaN(num) || num < 0)
    return { valid: false, error: "Debe ser un número positivo" };
  return { valid: true };
}

// En rango
export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number
) {
  if (value === undefined || value === null || value === "")
    return { valid: true };
  const num = Number(value);
  if (isNaN(num)) return { valid: false, error: "Debe ser un número" };
  if (num < min || num > max)
    return { valid: false, error: `Debe estar entre ${min} y ${max}` };
  return { valid: true };
}

// ✅ Selects restringidos
export function validateSize(size?: string) {
  const valid = ["small", "middle", "large"];
  if (!size) return { valid: true };
  if (!valid.includes(size)) {
    return { valid: false, error: `size debe ser uno de: ${valid.join(", ")}` };
  }
  return { valid: true };
}

export function validateStatus(status?: string) {
  const valid = ["", "error", "warning"];
  if (status === undefined) return { valid: true };
  if (!valid.includes(status)) {
    return {
      valid: false,
      error: `status debe ser uno de: none, error, warning`,
    };
  }
  return { valid: true };
}

export function validatePlacement(value?: string) {
  const valid = ["bottomLeft", "bottomRight", "topLeft", "topRight"];
  if (!value) return { valid: true };
  if (!valid.includes(value)) {
    return {
      valid: false,
      error: `placement debe ser uno de: ${valid.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateFormatDate(value?: string) {
  const valid = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"];
  if (!value) return { valid: true };
  if (!valid.includes(value)) {
    return {
      valid: false,
      error: `Formato inválido. Use uno de: ${valid.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateFormatTime(value?: string) {
  const valid = ["HH:mm:ss", "HH:mm", "hh:mm:ss a", "hh:mm a"];
  if (!value) return { valid: true };
  if (!valid.includes(value)) {
    return {
      valid: false,
      error: `Formato inválido. Use uno de: ${valid.join(", ")}`,
    };
  }
  return { valid: true };
}

// ✅ Arrays de opciones
export const validateOptionsArray = (
  options: { label: string; value: string }[]
) => {
  const errors: Record<string, string> = {};
  if (!Array.isArray(options) || options.length === 0) {
    return {
      valid: false,
      errors: { errorOptions: "Debe haber al menos una opción" },
    };
  }
  let valid = true;
  options.forEach((opt, idx) => {
    if (!opt.label) {
      errors[`errorOption${idx}Label`] = "El label no puede estar vacío";
      valid = false;
    }
    if (!opt.value) {
      errors[`errorOption${idx}Value`] = "El value no puede estar vacío";
      valid = false;
    }
  });
  return { valid, errors };
};

// ✅ Props específicas extra
export const validateSelectMode = (mode: any) => {
  const validValues = ["", "multiple", "tags"];
  return validValues.includes(mode)
    ? { valid: true }
    : { valid: false, error: "El modo debe ser '', 'multiple' o 'tags'" };
};

export const validateOptionFilterProp = (prop: any) => {
  if (typeof prop !== "string")
    return { valid: false, error: "Debe ser string" };
  return { valid: true };
};

export const validateMaxTagCount = (count: any) => {
  if (count === undefined || count === null || count === "")
    return { valid: true };
  if (!isNumber(count)) return { valid: false, error: "Debe ser un número" };
  if (Number(count) < 0) return { valid: false, error: "Debe ser ≥ 0" };
  return { valid: true };
};

// ✅ Botones
export function validateButtonType(value?: string) {
  const valid = ["default", "primary", "dashed", "text", "link"];
  if (!value) return { valid: true };
  if (!valid.includes(value)) {
    return {
      valid: false,
      error: `El tipo de botón debe ser uno de: ${valid.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateButtonLabel(value: string) {
  if (!value.trim())
    return { valid: false, error: "El texto del botón no puede estar vacío" };
  if (containsInvalidJSXChars(value)) {
    return {
      valid: false,
      error: "El texto del botón no puede contener <, >, {, }",
    };
  }
  return { valid: true };
}

export function validateButtonSize(value?: string) {
  const valid = ["small", "middle", "large"];
  if (!value) return { valid: true };
  if (!valid.includes(value)) {
    return {
      valid: false,
      error: `El tamaño del botón debe ser uno de: ${valid.join(", ")}`,
    };
  }
  return { valid: true };
}

// ✅ Valida que sea un string no vacío
export function validateStringProp(value: string): string | null {
  if (!value || value.trim() === "") {
    return "Debe ser un texto válido.";
  }
  return null;
}

// ✅ Valida que la prop optionLabelProp sea string (como "label", "value", etc.)
export function validateOptionLabelProp(value: string): string | null {
  const allowed = ["label", "value", "children"];
  if (!allowed.includes(value)) {
    return `Debe ser uno de: ${allowed.join(", ")}.`;
  }
  return null;
}

// ✅ Valida que minuteStep sea un número entero positivo dentro de rango válido
export function validateMinuteStep(value: string): string | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    return "Debe ser un número entero positivo.";
  }
  if (num > 60) {
    return "El valor no puede ser mayor que 60.";
  }
  return null;
}

// ✅ Valida que secondStep sea un número entero positivo dentro de rango válido
export function validateSecondStep(value: string): string | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    return "Debe ser un número entero positivo.";
  }
  if (num > 60) {
    return "El valor no puede ser mayor que 60.";
  }
  return null;
}

// 🔄 Antes era validateMinValue → ahora genérica
export function validatePositiveInteger(value: string): string | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return "Debe ser un número entero positivo.";
  }
  return null;
}

export const validateChecked = (value: unknown) => {
  if (value === undefined)
    return { valid: false, error: "Debe definir si está chequeado o no" };
  return { valid: true };
};

export const validateIndeterminate = (value: unknown) => {
  if (value === undefined)
    return { valid: false, error: "Debe definir si es indeterminado o no" };
  return { valid: true };
};
