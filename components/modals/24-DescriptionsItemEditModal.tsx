"use client";

import { Modal, Input, Select, Collapse, Divider, Checkbox } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;
const { Option } = Select;

interface DescriptionsItemEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function DescriptionsItemEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: DescriptionsItemEditModalProps) {
  const [label, setLabel] = useState("");
  const [span, setSpan] = useState<number | undefined>();
  const [labelStyle, setLabelStyle] = useState("");
  const [contentStyle, setContentStyle] = useState("");
  const [itemId, setItemId] = useState("");
  const [labelAlign, setLabelAlign] = useState<"left" | "right">("left");
  const [content, setContent] = useState("");

  useEffect(() => {
    const getAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";

    const getNum = (attr: string) => {
      const val = codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];
      return val ? parseInt(val, 10) : undefined;
    };

    setLabel(getAttr("label"));
    setItemId(getAttr("id"));
    setLabelStyle(getAttr("labelStyle"));
    setContentStyle(getAttr("contentStyle"));
    setLabelAlign(getAttr("labelAlign") === "right" ? "right" : "left");
    setSpan(getNum("span"));
    setContent(codeBlock.match(/>([^<]+)<\/Descriptions\.Item>/)?.[1] || "");
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [`label="${label}"`];
    if (span) props.push(`span={${span}}`);
    if (labelAlign !== "left") props.push(`labelAlign="${labelAlign}"`);
    if (labelStyle) props.push(`labelStyle="${labelStyle}"`);
    if (contentStyle) props.push(`contentStyle="${contentStyle}"`);
    if (itemId) props.push(`id="${itemId}"`);

    return `<Descriptions.Item ${props.join(" ")}>
  ${content}
</Descriptions.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Descriptions.Item"
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          addonBefore="contenido"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Input
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Input
              value={labelStyle}
              onChange={(e) => setLabelStyle(e.target.value)}
              addonBefore="labelStyle"
              placeholder='Ej: {{ fontWeight: "bold" }}'
              className="mb-2"
            />
            <Input
              value={contentStyle}
              onChange={(e) => setContentStyle(e.target.value)}
              addonBefore="contentStyle"
              placeholder='Ej: {{ color: "gray" }}'
              className="mb-2"
            />
            <Input
              value={span}
              onChange={(e) => setSpan(Number(e.target.value) || undefined)}
              type="number"
              addonBefore="span"
              className="mb-2"
            />
            <div>
              <label className="block mb-1">Alineación de label</label>
              <Select
                value={labelAlign}
                onChange={setLabelAlign}
                style={{ width: "100%" }}
              >
                <Option value="left">left</Option>
                <Option value="right">right</Option>
              </Select>
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
