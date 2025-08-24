// SubmitEditModal.tsx
"use client";

import {
  Modal,
  Input,
  Select,
  Checkbox,
  Collapse,
  Divider,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useInputValidation } from "@/hooks/useInputValidation";

const { Panel } = Collapse;
const { Option } = Select;
const { Text } = Typography;

interface SubmitEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SubmitEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SubmitEditModalProps) {
  const [formItemName, setFormItemName] = useState("");
  const [label, setLabel] = useState("Enviar");
  const [type, setType] = useState<
    "default" | "primary" | "dashed" | "text" | "link"
  >("primary");
  const [block, setBlock] = useState(false);
  const [danger, setDanger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [inputId, setInputId] = useState("");

  const [activePanels, setActivePanels] = useState<string[]>([]);

  // Parsear atributos del codeBlock al abrir el modal
  useEffect(() => {
    const getAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const getBool = (attr: string) => codeBlock.includes(`${attr}`);

    setFormItemName(getAttr("name"));
    setLabel(
      codeBlock.match(/<Button[^>]*>([^<]+)<\/Button>/)?.[1] || "Enviar"
    );
    setInputId(getAttr("id"));

    const typeMatch = getAttr("type");
    setType(
      ["primary", "dashed", "text", "link"].includes(typeMatch)
        ? (typeMatch as any)
        : "default"
    );

    const sizeMatch = getAttr("size");
    setSize(
      ["small", "large"].includes(sizeMatch) ? (sizeMatch as any) : "middle"
    );

    setBlock(getBool("block"));
    setDanger(getBool("danger"));
    setLoading(getBool("loading"));
    setDisabled(getBool("disabled"));
  }, [codeBlock]);

  // Hook de validación
  const { errors, validateAndSave: hookValidateAndSave } = useInputValidation({
    label,
    name: formItemName,
    type,
    block,
    danger,
    loading,
    disabled,
    size,
    id: inputId,
    onSave,
    buildCode: () => {
      const props = [`htmlType="submit"`];
      if (type !== "default") props.push(`type="${type}"`);
      if (size !== "middle") props.push(`size="${size}"`);
      if (block) props.push("block");
      if (danger) props.push("danger");
      if (loading) props.push("loading");
      if (disabled) props.push("disabled");
      if (inputId) props.push(`id="${inputId}"`);

      return `<Form.Item name="${formItemName}"><Button ${props.join(
        " "
      )}>${label}</Button></Form.Item>`;
    },
  });

  // Abrir panel automáticamente si hay errores
  useEffect(() => {
    const advancedErrors = ["errorId", "errorButtonType", "errorButtonSize"];
    const basicErrors = ["errorButtonLabel"];
    const newActivePanels: string[] = [];

    if (advancedErrors.some((key) => errors[key])) newActivePanels.push("1"); // panel avanzado
    if (basicErrors.some((key) => errors[key])) newActivePanels.push("0"); // panel básico si existiera

    setActivePanels(newActivePanels);
  }, [errors]);

  return (
    <Modal
      open={open}
      title="Editar Botón de Envío"
      onCancel={onCancel}
      onOk={hookValidateAndSave}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <div>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            addonBefore="Texto del botón"
            status={errors.errorButtonLabel ? "error" : undefined}
          />
          {errors.errorButtonLabel && (
            <Text type="danger">{errors.errorButtonLabel}</Text>
          )}
        </div>

        <Divider />

        <Collapse
          ghost
          activeKey={activePanels}
          onChange={(keys) => setActivePanels(keys as string[])}
        >
          <Panel header="Opciones avanzadas" key="1">
            <div>
              <Input
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                addonBefore="id"
                className="mb-2"
                status={errors.errorId ? "error" : undefined}
              />
              {errors.errorId && <Text type="danger">{errors.errorId}</Text>}
            </div>

            <Checkbox
              checked={block}
              onChange={(e) => setBlock(e.target.checked)}
            >
              block
            </Checkbox>
            <Checkbox
              checked={danger}
              onChange={(e) => setDanger(e.target.checked)}
            >
              danger
            </Checkbox>
            <Checkbox
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
            >
              loading
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            >
              disabled
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Tipo</label>
              <Select value={type} onChange={setType} style={{ width: "100%" }}>
                <Option value="default">default</Option>
                <Option value="primary">primary</Option>
                <Option value="dashed">dashed</Option>
                <Option value="text">text</Option>
                <Option value="link">link</Option>
              </Select>
              {errors.errorButtonType && (
                <Text type="danger">{errors.errorButtonType}</Text>
              )}
            </div>

            <div>
              <label className="block mb-1">Tamaño</label>
              <Select value={size} onChange={setSize} style={{ width: "100%" }}>
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
              {errors.errorButtonSize && (
                <Text type="danger">{errors.errorButtonSize}</Text>
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
