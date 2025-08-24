"use client";

import { Modal, Input, Checkbox, Select, Divider, Collapse } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";

const { Option } = Select;
const { Panel } = Collapse;

interface InputPasswordEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputPasswordEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputPasswordEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [visibilityToggle, setVisibilityToggle] = useState(true);
  const [status, setStatus] = useState<"error" | "warning" | "">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");

  const [activePanels, setActivePanels] = useState<string[]>([]);

  useEffect(() => {
    const matchAttr = (attr: string) => {
      const match = codeBlock.match(new RegExp(`${attr}="([^"]+)"`));
      return match?.[1] || "";
    };

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setDisabled(matchBool("disabled"));

    setVisibilityToggle(() => {
      if (antdVersion === "v3") return true;
      const explicitFalse = /visibilityToggle=\{false\}/.test(codeBlock);
      return !explicitFalse;
    });

    const statusValue = statusMatch?.[1];
    setStatus(
      statusValue === "error" || statusValue === "warning" ? statusValue : ""
    );

    const sizeValue = sizeMatch?.[1];
    setSize(
      sizeValue === "small" || sizeValue === "middle" || sizeValue === "large"
        ? sizeValue
        : "middle"
    );
  }, [codeBlock, antdVersion]);

  // ✅ Hook de validación
  const { errors, validateAndSave } = useInputValidation({
    label,
    name,
    placeholder,
    disabled,
    size,
    status,
    onSave,
    buildCode: () => {
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
    },
  });

  // ✅ useEffect para abrir paneles según errores
  useEffect(() => {
    const basicErrors = ["errorLabel", "errorName", "errorPlaceholder"];
    const advancedErrors = ["errorSize", "errorStatus"];

    const newActivePanels: string[] = [];

    if (basicErrors.some((key) => errors[key])) newActivePanels.push("0");
    if (advancedErrors.some((key) => errors[key])) newActivePanels.push("1");

    setActivePanels(newActivePanels);
  }, [errors]);

  return (
    <Modal
      open={open}
      title="Editar Input Password"
      onCancel={onCancel}
      onOk={validateAndSave}
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
          status={errors["errorLabel"] ? "error" : undefined}
        />
        {errors["errorLabel"] && (
          <div className="text-red-500">{errors["errorLabel"]}</div>
        )}

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
          addonBefore="name"
          status={errors["errorName"] ? "error" : undefined}
        />
        {errors["errorName"] && (
          <div className="text-red-500">{errors["errorName"]}</div>
        )}

        <Input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Placeholder"
          addonBefore="placeholder"
          status={errors["errorPlaceholder"] ? "error" : undefined}
        />
        {errors["errorPlaceholder"] && (
          <div className="text-red-500">{errors["errorPlaceholder"]}</div>
        )}

        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <Collapse
          ghost
          activeKey={activePanels}
          onChange={(keys) => setActivePanels(keys as string[])}
        >
          <Panel header="Opciones avanzadas" key="1">
            {antdVersion !== "v3" && (
              <Checkbox
                checked={visibilityToggle}
                onChange={(e) => setVisibilityToggle(e.target.checked)}
                className="mb-2"
              >
                visibilityToggle
              </Checkbox>
            )}

            <div className="mb-2">
              <label className="block mb-1">Tamaño (size)</label>
              <Select
                value={size}
                onChange={setSize}
                style={{ width: "100%" }}
                status={errors["errorSize"] ? "error" : undefined}
              >
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
              {errors["errorSize"] && (
                <div className="text-red-500">{errors["errorSize"]}</div>
              )}
            </div>

            {antdVersion !== "v3" && (
              <div>
                <label className="block mb-1">Estado</label>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: "100%" }}
                  status={errors["errorStatus"] ? "error" : undefined}
                >
                  <Option value="">none</Option>
                  <Option value="error">error</Option>
                  <Option value="warning">warning</Option>
                </Select>
                {errors["errorStatus"] && (
                  <div className="text-red-500">{errors["errorStatus"]}</div>
                )}
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
