"use client";

import {
  Modal,
  Input,
  Checkbox,
  Select,
  Divider,
  Button,
  Space,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface CheckboxGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface OptionItem {
  label: string;
  value: string;
}

export default function CheckboxGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: CheckboxGroupEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estados
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  // Parseo del código entrante
  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const disabledMatch = /disabled/.test(codeBlock);
    const idMatch = codeBlock.match(/id="([^"]+)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    const optionsMatch = codeBlock.match(/options=\{(\[[^\]]*\])\}/);
    let parsedOptions: OptionItem[] = [];
    if (optionsMatch) {
      try {
        const rawStr = optionsMatch[1];

        // Detecta si es un array de strings
        const isStringArray = /^(\s*'[^']*'\s*,?)*$/.test(
          rawStr.replace(/[\[\]\s]/g, "").replace(/"([^"]*)"/g, "'$1'")
        );

        if (isStringArray) {
          const strArray = JSON.parse(rawStr.replace(/'/g, '"')) as string[];
          parsedOptions = strArray.map((val) => ({ label: val, value: val }));
        } else {
          // Asumimos que es un array de objetos
          const jsonStr = rawStr
            .replace(/([a-zA-Z0-9]+):/g, '"$1":')
            .replace(/'/g, '"');
          parsedOptions = JSON.parse(jsonStr);
        }
      } catch {
        parsedOptions = [];
      }
    }

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setDisabled(disabledMatch);
    setInputId(idMatch?.[1] || "");
    setStatus(
      statusMatch?.[1] === "error" || statusMatch?.[1] === "warning"
        ? statusMatch[1]
        : ""
    );
    setOptions(parsedOptions);
  }, [codeBlock]);

  // CRUD de opciones
  const updateOption = (
    index: number,
    field: keyof OptionItem,
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Generar JSX
  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (disabled) props.push("disabled");
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    const optionsString = `[${options
      .map(
        (opt) =>
          `{ label: '${opt.label.replace(
            /'/g,
            "\\'"
          )}', value: '${opt.value.replace(/'/g, "\\'")}' }`
      )
      .join(", ")}]`;

    props.push(`options={${optionsString}}`);

    return `<Form.Item label="${label}" name="${name}">
  <Checkbox.Group ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Checkbox Group"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
      destroyOnClose
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
        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Opciones</label>
              {options.map((opt, idx) => (
                <Space key={idx} align="baseline" className="mb-2">
                  <Input
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => updateOption(idx, "label", e.target.value)}
                    style={{ width: 180 }}
                  />
                  <Input
                    placeholder="Value"
                    value={opt.value}
                    onChange={(e) => updateOption(idx, "value", e.target.value)}
                    style={{ width: 180 }}
                  />
                  <Button danger onClick={() => removeOption(idx)}>
                    Eliminar
                  </Button>
                </Space>
              ))}
              <Button type="dashed" block onClick={addOption}>
                + Agregar opción
              </Button>
            </div>

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
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
                  allowClear
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
