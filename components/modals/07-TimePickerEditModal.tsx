"use client";

import {
  Modal,
  Input,
  Checkbox,
  Select,
  InputNumber,
  Collapse,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface TimePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function TimePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TimePickerEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [use12Hours, setUse12Hours] = useState(false);
  const [format, setFormat] = useState("");
  const [minuteStep, setMinuteStep] = useState<number | undefined>();
  const [secondStep, setSecondStep] = useState<number | undefined>();
  const [allowClear, setAllowClear] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];
    const isPresent = (attr: string) =>
      codeBlock.includes(`${attr}`) && !codeBlock.includes(`${attr}={false}`);
    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setFormat(matchAttr("format"));
    setInputId(matchAttr("id"));
    setUse12Hours(isPresent("use12Hours"));
    setAllowClear(!isFalse("allowClear"));
    setDisabled(isPresent("disabled"));
    setAutoFocus(isPresent("autoFocus"));
    setMinuteStep(
      matchNum("minuteStep") ? parseInt(matchNum("minuteStep")!) : undefined
    );
    setSecondStep(
      matchNum("secondStep") ? parseInt(matchNum("secondStep")!) : undefined
    );

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (use12Hours) props.push("use12Hours");
    if (format) props.push(`format="${format}"`);
    if (minuteStep !== undefined) props.push(`minuteStep={${minuteStep}}`);
    if (secondStep !== undefined) props.push(`secondStep={${secondStep}}`);
    if (!allowClear) props.push("allowClear={false}");
    if (disabled) props.push("disabled");
    if (autoFocus) props.push("autoFocus");
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}" name="${name}">
  <TimePicker ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar TimePicker"
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
        <Input
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          addonBefore="format"
          placeholder="Ej: HH:mm:ss"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <InputNumber
              className="mb-2"
              style={{ width: "100%" }}
              value={minuteStep}
              onChange={(val) => setMinuteStep(val ?? undefined)}
              placeholder="Paso entre minutos"
              addonBefore="minuteStep"
            />
            <InputNumber
              className="mb-2"
              style={{ width: "100%" }}
              value={secondStep}
              onChange={(val) => setSecondStep(val ?? undefined)}
              placeholder="Paso entre segundos"
              addonBefore="secondStep"
            />

            <Checkbox
              checked={use12Hours}
              onChange={(e) => setUse12Hours(e.target.checked)}
              className="mb-2"
            >
              use12Hours
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
