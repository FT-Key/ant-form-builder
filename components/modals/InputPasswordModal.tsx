"use client";

import { Modal, Input, Checkbox, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;

interface InputPasswordModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputPasswordModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputPasswordModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [visibilityToggle, setVisibilityToggle] = useState(true);
  const [status, setStatus] = useState<"error" | "warning" | "">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]+)"/);
    const nameMatch = codeBlock.match(/name="([^"]+)"/);
    const placeholderMatch = codeBlock.match(/placeholder="([^"]+)"/);
    const disabledMatch = /disabled/.test(codeBlock);
    const visibilityToggleMatch = /visibilityToggle/.test(codeBlock);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);
    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setPlaceholder(placeholderMatch?.[1] || "");
    setDisabled(disabledMatch);
    setVisibilityToggle(
      antdVersion !== "v3" ? visibilityToggleMatch : true // v3 no soporta visibilityToggle, pero siempre visible
    );
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
  }, [codeBlock, antdVersion]);

  const buildInputPasswordCode = () => {
    const inputProps: string[] = [];

    if (placeholder) inputProps.push(`placeholder="${placeholder}"`);
    if (disabled) inputProps.push(`disabled`);
    if (antdVersion !== "v3" && !visibilityToggle)
      inputProps.push(`visibilityToggle={false}`);
    if (antdVersion !== "v3" && status) inputProps.push(`status="${status}"`);
    if (size && size !== "middle") inputProps.push(`size="${size}"`);

    return `<Form.Item label="${label}" name="${name}">
  <Input.Password ${inputProps.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Input Password"
      onCancel={onCancel}
      onOk={() => onSave(buildInputPasswordCode())}
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

        <Divider>Opciones</Divider>

        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        {antdVersion !== "v3" && (
          <Checkbox
            checked={visibilityToggle}
            onChange={(e) => setVisibilityToggle(e.target.checked)}
          >
            visibilityToggle
          </Checkbox>
        )}

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
