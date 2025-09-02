import { BaseInputFields } from "@/types/BaseInputFields";

export function buildInputCode(
  fields: BaseInputFields,
  extraProps: Record<string, any> = {},
  component = "Input",
  namespace?: string
) {
  const props: string[] = [];

  const mappedFields: Record<string, any> = {
    ...fields,
    ...extraProps,
    id: fields.inputId,
  };
  delete mappedFields.inputId;

  const { options, innerText, ...rest } = mappedFields; // <-- extraemos innerText

  const skipInnerProps = new Set(["label", "name"]);

  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined || value === "") continue;
    if (skipInnerProps.has(key)) continue;

    // Booleanos especiales o normales
    if (typeof value === "boolean") {
      if (["controls", "keyboard", "visibilityToggle"].includes(key)) {
        props.push(`${key}={${value}}`);
      } else if (value === true) {
        props.push(key);
      }
      continue;
    }

    // Números que van entre llaves
    if (
      [
        "minuteStep",
        "secondStep",
        "step",
        "precision",
        "min",
        "max",
        "rows",
        "cols",
        "listHeight",
        "listItemHeight",
        "maxTagCount",
      ].includes(key) &&
      typeof value === "number"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    // Strings normales
    props.push(`${key}="${value}"`);
  }

  // Form.Item
  const formItemAttrs: string[] = [];
  if (fields.label !== undefined) formItemAttrs.push(`label="${fields.label}"`);
  if (fields.name !== undefined) formItemAttrs.push(`name="${fields.name}"`);

  // Select con options
  if (component === "Select" && Array.isArray(options) && options.length > 0) {
    const children = options
      .map(
        (opt) =>
          `      <Select.Option value="${opt.value}">${opt.label}</Select.Option>`
      )
      .join("\n");

    return `<Form.Item ${formItemAttrs.join(" ")} >
    <Select ${props.join(" ")} >
${children}
    </Select>
  </Form.Item>`;
  }

  // Determinar el componente completo
  let fullComponent = component;
  if (namespace) {
    fullComponent = `${namespace}.${component}`;
  } else if (component === "RangePicker") {
    fullComponent = `DatePicker.RangePicker`;
    if (fields.formatDate) props.push(`format="${fields.formatDate}"`);
    if (fields.className) props.push(`className="${fields.className}"`);
  } else if (component === "TimePicker") {
    fullComponent = `TimePicker`;
    if (fields.formatTime) props.push(`format="${fields.formatTime}"`);
    if (fields.className) props.push(`className="${fields.className}"`);
  } else {
    if (fields.className) props.push(`className="${fields.className}"`);
  }

  // 🔹 Ajuste para innerText
  const hasInnerText = typeof innerText === "string" && innerText.trim() !== "";
  if (hasInnerText) {
    return `<Form.Item ${formItemAttrs.join(" ")} >
    <${fullComponent} ${props.join(" ")}>${innerText}</${fullComponent}>
  </Form.Item>`;
  }

  return `<Form.Item ${formItemAttrs.join(" ")} >
    <${fullComponent} ${props.join(" ")} />
  </Form.Item>`;
}
