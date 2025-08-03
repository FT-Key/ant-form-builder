"use client";

import { Modal, Input, Checkbox, Select, Divider, Collapse } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface TextAreaEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function TextAreaEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TextAreaEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [rows, setRows] = useState<number>(4);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [autoSize, setAutoSize] = useState(false);
  const [allowClear, setAllowClear] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) => {
      const match = codeBlock.match(new RegExp(`${attr}="([^"]*)"`));
      return match?.[1] || "";
    };

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const rowsMatch = codeBlock.match(/rows={?(\d+)}?/);
    const maxLengthMatch = codeBlock.match(/maxLength={?(\d+)}?/);
    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));
    setRows(rowsMatch ? Number(rowsMatch[1]) : 4);
    setMaxLength(maxLengthMatch ? Number(maxLengthMatch[1]) : undefined);
    setAutoSize(matchBool("autoSize"));
    setAllowClear(matchBool("allowClear"));
    setShowCount(matchBool("showCount"));
    setDisabled(matchBool("disabled"));
    setReadOnly(matchBool("readOnly"));
    setAutoFocus(matchBool("autoFocus"));

    const sizeValue = sizeMatch?.[1];
    setSize(
      sizeValue === "small" || sizeValue === "middle" || sizeValue === "large"
        ? sizeValue
        : "middle"
    );

    const statusValue = statusMatch?.[1];
    setStatus(
      statusValue === "error" || statusValue === "warning" ? statusValue : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const inputProps: string[] = [];

    if (placeholder) inputProps.push(`placeholder="${placeholder}"`);
    if (rows) inputProps.push(`rows={${rows}}`);
    if (maxLength !== undefined) inputProps.push(`maxLength={${maxLength}}`);
    if (disabled) inputProps.push(`disabled`);
    if (readOnly) inputProps.push(`readOnly`);
    if (autoFocus) inputProps.push(`autoFocus`);
    if (antdVersion !== "v3" && autoSize) inputProps.push(`autoSize`);
    if (antdVersion !== "v3" && allowClear) inputProps.push(`allowClear`);
    if (antdVersion !== "v3" && showCount) inputProps.push(`showCount`);
    if (antdVersion !== "v3" && status) inputProps.push(`status="${status}"`);
    if (size && size !== "middle") inputProps.push(`size="${size}"`);
    if (inputId) inputProps.push(`id="${inputId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <Input.TextArea ${inputProps.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar TextArea"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
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
        <Input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Placeholder"
          addonBefore="placeholder"
        />
        <Input
          type="number"
          value={rows}
          min={1}
          onChange={(e) => setRows(Number(e.target.value) || 4)}
          placeholder="Filas (rows)"
          addonBefore="rows"
        />
        <Input
          type="number"
          value={maxLength}
          onChange={(e) => setMaxLength(Number(e.target.value) || undefined)}
          placeholder="Max Length"
          addonBefore="maxLength"
        />
        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={autoSize}
              onChange={(e) => setAutoSize(e.target.checked)}
              disabled={antdVersion === "v3"}
              className="mb-2"
            >
              autoSize
            </Checkbox>

            <Checkbox
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
              disabled={antdVersion === "v3"}
              className="mb-2"
            >
              allowClear
            </Checkbox>

            <Checkbox
              checked={showCount}
              onChange={(e) => setShowCount(e.target.checked)}
              disabled={antdVersion === "v3"}
              className="mb-2"
            >
              showCount
            </Checkbox>

            <Checkbox
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
              className="mb-2"
            >
              readOnly
            </Checkbox>

            <Checkbox
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
              className="mb-2"
            >
              autoFocus
            </Checkbox>

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="ID del input"
              addonBefore="id"
              className="mb-2"
            />

            <div className="mb-2">
              <label className="block mb-1">Tamaño (size)</label>
              <Select value={size} onChange={setSize} style={{ width: "100%" }}>
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
            </div>

            {antdVersion !== "v3" && (
              <div>
                <label className="block mb-1">Estado</label>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: "100%" }}
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
