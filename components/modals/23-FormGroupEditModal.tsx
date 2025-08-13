"use client";

import { Modal, Input, Checkbox, Collapse, Divider, Select } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;
const { Option } = Select;

interface FormGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function FormGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: FormGroupEditModalProps) {
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [block, setBlock] = useState(false);
  const [compactId, setCompactId] = useState("");
  const [childrenContent, setChildrenContent] = useState("");

  useEffect(() => {
    const getAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";

    const getBool = (attr: string) => codeBlock.includes(`${attr}`);

    const matchChildren = codeBlock.match(
      /<Space\.Compact[^>]*>([\s\S]*?)<\/Space\.Compact>/
    );
    setChildrenContent(matchChildren?.[1]?.trim() || "");

    setLabel(getAttr("label"));
    setName(getAttr("name"));
    setCompactId(getAttr("id"));

    const sizeMatch = getAttr("size");
    setSize(
      ["small", "large"].includes(sizeMatch) ? (sizeMatch as any) : "middle"
    );

    const dirMatch = getAttr("direction");
    setDirection(["vertical"].includes(dirMatch) ? "vertical" : "horizontal");

    setBlock(getBool("block"));
  }, [codeBlock]);

  const buildCode = () => {
    const compactProps: string[] = [];
    if (size !== "middle") compactProps.push(`size="${size}"`);
    if (direction !== "horizontal")
      compactProps.push(`direction="${direction}"`);
    if (block) compactProps.push("block");
    if (compactId) compactProps.push(`id="${compactId}"`);

    const itemProps: string[] = [];
    if (label) itemProps.push(`label="${label}"`);
    if (name) itemProps.push(`name="${name}"`);

    return `<Form.Item ${itemProps.join(" ")}>
  <Space.Compact ${compactProps.join(" ")}>
    ${childrenContent}
  </Space.Compact>
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Form Group (Space.Compact)"
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
            <Input
              value={compactId}
              onChange={(e) => setCompactId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={block}
              onChange={(e) => setBlock(e.target.checked)}
            >
              block
            </Checkbox>
            <div className="mb-2">
              <label className="block mb-1">Tamaño</label>
              <Select value={size} onChange={setSize} style={{ width: "100%" }}>
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
            </div>
            <div>
              <label className="block mb-1">Dirección</label>
              <Select
                value={direction}
                onChange={setDirection}
                style={{ width: "100%" }}
              >
                <Option value="horizontal">horizontal</Option>
                <Option value="vertical">vertical</Option>
              </Select>
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
