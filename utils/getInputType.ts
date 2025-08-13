// utils/getInputType.ts
export type InputType =
  | "submit"
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
  | "formitem"
  | "formgroup"
  | "descriptions"
  | "steps"
  | "colorpicker"
  | "tour"
  | "segmented"
  | "floatbutton"
  | "watermark"
  | "qr"
  | "imagepreviewgroup"
  | "other";

function getRootTagName(codeBlock: string): string | null {
  const m = codeBlock.trim().match(/^<\s*([A-Za-z0-9_.]+)/);
  return m ? m[1] : null;
}

export function getInputType(codeBlock?: string): InputType {
  if (!codeBlock) return "other";

  const root = getRootTagName(codeBlock);

  // --- Componente raíz Form.Item ---
  if (root === "Form.Item") {
    if (/\bInput\.Password\b/.test(codeBlock)) return "password";
    if (/\bInput\.TextArea\b/.test(codeBlock)) return "textarea";
    if (/\bInputNumber\b/.test(codeBlock)) return "inputnumber";
    if (/\bDatePicker\.RangePicker\b/.test(codeBlock)) return "rangepicker";
    if (/\bDatePicker\b/.test(codeBlock)) return "datepicker";
    if (/\bTimePicker\b/.test(codeBlock)) return "timepicker";
    if (/\bSelect\b/.test(codeBlock)) return "select";
    if (/\bQRCode\b/.test(codeBlock)) return "qr";
    if (/\bSlider\b/.test(codeBlock)) return "slider";
    if (/\bRate\b/.test(codeBlock)) return "rate";
    if (/\bCascader\b/.test(codeBlock)) return "cascader";
    if (/\bTreeSelect\b/.test(codeBlock)) return "treeselect";
    if (/\bMentions\b/.test(codeBlock)) return "mentions";
    if (/\bAutoComplete\b/.test(codeBlock)) return "autocomplete";
    if (/\bTransfer\b/.test(codeBlock)) return "transfer";
    if (/\bInput\.Search\b/.test(codeBlock)) return "search";
    if (/\bButton\b/.test(codeBlock)) return "submit";
    if (/\bInput\b/.test(codeBlock)) return "text"; // genérico para inputs
    return "formitem"; // Form.Item sin tipo reconocido
  }

  // --- Componentes que no están dentro de Form.Item ---
  if (root === "Watermark") return "watermark";
  if (root === "Steps") return "steps";
  if (root === "ColorPicker") return "colorpicker";
  if (root === "Tour") return "tour";
  if (root === "Segmented") return "segmented";
  if (root === "FloatButton") return "floatbutton";
  if (root === "QRCode") return "qr";
  if (root === "Image.PreviewGroup" || root === "ImagePreviewGroup")
    return "imagepreviewgroup";
  if (root === "Descriptions.Item" || root === "Descriptions")
    return "descriptions";
  if (root === "Space.Compact" || root === "FormGroup") return "formgroup";

  // --- Búsqueda en contenido (fallback) ---
  if (/\bQRCode\b/.test(codeBlock)) return "qr";
  if (/\bImage\.PreviewGroup\b/.test(codeBlock)) return "imagepreviewgroup";
  if (/\bDescriptions(\.Item)?\b/.test(codeBlock)) return "descriptions";
  if (/\bSpace\.Compact\b/.test(codeBlock)) return "formgroup";
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
  if (/\bInput\b/.test(codeBlock)) return "text";

  return "other";
}
