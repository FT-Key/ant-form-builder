export type InputType =
  | "text"
  | "password"
  | "inputnumber"
  | "textarea"
  | "select"
  | "datepicker"
  | "timepicker"
  | "rangepicker"
  | "checkbox"
  | "checkboxgroup"
  | "radiogroup"
  | "switch"
  | "upload"
  | "slider"
  | "rate"
  | "cascader"
  | "treeselect"
  | "mentions"
  | "autocomplete"
  | "transfer"
  | "search"
  | "submit"
  | "steps"
  | "colorpicker"
  | "tour"
  | "segmented"
  | "floatbutton"
  | "watermark"
  | "other";

export function getInputType(codeBlock?: string): InputType {
  if (!codeBlock) return "other";

  if (codeBlock.includes("<Input.Password")) return "password";
  if (codeBlock.includes("<Input.TextArea")) return "textarea";
  if (codeBlock.includes("<InputNumber")) return "inputnumber";
  if (codeBlock.includes("<Select")) return "select";
  if (codeBlock.includes("<DatePicker.RangePicker")) return "rangepicker";
  if (codeBlock.includes("<DatePicker ")) return "datepicker";
  if (codeBlock.includes("<TimePicker")) return "timepicker";
  if (codeBlock.includes("<Checkbox.Group")) return "checkboxgroup";
  if (codeBlock.includes("<Checkbox")) return "checkbox";
  if (codeBlock.includes("<Radio.Group")) return "radiogroup";
  if (codeBlock.includes("<Switch")) return "switch";
  if (codeBlock.includes("<Upload")) return "upload";
  if (codeBlock.includes("<Slider")) return "slider";
  if (codeBlock.includes("<Rate")) return "rate";
  if (codeBlock.includes("<Cascader")) return "cascader";
  if (codeBlock.includes("<TreeSelect")) return "treeselect";
  if (codeBlock.includes("<Mentions")) return "mentions";
  if (codeBlock.includes("<AutoComplete")) return "autocomplete";
  if (codeBlock.includes("<Transfer")) return "transfer";
  if (codeBlock.includes("<Input.Search")) return "search";
  if (codeBlock.includes("<Button")) return "submit";
  if (codeBlock.includes("<Steps")) return "steps";
  if (codeBlock.includes("<ColorPicker")) return "colorpicker";
  if (codeBlock.includes("<Tour")) return "tour";
  if (codeBlock.includes("<Segmented")) return "segmented";
  if (codeBlock.includes("<FloatButton")) return "floatbutton";
  if (codeBlock.includes("<Watermark")) return "watermark";
  if (codeBlock.includes("<Input")) return "text";

  return "other";
}
