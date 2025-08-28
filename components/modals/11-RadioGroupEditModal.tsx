"use client";

import {
  Modal,
  Input,
  Radio,
  Select,
  Divider,
  Button,
  Space,
  Checkbox,
  Collapse,
} from "antd";

import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface RadioGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface OptionItem {
  label: string;
  value: string;
}

export default function RadioGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: RadioGroupEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estados
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");
  const [optionType, setOptionType] = useState<"default" | "button">("default");
  const [buttonStyle, setButtonStyle] = useState<"outline" | "solid">(
    "outline"
  );
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [disabledOption, setDisabledOption] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const isTrue = (attr: string) => codeBlock.includes(attr);

    const optionTypeMatch = codeBlock.match(/optionType="(default|button)"/);
    const buttonStyleMatch = codeBlock.match(/buttonStyle="(outline|solid)"/);
    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/);

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setInputId(matchAttr("id"));
    setDisabled(isTrue("disabled"));
    setDisabledOption(isTrue("disabledOption"));
    setReadOnly(isTrue("readOnly"));
    setAutoFocus(isTrue("autoFocus"));

    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
    );

    const toOptionType = (val: string | undefined): "default" | "button" =>
      val === "button" ? "button" : "default";

    const toButtonStyle = (val: string | undefined): "outline" | "solid" =>
      val === "solid" ? "solid" : "outline";

    const toSize = (val: string | undefined): "small" | "middle" | "large" =>
      val === "small" || val === "large" ? val : "middle";

    setOptionType(toOptionType(optionTypeMatch?.[1]));
    setButtonStyle(toButtonStyle(buttonStyleMatch?.[1]));
    setSize(toSize(sizeMatch?.[1]));

    // Parsear opciones
    const optionsMatch = codeBlock.match(/options=\{(\[[^\]]*\])\}/);
    let parsedOptions: OptionItem[] = [];
    if (optionsMatch) {
      try {
        const jsonStr = optionsMatch[1]
          .replace(/([a-zA-Z0-9]+):/g, '"$1":')
          .replace(/'/g, '"');
        parsedOptions = JSON.parse(jsonStr);
      } catch {
        parsedOptions = [];
      }
    }
    setOptions(parsedOptions);
  }, [codeBlock]);

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

  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (disabled) props.push("disabled");
    if (disabledOption) props.push("disabledOption");
    if (readOnly) props.push("readOnly");
    if (autoFocus) props.push("autoFocus");
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);
    if (optionType !== "default") props.push(`optionType="${optionType}"`);
    if (optionType === "button" && buttonStyle !== "outline")
      props.push(`buttonStyle="${buttonStyle}"`);
    if (optionType === "button" && size !== "middle")
      props.push(`size="${size}"`);

    const optionsString = options.length
      ? `[${options
          .map(
            (opt) =>
              `{ label: '${opt.label.replace(
                /'/g,
                "\\'"
              )}', value: '${opt.value.replace(/'/g, "\\'")}' }`
          )
          .join(", ")}]`
      : "[]";

    props.push(`options={${optionsString}}`);

    return `<Form.Item label="${label}">
  <Radio.Group ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Radio Group"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
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
          className="mb-2"
        >
          disabled
        </Checkbox>

        <Divider />

        <Divider>Opciones</Divider>

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

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={disabledOption}
              onChange={(e) => setDisabledOption(e.target.checked)}
              className="mb-2"
            >
              disabledOption
            </Checkbox>
            <Checkbox
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
              className="mb-2"
            >
              readOnly
            </Checkbox>
            <Checkbox
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
              className="mb-2"
            >
              autoFocus
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Tipo de opción</label>
              <Select
                value={optionType}
                onChange={(value) =>
                  setOptionType(value as "default" | "button")
                }
                style={{ width: "100%" }}
              >
                <Option value="default">default</Option>
                <Option value="button">button</Option>
              </Select>
            </div>

            {optionType === "button" && (
              <>
                <div className="mb-2">
                  <label className="block mb-1">Estilo del botón</label>
                  <Select
                    value={buttonStyle}
                    onChange={(value) =>
                      setButtonStyle(value as "outline" | "solid")
                    }
                    style={{ width: "100%" }}
                  >
                    <Option value="outline">outline</Option>
                    <Option value="solid">solid</Option>
                  </Select>
                </div>

                <div className="mb-2">
                  <label className="block mb-1">Tamaño</label>
                  <Select
                    value={size}
                    onChange={(value) =>
                      setSize(value as "small" | "middle" | "large")
                    }
                    style={{ width: "100%" }}
                  >
                    <Option value="small">small</Option>
                    <Option value="middle">middle</Option>
                    <Option value="large">large</Option>
                  </Select>
                </div>
              </>
            )}

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
