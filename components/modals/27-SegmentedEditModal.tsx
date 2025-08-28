"use client";

import {
  Modal,
  Input,
  Button,
  Space,
  Divider,
  Collapse,
  Checkbox,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;
const { Option } = Select;

interface SegmentedEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SegmentedEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SegmentedEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [blockId, setBlockId] = useState("");

  // Parsea el código recibido para sacar label, name, options y props
  useEffect(() => {
    if (!codeBlock) return;

    // Label y name dentro de <Form.Item ...>
    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    setLabel(labelMatch ? labelMatch[1] : "");
    setName(nameMatch ? nameMatch[1] : "");

    // Opciones dentro de options={[...]}
    const optionsMatch = codeBlock.match(/options=\{(\[[\s\S]*?\])\}/);
    if (optionsMatch) {
      try {
        // Reemplazamos comillas simples por dobles por si acaso
        const rawOptionsStr = optionsMatch[1].replace(/'/g, '"');
        const parsedOptions = JSON.parse(rawOptionsStr);
        if (Array.isArray(parsedOptions)) {
          setOptions(parsedOptions.map((opt) => String(opt)));
        } else {
          setOptions([]);
        }
      } catch {
        setOptions([]);
      }
    } else {
      setOptions([]);
    }

    // Disabled
    setDisabled(codeBlock.includes("disabled"));

    // Size
    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/);
    setSize(
      sizeMatch && ["small", "middle", "large"].includes(sizeMatch[1])
        ? (sizeMatch[1] as "small" | "middle" | "large")
        : "middle"
    );

    // id (opcional)
    const idMatch = codeBlock.match(/id="([^"]*)"/);
    setBlockId(idMatch ? idMatch[1] : "");
  }, [codeBlock]);

  // Funciones para manipular las opciones
  const addOption = () => setOptions((opts) => [...opts, ""]);
  const removeOption = (index: number) =>
    setOptions((opts) => opts.filter((_, i) => i !== index));
  const updateOption = (index: number, value: string) =>
    setOptions((opts) => opts.map((o, i) => (i === index ? value : o)));

  // Construir código final con Form.Item y Segmented
  const buildCode = () => {
    const props: string[] = [];

    if (disabled) props.push("disabled");
    if (size !== "middle") props.push(`size="${size}"`);
    if (blockId) props.push(`id="${blockId}"`);

    // JSON.stringify con indent 0 para no generar saltos ni espacios
    const optionsStr = JSON.stringify(options);

    return `<Form.Item label="${label}" name="${name}">
  <Segmented options={${optionsStr}} ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Segmented"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <Input
          addonBefore="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiqueta"
        />
        <Input
          addonBefore="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
        />

        <Divider>Opciones</Divider>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((opt, i) => (
            <Space key={i} style={{ marginBottom: 0, width: "100%" }}>
              <Input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Opción #${i + 1}`}
                style={{ flex: 1 }}
              />
              <Button danger onClick={() => removeOption(i)}>
                Eliminar
              </Button>
            </Space>
          ))}
        </div>
        <Button type="dashed" block onClick={addOption}>
          Agregar opción
        </Button>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>
                Tamaño
              </label>
              <Select
                value={size}
                onChange={(val) => setSize(val)}
                style={{ width: "100%" }}
              >
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
            </div>

            <Input
              addonBefore="id"
              value={blockId}
              onChange={(e) => setBlockId(e.target.value)}
              placeholder="id"
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
