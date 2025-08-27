export interface BaseInputFields {
  // Básicos
  label: string;
  name: string;
  placeholder: string;
  disabled: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  // Estilos / tamaños
  size: "small" | "middle" | "large";
  status: "" | "error" | "warning";
  className?: string;

  // Identificadores
  inputId: string;

  // Addons
  addonBefore?: string;
  addonAfter?: string;
  prefix?: string;
  suffix?: string;

  // Validaciones numéricas
  minLength?: number;
  maxLength?: number;
  rows?: number; // <--- Agregado para TextArea

  // Booleanos adicionales
  allowClear?: boolean;
  showCount?: boolean;
  autoSize?: boolean; // <--- Agregado para TextArea

  // Visibilidad
  visibilityToggle?: boolean;

  // Number
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  keyboard?: boolean;
  controls?: boolean;

  // 🔽 Select-specific
  mode?: "" | "multiple" | "tags";
  options?: { label: string; value: string }[];
  optionFilterProp?: string;
  filterOption?: boolean;
  maxTagCount?: number;
  loading?: boolean;
  showSearch?: boolean;
}
