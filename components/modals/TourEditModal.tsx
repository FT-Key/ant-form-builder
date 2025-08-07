"use client";

import { Modal, Input, Checkbox, Collapse, Divider, Button, Space } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface Step {
  title: string;
  description: string;
}

interface TourEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function TourEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TourEditModalProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [mask, setMask] = useState(true);
  const [arrow, setArrow] = useState(true);
  const [scrollIntoView, setScrollIntoView] = useState(true);

  useEffect(() => {
    try {
      const matchSteps = codeBlock.match(/steps=\{([\s\S]+?)\}/)?.[1];
      if (matchSteps) {
        const stepsParsed = eval(`(${matchSteps})`);
        if (Array.isArray(stepsParsed)) setSteps(stepsParsed);
      }
    } catch {}
    setMask(!codeBlock.includes("mask={false}"));
    setArrow(!codeBlock.includes("arrow={false}"));
    setScrollIntoView(!codeBlock.includes("scrollIntoView={false}"));
  }, [codeBlock]);

  const handleStepChange = (index: number, key: keyof Step, value: string) => {
    const newSteps = [...steps];
    newSteps[index][key] = value;
    setSteps(newSteps);
  };

  const addStep = () => setSteps([...steps, { title: "", description: "" }]);
  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  const buildCode = () => {
    const stepCode = JSON.stringify(steps, null, 2);
    const props = [
      `steps={${stepCode}}`,
      !mask && "mask={false}",
      !arrow && "arrow={false}",
      !scrollIntoView && "scrollIntoView={false}",
    ]
      .filter(Boolean)
      .join(" ");

    return `<Tour ${props} />`;
  };

  return (
    <Modal
      open={open}
      title="Editar Tour"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Opciones</Divider>
        {steps.map((step, index) => (
          <div key={index} className="border p-2 rounded-md">
            <Input
              addonBefore={`Título ${index + 1}`}
              value={step.title}
              onChange={(e) => handleStepChange(index, "title", e.target.value)}
              className="mb-2"
            />
            <Input
              addonBefore="Descripción"
              value={step.description}
              onChange={(e) =>
                handleStepChange(index, "description", e.target.value)
              }
            />
            <Button danger onClick={() => removeStep(index)} className="mt-2">
              Eliminar paso
            </Button>
          </div>
        ))}
        <Button onClick={addStep}>Agregar paso</Button>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={mask}
              onChange={(e) => setMask(e.target.checked)}
              className="mb-2"
            >
              mask
            </Checkbox>
            <Checkbox
              checked={arrow}
              onChange={(e) => setArrow(e.target.checked)}
              className="mb-2"
            >
              arrow
            </Checkbox>
            <Checkbox
              checked={scrollIntoView}
              onChange={(e) => setScrollIntoView(e.target.checked)}
              className="mb-2"
            >
              scrollIntoView
            </Checkbox>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
