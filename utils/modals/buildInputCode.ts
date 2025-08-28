import { BaseInputFields } from "@/types/BaseInputFields";

export function buildInputCode(
  fields: BaseInputFields,
  extraProps: Record<string, any> = {},
  component = "Input"
) {
  const props: string[] = [];

  // mapping: usamos id en vez de inputId
  const mappedFields: Record<string, any> = {
    ...fields,
    ...extraProps,
    id: fields.inputId,
  };
  delete mappedFields.inputId;

  // extraemos options para tratarlas aparte
  const { options, ...rest } = mappedFields;

  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined || value === "") continue;

    // ✅ Caso especial: controls y keyboard
    if (
      (key === "controls" || key === "keyboard") &&
      typeof value === "boolean"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    // ✅ Booleanos normales
    if (value === true) {
      props.push(key);
      continue;
    }
    if (value === false) continue;

    // ✅ Números
    if (
      (key === "minLength" ||
        key === "maxLength" ||
        key === "rows" ||
        key === "cols") &&
      typeof value === "number"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    // ✅ Default: string
    props.push(`${key}="${value}"`);
  }

  // 🚀 Si es Select con opciones → renderizamos <Select.Option>
  if (component === "Select" && Array.isArray(options) && options.length > 0) {
    const children = options
      .map(
        (opt) =>
          `      <Select.Option value="${opt.value}">${opt.label}</Select.Option>`
      )
      .join("\n");

    return `<Form.Item label="${fields.label}" name="${fields.name}">
    <Select ${props.join(" ")}>
${children}
    </Select>
  </Form.Item>`;
  }

  // 🚀 Cualquier otro componente o Select sin opciones
  return `<Form.Item label="${fields.label}" name="${fields.name}">
    <${component} ${props.join(" ")} />
  </Form.Item>`;
}
