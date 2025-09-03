// BaseInputFields.ts
export interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
  optionType?: "default" | "button"; // usado en Radio.Group
  children?: OptionItem[]; // para Select/Cascader/TreeSelect jerárquicos
}

export interface BaseInputFields {
  // Básicos
  innerText?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  // Estilos / tamaños
  size?: "small" | "middle" | "large";
  status?: "" | "error" | "warning";
  className?: string;

  // Identificadores
  inputId?: string;

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
  dropdownStyle?: string;
  dropdownClassName?: string;
  listHeight?: number;
  listItemHeight?: number;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

  // Rate
  allowHalf?: boolean;
  tooltips?: string[];
  tooltipsEnabled?: boolean;
  character?: React.ReactNode;

  // Slider
  dots?: boolean;
  range?: boolean;

  // Date/Time
  picker?: "date" | "week" | "month" | "quarter" | "year" | "time";
  showTime?: boolean;
  formatDate?: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD";
  formatTime?: "HH:mm:ss" | "HH:mm" | "hh:mm:ss a" | "hh:mm a";
  use12Hours?: boolean;

  // TimePicker específicos
  minuteStep?: number;
  secondStep?: number;

  // Checkbox específicos
  checked?: boolean;
  indeterminate?: boolean;

  // Otros
  options?: OptionItem[]; // usado en CheckboxGroup, RadioGroup, Select, etc.
  [key: string]: any; // flexibilidad extra
}
