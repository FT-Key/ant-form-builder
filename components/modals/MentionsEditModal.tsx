"use client";

import { Modal, Input, Collapse, Divider, Button, Space, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;

interface MentionsEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface MentionOption {
  value: string;
}

export default function MentionsEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: MentionsEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [autoFocus, setAutoFocus] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [inputId, setInputId] = useState("");
  const [options, setOptions] = useState<MentionOption[]>([]);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const isPresent = (attr: string) => codeBlock.includes(`${attr}`);
    const matchOptions = codeBlock.match(/options=\{(\[[\s\S]*?\])\}/);
    let parsedOptions: MentionOption[] = [];
    if (matchOptions?.[1]) {
      try {
        parsedOptions = JSON.parse(matchOptions[1].replace(/'/g, '"'));
      } catch {}
    }
    setOptions(parsedOptions);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));
    setAutoFocus(isPresent("autoFocus"));
    setDisabled(isPresent("disabled"));
    setReadOnly(isPresent("readOnly"));
  }, [codeBlock]);

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index].value = value;
    setOptions(updated);
  };

  const buildCode = () => {
    const props: string[] = [];
    if (placeholder) props.push(`placeholder=\"${placeholder}\"`);
    if (autoFocus) props.push("autoFocus");
    if (disabled) props.push("disabled");
    if (readOnly) props.push("readOnly");
    if (inputId) props.push(`id=\"${inputId}\"`);
    const optionsStr = JSON.stringify(options);
    return `<Form.Item label=\"${label}\" name=\"${name}\">\n  <Mentions ${props.join(
      " "
    )} options={${optionsStr}} />\n</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Mentions"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
    >
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
        <Panel header="Opciones (@usuario)" key="1">
          {options.map((opt, i) => (
            <Space key={i} className="mb-2">
              <Input
                value={opt.value}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder="@nombre"
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => setOptions(options.filter((_, j) => j !== i))}
                danger
              />
            </Space>
          ))}
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOptions([...options, { value: "" }])}
            block
            type="dashed"
          >
            Agregar opción
          </Button>
        </Panel>
        <Panel header="Opciones avanzadas" key="2">
          <Checkbox
            checked={autoFocus}
            onChange={(e) => setAutoFocus(e.target.checked)}
            className="mb-2"
          >
            autoFocus
          </Checkbox>
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
          <Input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            addonBefore="id"
            className="mb-2"
          />
        </Panel>
      </Collapse>
    </Modal>
  );
}
