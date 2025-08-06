"use client";

import { Modal, Input, Collapse, Divider, Button, Space, Checkbox } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface Step {
  title: string;
  description?: string;
  subTitle?: string;
  status?: string;
}

interface StepsEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function StepsEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: StepsEditModalProps) {
  const [label, setLabel] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [progressDot, setProgressDot] = useState(false);
  const [stepsId, setStepsId] = useState("");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]*)"/)?.[1] || "";
    setLabel(labelMatch);
    setStepsId(codeBlock.match(/id="([^"]*)"/)?.[1] || "");
    setCurrent(parseInt(codeBlock.match(/current=\{(\d+)\}/)?.[1] || "0"));
    setDirection(
      codeBlock.includes(`direction="vertical"`) ? "vertical" : "horizontal"
    );
    setProgressDot(codeBlock.includes("progressDot"));

    // Extraer Steps.Step
    const stepRegex = /<Steps\.Step([^>]*)\/>/g;
    const stepsArr: Step[] = [];
    let match;
    while ((match = stepRegex.exec(codeBlock)) !== null) {
      const stepPropsStr = match[1];
      const titleMatch = stepPropsStr.match(/title="([^"]*)"/);
      const subTitleMatch = stepPropsStr.match(/subTitle="([^"]*)"/);
      const descriptionMatch = stepPropsStr.match(/description="([^"]*)"/);

      stepsArr.push({
        title: titleMatch?.[1] || "",
        subTitle: subTitleMatch?.[1],
        description: descriptionMatch?.[1],
      });
    }
    setSteps(stepsArr);
  }, [codeBlock]);

  const updateStep = (index: number, key: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index][key] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { title: "Nuevo paso" }]);
  };

  const removeStep = (index: number) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  const buildCode = () => {
    const props: string[] = [];
    if (stepsId) props.push(`id="${stepsId}"`);
    if (current !== 0) props.push(`current={${current}}`);
    if (direction !== "horizontal") props.push(`direction="${direction}"`);
    if (progressDot) props.push("progressDot");

    // Construir Steps.Step como string para cada paso
    const stepsChildren = steps
      .map(
        (step) =>
          `<Steps.Step${step.title ? ` title="${step.title}"` : ""}${
            step.subTitle ? ` subTitle="${step.subTitle}"` : ""
          }${step.description ? ` description="${step.description}"` : ""} />`
      )
      .join("\n  ");

    return `<Form.Item label="${label}">
  <Steps ${props.join(" ")}>
  ${stepsChildren}
  </Steps>
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Steps"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={700}
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          addonBefore="label"
        />

        <Divider>Opciones</Divider>

        <Space direction="vertical" className="w-full">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border space-y-2">
              <Input
                value={step.title}
                onChange={(e) => updateStep(idx, "title", e.target.value)}
                addonBefore="title"
              />
              <Input
                value={step.subTitle || ""}
                onChange={(e) => updateStep(idx, "subTitle", e.target.value)}
                addonBefore="subTitle"
              />
              <Input
                value={step.description || ""}
                onChange={(e) => updateStep(idx, "description", e.target.value)}
                addonBefore="description"
              />
              <Button danger onClick={() => removeStep(idx)} size="small">
                Eliminar
              </Button>
            </div>
          ))}

          <Button onClick={addStep} type="dashed" block>
            + Agregar paso
          </Button>
        </Space>

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Input
              value={stepsId}
              onChange={(e) => setStepsId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
            <Input
              type="number"
              value={current}
              min={0}
              max={steps.length > 0 ? steps.length : 0}
              onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;
                if (val > (steps.length > 0 ? steps.length : 0))
                  val = steps.length > 0 ? steps.length : 0;
                setCurrent(val);
              }}
              addonBefore="current"
              className="mb-2"
            />
            <Checkbox
              checked={progressDot}
              onChange={(e) => setProgressDot(e.target.checked)}
              className="mb-2"
            >
              progressDot
            </Checkbox>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
