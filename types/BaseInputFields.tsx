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
  rows?: number; // TextArea

  // Booleanos adicionales
  allowClear?: boolean;
  showCount?: boolean;
  autoSize?: boolean; // TextArea
  visibilityToggle?: boolean;

  // Number
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  keyboard?: boolean;
  controls?: boolean;

  // Select
  mode?: "" | "multiple" | "tags";
  options?: { label: string; value: string }[];
  optionFilterProp?: string;
  filterOption?: boolean;
  maxTagCount?: number;
  loading?: boolean;
  showSearch?: boolean;

  // Select avanzados
  dropdownMatchSelectWidth?: boolean | number;
  labelInValue?: boolean;
  optionLabelProp?: string;
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  bordered?: boolean;
  showArrow?: boolean;
  open?: boolean;
  notFoundContent?: string;
  dropdownStyle?: string; // ⬅️ cambiado a string
  dropdownClassName?: string;
  listHeight?: number;
  listItemHeight?: number;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

  // Rate
  allowHalf?: boolean;
  tooltips?: boolean; // ⬅️ cambiado a boolean
  character?: React.ReactNode;

  // Slider
  dots?: boolean;
  range?: boolean; // ⬅️ cambiado a boolean

  // Date/Time
  picker?: "date" | "week" | "month" | "quarter" | "year" | "time";
  showTime?: boolean; // ⬅️ cambiado a boolean
  format?: string;
  use12Hours?: boolean;

  // TimePicker específicos
  minuteStep?: number;
  secondStep?: number;
}
