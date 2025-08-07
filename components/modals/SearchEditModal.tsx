"use client";

import { Modal, Input, Checkbox, Select, Collapse, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;
const { Option } = Select;

interface SearchEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SearchEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SearchEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [enterButton, setEnterButton] = useState(false);
  const [allowClear, setAllowClear] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const getAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const getBool = (attr: string) => codeBlock.includes(`${attr}`);

    setLabel(getAttr("label"));
    setName(getAttr("name"));
    setPlaceholder(getAttr("placeholder"));
    setInputId(getAttr("id"));

    setEnterButton(getBool("enterButton"));
    setAllowClear(getBool("allowClear"));
    setDisabled(getBool("disabled"));
    setLoading(getBool("loading"));

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];
    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (enterButton) props.push("enterButton");
    if (allowClear) props.push("allowClear");
    if (disabled) props.push("disabled");
    if (loading) props.push("loading");
    if (size !== "middle") props.push(`size="${size}"`);
    if (inputId) props.push(`id="${inputId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <Input.Search ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Input.Search"
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
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={enterButton}
              onChange={(e) => setEnterButton(e.target.checked)}
            >
              enterButton
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
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
            >
              loading
            </Checkbox>
            <div className="mb-2">
              <label className="block mb-1">Tamaño</label>
              <Select value={size} onChange={setSize} style={{ width: "100%" }}>
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
