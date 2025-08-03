"use client";

import {
  Modal,
  Input,
  Checkbox as AntdCheckbox,
  Select,
  Collapse,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface CheckboxEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function CheckboxEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: CheckboxEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estados básicos
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [defaultChecked, setDefaultChecked] = useState(false);

  // Opciones avanzadas
  const [disabled, setDisabled] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [value, setValue] = useState(""); // valor string para checkbox, si se usa en grupo
  const [inputId, setInputId] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [tabIndex, setTabIndex] = useState<number | undefined>(undefined);
  const [ariaLabel, setAriaLabel] = useState("");
  const [ariaLabelledBy, setAriaLabelledBy] = useState("");
  const [ariaDescribedBy, setAriaDescribedBy] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  // Detectar y parsear props desde el código recibido
  useEffect(() => {
    // label es contenido dentro del <Checkbox>...</Checkbox>
    const labelMatch = codeBlock.match(/<Checkbox[^>]*>([^<]+)<\/Checkbox>/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const checkedMatch = /checked={true}/.test(codeBlock);
    const defaultCheckedMatch = /defaultChecked={true}/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const indeterminateMatch = /indeterminate/.test(codeBlock);
    const autoFocusMatch = /autoFocus/.test(codeBlock);
    const valueMatch = codeBlock.match(/value="([^"]*)"/);
    const idMatch = codeBlock.match(/id="([^"]*)"/);
    const readOnlyMatch = /readOnly/.test(codeBlock);
    const tabIndexMatch = codeBlock.match(/tabIndex={(\-?\d+)}/);
    const ariaLabelMatch = codeBlock.match(/aria-label="([^"]*)"/);
    const ariaLabelledByMatch = codeBlock.match(/aria-labelledby="([^"]*)"/);
    const ariaDescribedByMatch = codeBlock.match(/aria-describedby="([^"]*)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(labelMatch ? labelMatch[1] : "");
    setName(nameMatch?.[1] || "");
    setChecked(checkedMatch);
    setDefaultChecked(defaultCheckedMatch);
    setDisabled(disabledMatch);
    setIndeterminate(indeterminateMatch);
    setAutoFocus(autoFocusMatch);
    setValue(valueMatch?.[1] || "");
    setInputId(idMatch?.[1] || "");
    setReadOnly(readOnlyMatch);
    setTabIndex(tabIndexMatch ? Number(tabIndexMatch[1]) : undefined);
    setAriaLabel(ariaLabelMatch?.[1] || "");
    setAriaLabelledBy(ariaLabelledByMatch?.[1] || "");
    setAriaDescribedBy(ariaDescribedByMatch?.[1] || "");

    const statusValue = statusMatch?.[1];
    setStatus(
      statusValue === "error" || statusValue === "warning" ? statusValue : ""
    );
  }, [codeBlock]);

  // Construir código JSX con las props seleccionadas
  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (checked) props.push(`checked={true}`);
    if (defaultChecked) props.push(`defaultChecked={true}`);
    if (disabled) props.push("disabled");
    if (indeterminate) props.push("indeterminate");
    if (autoFocus) props.push("autoFocus");
    if (value) props.push(`value="${value}"`);
    if (inputId) props.push(`id="${inputId}"`);
    if (readOnly) props.push("readOnly");
    if (tabIndex !== undefined) props.push(`tabIndex={${tabIndex}}`);
    if (ariaLabel) props.push(`aria-label="${ariaLabel}"`);
    if (ariaLabelledBy) props.push(`aria-labelledby="${ariaLabelledBy}"`);
    if (ariaDescribedBy) props.push(`aria-describedby="${ariaDescribedBy}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    // Nota: no incluimos onChange por ser función

    return `<Form.Item${name ? ` name="${name}"` : ""}>
  <Checkbox ${props.join(" ")}>${label}</Checkbox>
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Checkbox"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiqueta"
          addonBefore="label"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
          addonBefore="name"
        />
        <AntdCheckbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mb-2"
        >
          checked
        </AntdCheckbox>
        <AntdCheckbox
          checked={defaultChecked}
          onChange={(e) => setDefaultChecked(e.target.checked)}
          className="mb-2"
        >
          defaultChecked
        </AntdCheckbox>

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <AntdCheckbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </AntdCheckbox>
            <AntdCheckbox
              checked={indeterminate}
              onChange={(e) => setIndeterminate(e.target.checked)}
              className="mb-2"
            >
              indeterminate
            </AntdCheckbox>
            <AntdCheckbox
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
              className="mb-2"
            >
              autoFocus
            </AntdCheckbox>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="value"
              addonBefore="value"
              className="mb-2"
            />
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="ID"
              addonBefore="id"
              className="mb-2"
            />
            <AntdCheckbox
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
              className="mb-2"
            >
              readOnly
            </AntdCheckbox>
            <Input
              type="number"
              value={tabIndex !== undefined ? tabIndex : ""}
              onChange={(e) =>
                setTabIndex(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              placeholder="tabIndex"
              addonBefore="tabIndex"
              className="mb-2"
            />
            <Input
              value={ariaLabel}
              onChange={(e) => setAriaLabel(e.target.value)}
              placeholder="aria-label"
              addonBefore="aria-label"
              className="mb-2"
            />
            <Input
              value={ariaLabelledBy}
              onChange={(e) => setAriaLabelledBy(e.target.value)}
              placeholder="aria-labelledby"
              addonBefore="aria-labelledby"
              className="mb-2"
            />
            <Input
              value={ariaDescribedBy}
              onChange={(e) => setAriaDescribedBy(e.target.value)}
              placeholder="aria-describedby"
              addonBefore="aria-describedby"
              className="mb-2"
            />

            {antdVersion !== "v3" && (
              <div>
                <label className="block mb-1">Estado</label>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="">none</Option>
                  <Option value="error">error</Option>
                  <Option value="warning">warning</Option>
                </Select>
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
