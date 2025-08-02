"use client";

import { Modal, Input, Checkbox, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

interface TextAreaEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

const { Option } = Select;

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
  const [autoSize, setAutoSize] = useState<boolean>(false);
  const [allowClear, setAllowClear] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]+)"/);
    const nameMatch = codeBlock.match(/name="([^"]+)"/);
    const placeholderMatch = codeBlock.match(/placeholder="([^"]*)"/);
    const rowsMatch = codeBlock.match(/rows={?(\d+)}?/);
    const maxLengthMatch = codeBlock.match(/maxLength={?(\d+)}?/);
    const autoSizeMatch = /autoSize/.test(codeBlock);
    const allowClearMatch = /allowClear/.test(codeBlock);
    const showCountMatch = /showCount/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);
    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setPlaceholder(placeholderMatch?.[1] || "");
    setRows(rowsMatch ? Number(rowsMatch[1]) : 4);
    setMaxLength(maxLengthMatch ? Number(maxLengthMatch[1]) : undefined);
    setAutoSize(autoSizeMatch);
    setAllowClear(allowClearMatch);
    setShowCount(showCountMatch);
    setDisabled(disabledMatch);

    const statusValue = statusMatch?.[1];
    if (statusValue === "error" || statusValue === "warning") {
      setStatus(statusValue);
    } else {
      setStatus("");
    }

    const sizeValue = sizeMatch?.[1];
    if (
      sizeValue === "small" ||
      sizeValue === "middle" ||
      sizeValue === "large"
    ) {
      setSize(sizeValue);
    } else {
      setSize("middle");
    }
  }, [codeBlock]);

  const buildCode = () => {
    const inputProps: string[] = [];

    if (placeholder) inputProps.push(`placeholder="${placeholder}"`);
    if (rows) inputProps.push(`rows={${rows}}`);
    if (maxLength !== undefined) inputProps.push(`maxLength={${maxLength}}`);
    if (disabled) inputProps.push(`disabled`);
    if (antdVersion !== "v3" && allowClear) inputProps.push(`allowClear`);
    if (antdVersion !== "v3" && showCount) inputProps.push(`showCount`);
    if (antdVersion !== "v3" && autoSize) inputProps.push(`autoSize`);
    if (antdVersion !== "v3" && status) inputProps.push(`status="${status}"`);
    if (size && size !== "middle") inputProps.push(`size="${size}"`);

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
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiqueta"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
        />
        <Input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Placeholder"
        />
        <Input
          type="number"
          value={rows}
          min={1}
          onChange={(e) => setRows(Number(e.target.value) || 4)}
          placeholder="Filas (rows)"
        />
        <Input
          type="number"
          value={maxLength}
          onChange={(e) => setMaxLength(Number(e.target.value) || undefined)}
          placeholder="Max Length"
        />

        <Divider>Opciones</Divider>

        <Checkbox
          checked={autoSize}
          disabled={antdVersion === "v3"}
          onChange={(e) => setAutoSize(e.target.checked)}
        >
          autoSize
        </Checkbox>

        <Checkbox
          checked={allowClear}
          disabled={antdVersion === "v3"}
          onChange={(e) => setAllowClear(e.target.checked)}
        >
          allowClear
        </Checkbox>

        <Checkbox
          checked={showCount}
          disabled={antdVersion === "v3"}
          onChange={(e) => setShowCount(e.target.checked)}
        >
          showCount
        </Checkbox>

        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <div>
          <label className="block mb-1">Tamaño (size)</label>
          <Select
            value={size}
            onChange={(value) => setSize(value)}
            style={{ width: "100%" }}
          >
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
              onChange={(value) => setStatus(value)}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="error">error</Option>
              <Option value="warning">warning</Option>
            </Select>
          </div>
        )}
      </div>
    </Modal>
  );
}
