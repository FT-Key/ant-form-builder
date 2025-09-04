import { BaseInputFields } from "@/types/BaseInputFields";

export function buildInputCode(
  fields: BaseInputFields,
  extraProps: Record<string, any> = {},
  component = "Input",
  namespace?: string
) {
  const props: string[] = [];

  // Merge fields y extraProps
  const mappedFields: Record<string, any> = {
    ...fields,
    ...extraProps,
    id: fields.inputId,
  };
  delete mappedFields.inputId;

  const {
    options,
    innerText,
    component: extraComponent,
    ...rest
  } = mappedFields;
  const skipInnerProps = new Set(["label", "name"]);

  // Construir props normales
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined || value === "") continue;
    if (skipInnerProps.has(key)) continue;

    if (typeof value === "boolean") {
      if (["controls", "keyboard", "visibilityToggle"].includes(key)) {
        props.push(`${key}={${value}}`);
      } else if (value === true) {
        props.push(key);
      }
      continue;
    }

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

    props.push(`${key}="${value}"`);
  }

  // Form.Item attrs
  const formItemAttrs: string[] = [];
  if (fields.label !== undefined) formItemAttrs.push(`label="${fields.label}"`);
  if (fields.name !== undefined) formItemAttrs.push(`name="${fields.name}"`);
  if (fields.valuePropName)
    formItemAttrs.push(`valuePropName="${fields.valuePropName}"`);

  // Determinar el componente final
  let fullComponent = extraComponent || component || "Input";

  // 🔹 Casos especiales
  if (
    fullComponent === "Select" &&
    Array.isArray(options) &&
    options.length > 0
  ) {
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

  if (fullComponent === "Checkbox.Group" && Array.isArray(options)) {
    const optionsString = `[${options
      .map((opt) =>
        typeof opt === "string"
          ? `'${opt.replace(/'/g, "\\'")}'`
          : `{ label: '${opt.label.replace(
              /'/g,
              "\\'"
            )}', value: '${opt.value.replace(/'/g, "\\'")}' }`
      )
      .join(", ")}]`;
    props.push(`options={${optionsString}}`);
  }

  if (
    fullComponent === "Radio.Group" &&
    Array.isArray(options) &&
    options.length > 0
  ) {
    const children = options
      .map((opt) => `      <Radio value="${opt.value}">${opt.label}</Radio>`)
      .join("\n");

    return `<Form.Item ${formItemAttrs.join(" ")} >
    <Radio.Group ${props.join(" ")} >
${children}
    </Radio.Group>
  </Form.Item>`;
  }

  if (fullComponent === "Switch") {
    if (rest.switchSize) props.push(`size="${rest.switchSize}"`);
    if (rest.checked !== undefined) props.push(`checked={${rest.checked}}`);
    if (rest.loading !== undefined) props.push(`loading={${rest.loading}}`);
    if (rest.checkedChildren)
      props.push(`checkedChildren="${rest.checkedChildren}"`);
    if (rest.unCheckedChildren)
      props.push(`unCheckedChildren="${rest.unCheckedChildren}"`);

    return `<Form.Item ${formItemAttrs.join(" ")} >
    <Switch ${props.join(" ")} />
</Form.Item>`;
  }

  // Otros componentes con namespace
  if (namespace) {
    fullComponent = `${namespace}.${fullComponent}`;
  } else if (fullComponent === "RangePicker") {
    fullComponent = `DatePicker.RangePicker`;
    if (fields.formatDate) props.push(`format="${fields.formatDate}"`);
    if (fields.className) props.push(`className="${fields.className}"`);
  } else if (fullComponent === "TimePicker") {
    fullComponent = `TimePicker`;
    if (fields.formatTime) props.push(`format="${fields.formatTime}"`);
  } else {
    if (fields.className) props.push(`className="${fields.className}"`);
  }

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
