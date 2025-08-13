"use client";

import {
  Modal,
  Input,
  Collapse,
  Divider,
  Button,
  Space,
  Checkbox,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface AutoCompleteEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface AutoCompleteOption {
  value: string;
}

export default function AutoCompleteEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: AutoCompleteEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [autoFocus, setAutoFocus] = useState(false);
  const [allowClear, setAllowClear] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const isPresent = (attr: string) => codeBlock.includes(`${attr}`);
    const matchOptions = codeBlock.match(/options=\{(\[[\s\S]*?\])\}/);
    let parsedOptions: AutoCompleteOption[] = [];
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
    setAllowClear(isPresent("allowClear"));
    setDisabled(isPresent("disabled"));
    setReadOnly(isPresent("readOnly"));

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );
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
    if (allowClear) props.push("allowClear");
    if (disabled) props.push("disabled");
    if (readOnly) props.push("readOnly");
    if (inputId) props.push(`id=\"${inputId}\"`);
    if (antdVersion !== "v3" && status) props.push(`status=\"${status}\"`);
    const optionsStr = JSON.stringify(options);
    return `<Form.Item label=\"${label}\" name=\"${name}\">\n  <AutoComplete ${props.join(
      " "
    )} options={${optionsStr}} />\n</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar AutoComplete"
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
        <Panel header="Opciones" key="1">
          {options.map((opt, i) => (
            <Space key={i} className="mb-2">
              <Input
                value={opt.value}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder="valor"
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
            checked={allowClear}
            onChange={(e) => setAllowClear(e.target.checked)}
            className="mb-2"
          >
            allowClear
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
          {antdVersion !== "v3" && (
            <div className="mb-2">
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
    </Modal>
  );
}
