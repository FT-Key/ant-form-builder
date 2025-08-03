"use client";

import {
  Modal,
  Input,
  Checkbox,
  Select,
  Button,
  Collapse,
  Divider,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

interface SelectEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface OptionItem {
  label: string;
  value: string;
}

export default function SelectEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SelectEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [mode, setMode] = useState<"" | "multiple" | "tags">("");

  const [options, setOptions] = useState<OptionItem[]>([]);

  // Advanced options
  const [allowClear, setAllowClear] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [inputId, setInputId] = useState("");
  const [optionFilterProp, setOptionFilterProp] = useState("");
  const [filterOption, setFilterOption] = useState(true);
  const [maxTagCount, setMaxTagCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] || "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);
    const matchNumber = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));
    setOptionFilterProp(matchAttr("optionFilterProp"));
    setFilterOption(!/filterOption=\{false\}/.test(codeBlock));
    setMaxTagCount(
      matchNumber("maxTagCount")
        ? parseInt(matchNumber("maxTagCount")!)
        : undefined
    );

    if (/mode="multiple"/.test(codeBlock)) setMode("multiple");
    else if (/mode="tags"/.test(codeBlock)) setMode("tags");
    else setMode("");

    setAllowClear(matchBool("allowClear"));
    setDisabled(matchBool("disabled"));
    setShowSearch(matchBool("showSearch"));
    setAutoFocus(matchBool("autoFocus"));
    setLoading(matchBool("loading"));

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );

    const optionMatches = [
      ...codeBlock.matchAll(/<Option value="([^"]+)">([^<]+)<\/Option>/g),
    ];
    const parsedOptions = optionMatches.map((m) => ({
      value: m[1],
      label: m[2],
    }));
    setOptions(
      parsedOptions.length ? parsedOptions : [{ label: "Opción 1", value: "1" }]
    );
  }, [codeBlock]);

  const handleAddOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  const handleOptionChange = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    const updated = [...options];
    updated[index][key] = value;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (mode) props.push(`mode="${mode}"`);
    if (allowClear) props.push("allowClear");
    if (disabled) props.push("disabled");
    if (showSearch) props.push("showSearch");
    if (!filterOption) props.push("filterOption={false}");
    if (autoFocus) props.push("autoFocus");
    if (loading) props.push("loading");
    if (inputId) props.push(`id="${inputId}"`);
    if (optionFilterProp) props.push(`optionFilterProp="${optionFilterProp}"`);
    if (maxTagCount !== undefined) props.push(`maxTagCount={${maxTagCount}}`);
    if (size && size !== "middle") props.push(`size="${size}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    const optionsCode = options
      .filter((opt) => opt.label && opt.value)
      .map((opt) => `    <Option value="${opt.value}">${opt.label}</Option>`)
      .join("\n");

    return `<Form.Item label="${label}" name="${name}">
  <Select ${props.join(" ")}>
${optionsCode}
  </Select>
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Select"
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

        <div>
          <label className="block mb-1">Modo</label>
          <Select
            value={mode}
            onChange={(value) => setMode(value)}
            style={{ width: "100%" }}
          >
            <Option value="">default</Option>
            <Option value="multiple">multiple</Option>
            <Option value="tags">tags</Option>
          </Select>
        </div>

        <Divider>Opciones</Divider>
        <Space direction="vertical" className="w-full">
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                placeholder="Label"
                value={opt.label}
                onChange={(e) =>
                  handleOptionChange(idx, "label", e.target.value)
                }
              />
              <Input
                placeholder="Value"
                value={opt.value}
                onChange={(e) =>
                  handleOptionChange(idx, "value", e.target.value)
                }
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveOption(idx)}
              />
            </div>
          ))}
          <Button icon={<PlusOutlined />} onClick={handleAddOption}>
            Agregar opción
          </Button>
        </Space>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
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
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
              className="mb-2"
            >
              showSearch
            </Checkbox>
            <Checkbox
              checked={!filterOption}
              onChange={(e) => setFilterOption(!e.target.checked)}
              className="mb-2"
            >
              desactivar filterOption
            </Checkbox>
            <Checkbox
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
              className="mb-2"
            >
              autoFocus
            </Checkbox>
            <Checkbox
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="mb-2"
            >
              loading
            </Checkbox>
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Input
              value={optionFilterProp}
              onChange={(e) => setOptionFilterProp(e.target.value)}
              addonBefore="optionFilterProp"
              className="mb-2"
            />
            <Input
              type="number"
              value={maxTagCount}
              onChange={(e) =>
                setMaxTagCount(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              addonBefore="maxTagCount"
              className="mb-2"
            />

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
