"use client";

import {
  Modal,
  Input,
  Checkbox,
  Select,
  DatePicker,
  Divider,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface DatePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function DatePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: DatePickerEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [allowClear, setAllowClear] = useState(true);
  const [showTime, setShowTime] = useState(false);
  const [format, setFormat] = useState("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] || "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setFormat(matchAttr("format"));
    setInputId(matchAttr("id"));

    setDisabled(matchBool("disabled"));
    setAllowClear(!/allowClear=\{false\}/.test(codeBlock));
    setShowTime(matchBool("showTime"));

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (!allowClear) props.push(`allowClear={false}`);
    if (disabled) props.push("disabled");
    if (showTime) props.push("showTime");
    if (format) props.push(`format="${format}"`);
    if (inputId) props.push(`id="${inputId}"`);
    if (size && size !== "middle") props.push(`size="${size}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}" name="${name}">
  <DatePicker ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar DatePicker"
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

        <Divider>Opciones</Divider>

        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <Checkbox
          checked={allowClear}
          onChange={(e) => setAllowClear(e.target.checked)}
        >
          allowClear
        </Checkbox>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              className="mb-2"
            >
              showTime
            </Checkbox>

            <Input
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              addonBefore="format"
              placeholder="Ej: YYYY-MM-DD"
              className="mb-2"
            />

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
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
