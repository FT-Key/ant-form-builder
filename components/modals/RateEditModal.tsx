"use client";

import { Modal, Input, InputNumber, Checkbox, Collapse, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;

interface RateEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function RateEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: RateEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | undefined>(5);
  const [allowHalf, setAllowHalf] = useState(false);
  const [allowClear, setAllowClear] = useState(true);
  const [tooltips, setTooltips] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];
    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setInputId(matchAttr("id"));
    setCount(matchNum("count") ? parseInt(matchNum("count")!) : 5);
    setAllowHalf(codeBlock.includes("allowHalf"));
    setDisabled(codeBlock.includes("disabled"));
    setAutoFocus(codeBlock.includes("autoFocus"));
    setAllowClear(!isFalse("allowClear"));

    const tooltipMatch = codeBlock.match(/tooltips=\{(\[.*?\])\}/)?.[1];
    setTooltips(tooltipMatch || "");
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];
    if (count !== undefined) props.push(`count={${count}}`);
    if (allowHalf) props.push("allowHalf");
    if (!allowClear) props.push("allowClear={false}");
    if (disabled) props.push("disabled");
    if (autoFocus) props.push("autoFocus");
    if (tooltips) props.push(`tooltips={${tooltips}}`);
    if (inputId) props.push(`id="${inputId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <Rate ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Rate"
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

        <Divider />
        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <InputNumber
              style={{ width: "100%" }}
              value={count}
              onChange={(val) => setCount(val ?? 5)}
              placeholder="count"
              addonBefore="count"
              className="mb-2"
            />
            <Input
              value={tooltips}
              onChange={(e) => setTooltips(e.target.value)}
              addonBefore="tooltips"
              placeholder='Ej: ["malo","regular","bueno"]'
              className="mb-2"
            />
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={allowHalf}
              onChange={(e) => setAllowHalf(e.target.checked)}
            >
              allowHalf
            </Checkbox>
            <Checkbox
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
            >
              allowClear
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
            >
              autoFocus
            </Checkbox>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
