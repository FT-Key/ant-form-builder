"use client";

import {
  Modal,
  Input,
  InputNumber,
  Checkbox,
  Collapse,
  Divider,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;
const { Option } = Select;

type TooltipMode = "default" | "always" | "never";

interface SliderEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SliderEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SliderEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [step, setStep] = useState<number | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [dots, setDots] = useState(false);
  const [range, setRange] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [height, setHeight] = useState<number | undefined>(150);
  const [tooltipMode, setTooltipMode] = useState<TooltipMode>("default");
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+\\.?\\d*)}`))?.[1];
    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setInputId(matchAttr("id"));

    setMin(matchNum("min") ? parseFloat(matchNum("min")!) : undefined);
    setMax(matchNum("max") ? parseFloat(matchNum("max")!) : undefined);
    setStep(matchNum("step") ? parseFloat(matchNum("step")!) : undefined);

    setDisabled(codeBlock.includes("disabled"));
    setDots(codeBlock.includes("dots"));
    setRange(codeBlock.includes("range"));
    setVertical(codeBlock.includes("vertical"));

    // tooltip mode detection
    if (antdVersion === "v5") {
      if (codeBlock.includes("tooltip={{ open: true")) {
        setTooltipMode("always");
      } else if (codeBlock.includes("tooltip={{ open: false")) {
        setTooltipMode("never");
      } else {
        setTooltipMode("default");
      }
    } else {
      if (codeBlock.includes("tooltipVisible={true}")) {
        setTooltipMode("always");
      } else if (codeBlock.includes("tooltipVisible={false}")) {
        setTooltipMode("never");
      } else {
        setTooltipMode("default");
      }
    }

    const matchStyleHeight = codeBlock.match(
      /style=\{\{[^}]*height:\s*(\d+)[^}]*\}\}/
    );
    setHeight(matchStyleHeight ? parseInt(matchStyleHeight[1]) : 150);
  }, [codeBlock, antdVersion]);

  const buildCode = () => {
    const props: string[] = [];

    if (min !== undefined) props.push(`min={${min}}`);
    if (max !== undefined) props.push(`max={${max}}`);
    if (step !== undefined) props.push(`step={${step}}`);
    if (disabled) props.push("disabled");
    if (dots) props.push("dots");
    if (range) props.push("range");
    if (vertical) props.push("vertical");
    if (inputId) props.push(`id="${inputId}"`);
    if (vertical && height) props.push(`style={{ height: ${height} }}`);

    // Tooltip mode
    if (antdVersion === "v5") {
      if (tooltipMode === "always") {
        props.push(`tooltip={{ open: true }}`);
      } else if (tooltipMode === "never") {
        props.push(`tooltip={{ open: false }}`);
      }
    } else {
      if (tooltipMode === "always") {
        props.push(`tooltipVisible={true}`);
      } else if (tooltipMode === "never") {
        props.push(`tooltipVisible={false}`);
      }
    }

    return `<Form.Item label="${label}" name="${name}">
  <Slider ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Slider"
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
            <InputNumber
              style={{ width: "100%" }}
              value={min}
              onChange={(val) => setMin(val ?? undefined)}
              placeholder="min"
              addonBefore="min"
              className="mb-2"
            />
            <InputNumber
              style={{ width: "100%" }}
              value={max}
              onChange={(val) => setMax(val ?? undefined)}
              placeholder="max"
              addonBefore="max"
              className="mb-2"
            />
            <InputNumber
              style={{ width: "100%" }}
              value={step}
              onChange={(val) => setStep(val ?? undefined)}
              placeholder="step"
              addonBefore="step"
              className="mb-2"
            />
            {vertical && (
              <InputNumber
                style={{ width: "100%" }}
                value={height}
                onChange={(val) => setHeight(val ?? 150)}
                placeholder="Alto en px"
                addonBefore="height"
                className="mb-2"
              />
            )}
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={dots}
              onChange={(e) => setDots(e.target.checked)}
              className="mb-2"
            >
              dots
            </Checkbox>
            <Checkbox
              checked={range}
              onChange={(e) => setRange(e.target.checked)}
              className="mb-2"
            >
              range
            </Checkbox>
            <Checkbox
              checked={vertical}
              onChange={(e) => setVertical(e.target.checked)}
              className="mb-2"
            >
              vertical
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Visibilidad del tooltip</label>
              <Select
                value={tooltipMode}
                onChange={(val) => setTooltipMode(val)}
                style={{ width: "100%" }}
              >
                <Option value="default">automático (solo al usar)</Option>
                <Option value="always">mostrar siempre</Option>
                <Option value="never">no mostrar nunca</Option>
              </Select>
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
