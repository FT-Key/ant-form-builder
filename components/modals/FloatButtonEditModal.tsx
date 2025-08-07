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

const { Option } = Select;
const { Panel } = Collapse;

interface FloatButtonEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function FloatButtonEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: FloatButtonEditModalProps) {
  const [tooltip, setTooltip] = useState("");
  const [type, setType] = useState<"default" | "primary">("default");
  const [shape, setShape] = useState<"circle" | "square">("circle");
  const [description, setDescription] = useState("");
  const [badgeCount, setBadgeCount] = useState<number>();
  const [danger, setDanger] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];

    setTooltip(matchAttr("tooltip"));
    setDescription(matchAttr("description"));
    setInputId(matchAttr("id"));

    const typeMatch = codeBlock.match(/type="(default|primary)"/)?.[1];
    setType(typeMatch === "primary" ? "primary" : "default");

    const shapeMatch = codeBlock.match(/shape="(circle|square)"/)?.[1];
    setShape(shapeMatch === "square" ? "square" : "circle");

    const badgeCountMatch = codeBlock.match(
      /badge=\{\{\s*count:\s*(\d+)\s*\}\}/
    );
    setBadgeCount(badgeCountMatch ? parseInt(badgeCountMatch[1]) : undefined);

    setDanger(codeBlock.includes("danger"));
    setDisabled(codeBlock.includes("disabled"));
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];
    if (tooltip) props.push(`tooltip="${tooltip}"`);
    if (type !== "default") props.push(`type="${type}"`);
    if (shape !== "circle") props.push(`shape="${shape}"`);
    if (description) props.push(`description="${description}"`);
    if (badgeCount !== undefined)
      props.push(`badge={{ count: ${badgeCount} }}`);
    if (danger) props.push("danger");
    if (disabled) props.push("disabled");
    if (inputId) props.push(`id="${inputId}"`);

    return `<FloatButton ${props.join(" ")} />`;
  };

  return (
    <Modal
      open={open}
      title="Editar FloatButton"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <Input
          value={tooltip}
          onChange={(e) => setTooltip(e.target.value)}
          addonBefore="tooltip"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          addonBefore="description"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <div className="mb-2">
              <label className="block mb-1">Tipo</label>
              <Select value={type} onChange={setType} style={{ width: "100%" }}>
                <Option value="default">default</Option>
                <Option value="primary">primary</Option>
              </Select>
            </div>

            <div className="mb-2">
              <label className="block mb-1">Forma</label>
              <Select
                value={shape}
                onChange={setShape}
                style={{ width: "100%" }}
              >
                <Option value="circle">circle</Option>
                <Option value="square">square</Option>
              </Select>
            </div>

            <InputNumber
              value={badgeCount}
              onChange={(val) => setBadgeCount(val ?? undefined)}
              placeholder="badge count"
              addonBefore="badge"
              className="mb-2"
              style={{ width: "100%" }}
            />

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={danger}
              onChange={(e) => setDanger(e.target.checked)}
              className="mb-2"
            >
              danger
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
