// utils/validators.ts

export function validateClassName(value: string) {
  if (!value.trim()) {
    return { valid: true }; // opcional
  }
  const classNames = value.split(/\s+/);
  for (const cls of classNames) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(cls)) {
      return {
        valid: false,
        error: `La clase "${cls}" no es válida. Debe comenzar con letra/guion bajo y solo contener letras, números, guiones o guion bajo`,
      };
    }
  }
  return { valid: true };
}

function containsInvalidJSXChars(value: string): boolean {
  return /[<>{}]/.test(value);
}

export function validateLabel(label: string) {
  if (!label.trim()) {
    return { valid: false, error: "El label no puede estar vacío" };
  }
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

function isNumber(value: unknown): boolean {
  // acepta número o string numérico (ej: "10"), pero no strings no numéricos
  return (
    (typeof value === "number" && !isNaN(value)) ||
    (typeof value === "string" && /^\d+$/.test(value))
  );
}

/**
 * Valida el valor para el input minLength:
 * - debe ser número entero ≥ 0
 * - opcionalmente ≤ 9999 (por ejemplo)
 */
export function validateMinLength(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { valid: true }; // vacío es válido (campo opcional)
  }
  if (!isNumber(value)) {
    return {
      valid: false,
      error: "minLength debe ser un número entero válido",
    };
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return {
      valid: false,
      error: "minLength debe ser entero mayor o igual a 0",
    };
  }
  if (num > 9999) {
    return { valid: false, error: "minLength es demasiado grande" };
  }
  return { valid: true };
}

/**
 * Valida el valor para el input maxLength:
 * - debe ser número entero ≥ 0
 * - opcionalmente ≤ 9999
 */
export function validateMaxLength(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { valid: true }; // vacío es válido (campo opcional)
  }
  if (!isNumber(value)) {
    return {
      valid: false,
      error: "maxLength debe ser un número entero válido",
    };
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return {
      valid: false,
      error: "maxLength debe ser entero mayor o igual a 0",
    };
  }
  if (num > 9999) {
    return { valid: false, error: "maxLength es demasiado grande" };
  }
  return { valid: true };
}

/**
 * Valida valor para input min numérico (ej: min para un número arbitrario)
 * - puede ser decimal
 * - puede ser negativo
 */
export function validateMin(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }
  if (typeof value === "string" && value.trim() === "") {
    return { valid: true };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: "min debe ser un número válido" };
  }
  return { valid: true };
}

/**
 * Valida valor para input max numérico (ej: max para un número arbitrario)
 * - puede ser decimal
 * - puede ser negativo
 */
export function validateMax(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }
  if (typeof value === "string" && value.trim() === "") {
    return { valid: true };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: "max debe ser un número válido" };
  }
  return { valid: true };
}

// Valida addonBefore, addonAfter, prefix, suffix (strings sin chars JSX inválidos)
export function validateAddonValue(value: string) {
  if (!value.trim()) {
    // Permitimos vacío, no es obligatorio
    return { valid: true };
  }
  if (containsInvalidJSXChars(value)) {
    return {
      valid: false,
      error: "No puede contener los caracteres <, >, {, }",
    };
  }
  return { valid: true };
}

// Valida id, debe ser string no vacío, sin chars JSX inválidos y válido para HTML id
export function validateId(value: string) {
  if (!value.trim()) {
    return { valid: false, error: "El id no puede estar vacío" };
  }
  if (containsInvalidJSXChars(value)) {
    return {
      valid: false,
      error: "El id no puede contener los caracteres <, >, {, }",
    };
  }
  // Validar que id tenga solo letras, números, guiones, guion bajo y no inicie con número
  if (!/^[a-zA-Z_][a-zA-Z0-9-_:.]*$/.test(value)) {
    return {
      valid: false,
      error:
        "El id debe comenzar con letra o guion bajo y solo contener letras, números, guiones, guion bajo, puntos o dos puntos",
    };
  }
  return { valid: true };
}

export function validateSize(size?: string) {
  const validSizes = ["small", "middle", "large"];
  if (size === undefined || size === "") return { valid: true }; // opcional
  if (!validSizes.includes(size)) {
    return {
      valid: false,
      error: `size debe ser uno de: ${validSizes.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateStatus(status?: string) {
  const validStatuses = ["", "error", "warning"];
  // "" para 'none' como en el select
  if (status === undefined) return { valid: true }; // opcional
  if (!validStatuses.includes(status)) {
    return {
      valid: false,
      error: `status debe ser uno de: ${validStatuses
        .map((v) => (v === "" ? "none" : v))
        .join(", ")}`,
    };
  }
  return { valid: true };
}

// Button

export function validateButtonType(value?: string) {
  const validTypes = ["default", "primary", "dashed", "text", "link"];
  if (!value || value.trim() === "") return { valid: true };
  if (!validTypes.includes(value)) {
    return {
      valid: false,
      error: `El tipo de botón debe ser uno de: ${validTypes.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateButtonLabel(value: string) {
  if (!value.trim()) {
    return { valid: false, error: "El texto del botón no puede estar vacío" };
  }
  if (/[<>{}]/.test(value)) {
    return {
      valid: false,
      error: "El texto del botón no puede contener <, >, {, }",
    };
  }
  return { valid: true };
}

export function validateButtonSize(value?: string) {
  const validSizes = ["small", "middle", "large"];
  if (!value || value.trim() === "") return { valid: true };
  if (!validSizes.includes(value)) {
    return {
      valid: false,
      error: `El tamaño del botón debe ser uno de: ${validSizes.join(", ")}`,
    };
  }
  return { valid: true };
}
