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

  for (const [key, value] of Object.entries(mappedFields)) {
    if (value === undefined || value === "") continue;

    // ✅ Caso especial: controls y keyboard
    if (
      (key === "controls" || key === "keyboard") &&
      typeof value === "boolean"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    // ✅ Para booleanos normales
    if (value === true) {
      props.push(key);
      continue;
    }
    if (value === false) continue;

    // ✅ Para números
    if (
      (key === "minLength" || key === "maxLength") &&
      typeof value === "number"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    // ✅ Default: string
    props.push(`${key}="${value}"`);
  }

  return `<Form.Item label="${fields.label}" name="${fields.name}">
    <${component} ${props.join(" ")} />
  </Form.Item>`;
}

/* export function buildInputCode(
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

  for (const [key, value] of Object.entries(mappedFields)) {
    if (value === undefined || value === false || value === "") continue;

    if (value === true) {
      props.push(key);
      continue;
    }

    // 👉 Para números (minLength/maxLength) usar llaves JSX
    if (
      (key === "minLength" || key === "maxLength") &&
      typeof value === "number"
    ) {
      props.push(`${key}={${value}}`);
      continue;
    }

    props.push(`${key}="${value}"`);
  }

  return `<Form.Item label="${fields.label}" name="${fields.name}">
    <${component} ${props.join(" ")} />
  </Form.Item>`;
}
 */
