"use client";

import { Modal, Input, Checkbox, Select, Collapse, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface RangePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function RangePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: RangePickerEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [picker, setPicker] = useState<
    "date" | "week" | "month" | "quarter" | "year"
  >("date");
  const [showTime, setShowTime] = useState(false);
  const [format, setFormat] = useState("");
  const [allowClear, setAllowClear] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const isPresent = (attr: string) =>
      codeBlock.includes(`${attr}`) && !codeBlock.includes(`${attr}={false}`);
    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));
    setFormat(matchAttr("format"));
    setPicker(
      ["date", "week", "month", "quarter", "year"].includes(matchAttr("picker"))
        ? (matchAttr("picker") as any)
        : "date"
    );
    setShowTime(isPresent("showTime"));
    setAllowClear(!isFalse("allowClear"));
    setDisabled(isPresent("disabled"));
    setAutoFocus(isPresent("autoFocus"));

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (picker && picker !== "date") props.push(`picker="${picker}"`);
    if (showTime) props.push("showTime");
    if (format) props.push(`format="${format}"`);
    if (!allowClear) props.push("allowClear={false}");
    if (disabled) props.push("disabled");
    if (autoFocus) props.push("autoFocus");
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}" name="${name}">
  <DatePicker.RangePicker ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar RangePicker"
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
        <Select
          value={picker}
          onChange={(value) => setPicker(value)}
          style={{ width: "100%" }}
        >
          <Option value="date">date</Option>
          <Option value="week">week</Option>
          <Option value="month">month</Option>
          <Option value="quarter">quarter</Option>
          <Option value="year">year</Option>
        </Select>

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              className="mb-2"
            >
              showTime
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
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
              className="mb-2"
            >
              autoFocus
            </Checkbox>

            <Input
              className="mb-2"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="Formato de fecha (ej: YYYY-MM-DD)"
              addonBefore="format"
            />

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="id"
              addonBefore="id"
              className="mb-2"
            />

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
