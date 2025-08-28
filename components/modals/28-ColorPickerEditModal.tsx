"use client";

import { Modal, Input, Checkbox, Collapse, Divider, Select } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;
const { Panel } = Collapse;

interface ColorPickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function ColorPickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: ColorPickerEditModalProps) {
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [showText, setShowText] = useState(false);
  const [format, setFormat] = useState<"hex" | "rgb" | "hsb">("hex");
  const [allowClear, setAllowClear] = useState(false);
  const [pickerId, setPickerId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPickerId(matchAttr("id"));

    if (codeBlock.includes("showText")) setShowText(true);
    if (codeBlock.includes("allowClear")) setAllowClear(true);

    const formatMatch = codeBlock.match(/format="(hex|rgb|hsb)"/)?.[1];
    setFormat(
      formatMatch === "rgb" || formatMatch === "hsb" ? formatMatch : "hex"
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];
    if (showText) props.push("showText");
    if (allowClear) props.push("allowClear");
    if (format !== "hex") props.push(`format="${format}"`);
    if (pickerId) props.push(`id="${pickerId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <ColorPicker ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar ColorPicker"
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
            <Checkbox
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="mb-2"
            >
              showText
            </Checkbox>
            <Checkbox
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
              className="mb-2"
            >
              allowClear
            </Checkbox>
            <div className="mb-2">
              <label className="block mb-1">Formato</label>
              <Select
                value={format}
                onChange={setFormat}
                style={{ width: "100%" }}
              >
                <Option value="hex">hex</Option>
                <Option value="rgb">rgb</Option>
                <Option value="hsb">hsb</Option>
              </Select>
            </div>
            <Input
              value={pickerId}
              onChange={(e) => setPickerId(e.target.value)}
              addonBefore="id"
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
