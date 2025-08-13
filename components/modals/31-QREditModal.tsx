"use client";

import { Modal, Input, Checkbox, Divider, Collapse, Select } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface QREditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function QREditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: QREditModalProps) {
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [icon, setIcon] = useState("");
  const [size, setSize] = useState<number | undefined>(undefined);
  const [color, setColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [bordered, setBordered] = useState(true);
  const [blockId, setBlockId] = useState("");

  useEffect(() => {
    if (!codeBlock) return;

    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const valueMatch = codeBlock.match(/value="([^"]*)"/);
    const errorLevelMatch = codeBlock.match(/errorLevel="(L|M|Q|H)"/);
    const iconMatch = codeBlock.match(/icon="([^"]*)"/);
    const sizeMatch = codeBlock.match(/size=\{(\d+)\}/);
    const colorMatch = codeBlock.match(/color="([^"]*)"/);
    const bgColorMatch = codeBlock.match(/bgColor="([^"]*)"/);
    const borderedMatch = codeBlock.includes("bordered={false}");
    const idMatch = codeBlock.match(/id="([^"]*)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setValue(valueMatch?.[1] || "");
    setErrorLevel(
      errorLevelMatch ? (errorLevelMatch[1] as "L" | "M" | "Q" | "H") : "M"
    );
    setIcon(iconMatch?.[1] || "");
    setSize(sizeMatch ? Number(sizeMatch[1]) : undefined);
    setColor(colorMatch?.[1] || "");
    setBgColor(bgColorMatch?.[1] || "");
    setBordered(!borderedMatch);
    setBlockId(idMatch?.[1] || "");
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [`value="${value}"`];
    if (errorLevel !== "M") props.push(`errorLevel="${errorLevel}"`);
    if (icon) props.push(`icon="${icon}"`);
    if (size) props.push(`size={${size}}`);
    if (color) props.push(`color="${color}"`);
    if (bgColor) props.push(`bgColor="${bgColor}"`);
    if (!bordered) props.push(`bordered={false}`);
    if (blockId) props.push(`id="${blockId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <QRCode ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar QRCode"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <Input
          addonBefore="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Input
          addonBefore="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          addonBefore="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <div className="space-y-4">
              <label style={{ display: "block", marginBottom: 4 }}>
                errorLevel
              </label>
              <Select
                value={errorLevel}
                onChange={(val) => setErrorLevel(val as "L" | "M" | "Q" | "H")}
                options={[
                  { label: "L (Bajo)", value: "L" },
                  { label: "M (Medio)", value: "M" },
                  { label: "Q (Cuasi alto)", value: "Q" },
                  { label: "H (Alto)", value: "H" },
                ]}
                style={{ width: "100%" }}
              />
              <Input
                addonBefore="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
              <Input
                addonBefore="size"
                type="number"
                value={size ?? ""}
                onChange={(e) =>
                  setSize(e.target.value ? Number(e.target.value) : undefined)
                }
              />
              <Input
                addonBefore="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <Input
                addonBefore="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <Checkbox
                checked={bordered}
                onChange={(e) => setBordered(e.target.checked)}
              >
                bordered
              </Checkbox>
              <Input
                addonBefore="id"
                value={blockId}
                onChange={(e) => setBlockId(e.target.value)}
              />
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
