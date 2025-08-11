// utils/validators.ts

/**
 * Valida que el label sea una cadena no vacía, y sin caracteres que puedan romper JSX (<> {})
 */
export function validateLabel(label: string): {
  valid: boolean;
  error?: string;
} {
  if (!label.trim()) {
    return { valid: false, error: "El label no puede estar vacío" };
  }
  // Prohibir caracteres <> y {}
  if (/[<>{}]/.test(label)) {
    return {
      valid: false,
      error: "El label no puede contener caracteres <, >, {, }",
    };
  }
  return { valid: true };
}

/**
 * Valida que el name sea válido:
 * - no vacío
 * - solo caracteres válidos para nombres HTML/JSX (letras, números, guion bajo y guion medio)
 * - no empiece con número
 */
export function validateName(name: string): { valid: boolean; error?: string } {
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
