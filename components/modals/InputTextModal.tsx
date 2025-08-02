"use client";

import { Modal, Input, Checkbox, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;

interface InputTextModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputTextModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputTextModalProps) {
  const { antdVersion } = useAntdVersion();
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [allowClear, setAllowClear] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<"error" | "warning" | "">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]+)"/);
    const nameMatch = codeBlock.match(/name="([^"]+)"/);
    const placeholderMatch = codeBlock.match(/placeholder="([^"]+)"/);
    const maxLengthMatch = codeBlock.match(/maxLength={(\d+)}/);
    const allowClearMatch = /allowClear/.test(codeBlock);
    const showCountMatch = /showCount/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);
    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setPlaceholder(placeholderMatch?.[1] || "");
    setMaxLength(maxLengthMatch ? parseInt(maxLengthMatch[1]) : undefined);
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

  const buildInputCode = () => {
    const inputProps: string[] = [];

    if (placeholder) inputProps.push(`placeholder="${placeholder}"`);
    if (maxLength !== undefined) inputProps.push(`maxLength={${maxLength}}`);
    if (disabled) inputProps.push(`disabled`);
    if (antdVersion !== "v3" && allowClear) inputProps.push(`allowClear`);
    if (antdVersion !== "v3" && showCount) inputProps.push(`showCount`);
    if (antdVersion !== "v3" && status) inputProps.push(`status="${status}"`);
    if (size && size !== "middle") inputProps.push(`size="${size}"`);

    return `<Form.Item label="${label}" name="${name}">
  <Input ${inputProps.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Input Text"
      onCancel={onCancel}
      onOk={() => onSave(buildInputCode())}
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
          value={maxLength}
          onChange={(e) => setMaxLength(Number(e.target.value) || undefined)}
          placeholder="Max Length"
        />

        <Divider>Opciones</Divider>

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
            >
              <Option value="">none</Option>
              <Option value="error">error</Option>
              <Option value="warning">warning</Option>
            </Select>
          </div>
        )}
      </div>
    </Modal>
  );
}
