"use client";

import {
  Modal,
  Input,
  InputNumber,
  Checkbox,
  Select,
  Collapse,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface InputNumberEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputNumberEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputNumberEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [step, setStep] = useState<number | undefined>();
  const [precision, setPrecision] = useState<number | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [keyboard, setKeyboard] = useState(true);
  const [controls, setControls] = useState(true);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+\\.?\\d*)}`))?.[1];
    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));
    setMin(matchNum("min") ? parseFloat(matchNum("min")!) : undefined);
    setMax(matchNum("max") ? parseFloat(matchNum("max")!) : undefined);
    setStep(matchNum("step") ? parseFloat(matchNum("step")!) : undefined);
    setPrecision(
      matchNum("precision") ? parseFloat(matchNum("precision")!) : undefined
    );

    setDisabled(codeBlock.includes("disabled"));
    setReadOnly(codeBlock.includes("readOnly"));
    setAutoFocus(codeBlock.includes("autoFocus"));
    setKeyboard(!isFalse("keyboard"));
    setControls(!isFalse("controls"));

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (min !== undefined) props.push(`min={${min}}`);
    if (max !== undefined) props.push(`max={${max}}`);
    if (step !== undefined) props.push(`step={${step}}`);
    if (precision !== undefined) props.push(`precision={${precision}}`);
    if (disabled) props.push("disabled");
    if (readOnly) props.push("readOnly");
    if (autoFocus) props.push("autoFocus");
    if (!keyboard) props.push("keyboard={false}");
    if (!controls) props.push("controls={false}");
    if (inputId) props.push(`id="${inputId}"`);
    if (size !== "middle") props.push(`size="${size}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}" name="${name}">
  <InputNumber ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar InputNumber"
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
          addonBefore="label"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          addonBefore="name"
        />
        <Input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          addonBefore="placeholder"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <InputNumber
              style={{ width: "100%" }}
              value={min}
              onChange={(val) => setMin(val ?? undefined)}
              placeholder="Mínimo"
              addonBefore="min"
              className="mb-2"
            />
            <InputNumber
              style={{ width: "100%" }}
              value={max}
              onChange={(val) => setMax(val ?? undefined)}
              placeholder="Máximo"
              addonBefore="max"
              className="mb-2"
            />
            <InputNumber
              style={{ width: "100%" }}
              value={step}
              onChange={(val) => setStep(val ?? undefined)}
              placeholder="Paso (step)"
              addonBefore="step"
              className="mb-2"
            />
            <InputNumber
              style={{ width: "100%" }}
              value={precision}
              onChange={(val) => setPrecision(val ?? undefined)}
              placeholder="Decimales (precision)"
              addonBefore="precision"
              className="mb-2"
            />

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
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
            <Checkbox
              checked={keyboard}
              onChange={(e) => setKeyboard(e.target.checked)}
              className="mb-2"
            >
              keyboard
            </Checkbox>
            <Checkbox
              checked={controls}
              onChange={(e) => setControls(e.target.checked)}
              className="mb-2"
            >
              controls
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Tamaño</label>
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
