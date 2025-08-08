// utils/getInputType.ts
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

function getRootTagName(codeBlock: string): string | null {
  const m = codeBlock.trim().match(/^<\s*([A-Za-z0-9_.]+)/);
  return m ? m[1] : null;
}

export function getInputType(codeBlock?: string): InputType {
  if (!codeBlock) return "other";

  const root = getRootTagName(codeBlock);

  // Si el root es Form.Item identificamos como text (o password si el hijo es Input.Password)
  if (root === "Form.Item") {
    if (/\bInput\.Password\b/.test(codeBlock)) return "password";
    if (/\bInput\.TextArea\b/.test(codeBlock)) return "textarea";
    if (/\bInput\b/.test(codeBlock)) return "text";
    if (/\bInputNumber\b/.test(codeBlock)) return "inputnumber";
    if (/\bSelect\b/.test(codeBlock)) return "select";
    // default para Form.Item
    return "text";
  }

  // Si root es otro componente (no Form.Item) detectamos por root o por contenido
  if (root === "Watermark") return "watermark";
  if (root === "Steps") return "steps";
  if (root === "ColorPicker") return "colorpicker";
  if (root === "Tour") return "tour";
  if (root === "Segmented") return "segmented";
  if (root === "FloatButton") return "floatbutton";

  // fallback por búsqueda en contenido (por si el bloque no es Form.Item pero contiene un Input)
  if (/\bInput\.Password\b/.test(codeBlock)) return "password";
  if (/\bInput\.TextArea\b/.test(codeBlock)) return "textarea";
  if (/\bDatePicker\.RangePicker\b/.test(codeBlock)) return "rangepicker";
  if (/\bDatePicker\b/.test(codeBlock)) return "datepicker";
  if (/\bTimePicker\b/.test(codeBlock)) return "timepicker";
  if (/\bSlider\b/.test(codeBlock)) return "slider";
  if (/\bRate\b/.test(codeBlock)) return "rate";
  if (/\bTreeSelect\b/.test(codeBlock)) return "treeselect";
  if (/\bCascader\b/.test(codeBlock)) return "cascader";
  if (/\bMentions\b/.test(codeBlock)) return "mentions";
  if (/\bAutoComplete\b/.test(codeBlock)) return "autocomplete";
  if (/\bTransfer\b/.test(codeBlock)) return "transfer";
  if (/\bInput\.Search\b/.test(codeBlock)) return "search";
  if (/\bButton\b/.test(codeBlock)) return "submit";
  if (/\bSelect\b/.test(codeBlock)) return "select";
  if (/\bInputNumber\b/.test(codeBlock)) return "inputnumber";

  return "other";
}
