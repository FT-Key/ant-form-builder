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

  // Opciones avanzadas
  const [disabled, setDisabled] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [inputId, setInputId] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const labelMatch = codeBlock.match(/<Checkbox[^>]*>([^<]+)<\/Checkbox>/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const checkedMatch = /checked={true}/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const indeterminateMatch = /indeterminate/.test(codeBlock);
    const autoFocusMatch = /autoFocus/.test(codeBlock);
    const idMatch = codeBlock.match(/id="([^"]*)"/);
    const readOnlyMatch = /readOnly/.test(codeBlock);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setChecked(checkedMatch);
    setDisabled(disabledMatch);
    setIndeterminate(indeterminateMatch);
    setAutoFocus(autoFocusMatch);
    setInputId(idMatch?.[1] || "");
    setReadOnly(readOnlyMatch);
    setStatus(
      statusMatch?.[1] === "error" || statusMatch?.[1] === "warning"
        ? statusMatch[1]
        : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (checked) props.push(`checked={true}`);
    if (disabled) props.push("disabled");
    if (indeterminate) props.push("indeterminate");
    if (autoFocus) props.push("autoFocus");
    if (inputId) props.push(`id="${inputId}"`);
    if (readOnly) props.push("readOnly");
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

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
