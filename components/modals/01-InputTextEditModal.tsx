"use client";

import { Modal, Input, Checkbox, Select, Divider, Collapse } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";

const { Option } = Select;
const { Panel } = Collapse;

interface InputTextEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputTextEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputTextEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [minLength, setMinLength] = useState<number | undefined>(undefined);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [allowClear, setAllowClear] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [status, setStatus] = useState<"error" | "warning" | "">("");
  const [size, setSize] = useState<"large" | "middle" | "small">("middle");
  const [addonBefore, setAddonBefore] = useState("");
  const [addonAfter, setAddonAfter] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const maxLengthMatch = codeBlock.match(/maxLength={(\d+)}/);
    const minLengthMatch = codeBlock.match(/minLength={(\d+)}/);
    const sizeMatch = codeBlock.match(/size="(large|middle|small)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);
    const labelMatch = codeBlock.match(/<Form.Item[^>]*label="([^"]+)"/);
    const nameMatch = codeBlock.match(/name="([^"]+)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setPlaceholder(matchAttr("placeholder"));
    setAddonBefore(matchAttr("addonBefore"));
    setAddonAfter(matchAttr("addonAfter"));
    setPrefix(matchAttr("prefix"));
    setSuffix(matchAttr("suffix"));
    setInputId(matchAttr("id"));
    setMaxLength(maxLengthMatch ? parseInt(maxLengthMatch[1]) : undefined);
    setMinLength(minLengthMatch ? parseInt(minLengthMatch[1]) : undefined);

    setAllowClear(matchBool("allowClear"));
    setShowCount(matchBool("showCount"));
    setDisabled(matchBool("disabled"));
    setReadOnly(matchBool("readOnly"));
    setAutoFocus(matchBool("autoFocus"));

    setSize(
      sizeMatch?.[1] === "small" ||
        sizeMatch?.[1] === "middle" ||
        sizeMatch?.[1] === "large"
        ? sizeMatch[1]
        : "middle"
    );

    setStatus(
      statusMatch?.[1] === "error" || statusMatch?.[1] === "warning"
        ? statusMatch[1]
        : ""
    );
  }, [codeBlock]);

  const {
    errorLabel,
    errorName,
    errorMinLength,
    errorMaxLength,
    errorAddonBefore,
    errorAddonAfter,
    errorPrefix,
    errorSuffix,
    errorId,
    errorSize,
    errorStatus,
    validateAndSave: hookValidateAndSave,
  } = useInputValidation({
    label,
    name,
    placeholder,
    minLength,
    maxLength,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    id: inputId,
    size,
    status,
    onSave,
    buildCode: () => {
      const props: string[] = [];

      if (placeholder) props.push(`placeholder="${placeholder}"`);
      if (minLength !== undefined) props.push(`minLength={${minLength}}`);
      if (maxLength !== undefined) props.push(`maxLength={${maxLength}}`);
      if (disabled) props.push("disabled");
      if (readOnly) props.push("readOnly");
      if (autoFocus) props.push("autoFocus");
      if (antdVersion !== "v3" && allowClear) props.push("allowClear");
      if (antdVersion !== "v3" && showCount) props.push("showCount");
      if (antdVersion !== "v3" && status) props.push(`status="${status}"`);
      if (size && size !== "middle") props.push(`size="${size}"`);
      if (addonBefore) props.push(`addonBefore="${addonBefore}"`);
      if (addonAfter) props.push(`addonAfter="${addonAfter}"`);
      if (prefix) props.push(`prefix="${prefix}"`);
      if (suffix) props.push(`suffix="${suffix}"`);
      if (inputId) props.push(`id="${inputId}"`);

      return `<Form.Item label="${label}" name="${name}"><Input ${props.join(
        " "
      )} /></Form.Item>`;
    },
  });

  const validateAndSave = () => {
    hookValidateAndSave(); // ahora toma los valores actuales
  };

  return (
    <Modal
      open={open}
      title="Editar Input Text"
      onCancel={onCancel}
      onOk={validateAndSave}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiqueta"
          addonBefore="label"
          status={errorLabel ? "error" : undefined}
        />
        {errorLabel && <div className="text-red-500">{errorLabel}</div>}

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
          addonBefore="name"
          status={errorName ? "error" : undefined}
        />
        {errorName && <div className="text-red-500">{errorName}</div>}

        <Input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Placeholder"
          addonBefore="placeholder"
        />

        <Input
          type="number"
          value={minLength !== undefined ? minLength : ""}
          onChange={(e) =>
            setMinLength(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Min Length"
          addonBefore="minLength"
          status={errorMinLength ? "error" : undefined}
        />
        {errorMinLength && <div className="text-red-500">{errorMinLength}</div>}

        <Input
          type="number"
          value={maxLength !== undefined ? maxLength : ""}
          onChange={(e) =>
            setMaxLength(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Max Length"
          addonBefore="maxLength"
          status={errorMaxLength ? "error" : undefined}
        />
        {errorMaxLength && <div className="text-red-500">{errorMaxLength}</div>}

        <Checkbox
          checked={readOnly}
          onChange={(e) => setReadOnly(e.target.checked)}
        >
          readOnly
        </Checkbox>

        <Checkbox
          checked={autoFocus}
          onChange={(e) => setAutoFocus(e.target.checked)}
        >
          autoFocus
        </Checkbox>

        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Input
              value={addonBefore}
              onChange={(e) => setAddonBefore(e.target.value)}
              placeholder="Valor de addonBefore"
              addonBefore="addonBefore"
              className="mb-2"
              status={errorAddonBefore ? "error" : undefined}
            />
            {errorAddonBefore && (
              <div className="text-red-500">{errorAddonBefore}</div>
            )}

            <Input
              value={addonAfter}
              onChange={(e) => setAddonAfter(e.target.value)}
              placeholder="Valor de addonAfter"
              addonBefore="addonAfter"
              className="mb-2"
              status={errorAddonAfter ? "error" : undefined}
            />
            {errorAddonAfter && (
              <div className="text-red-500">{errorAddonAfter}</div>
            )}

            <Input
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Prefijo"
              addonBefore="prefix"
              className="mb-2"
              status={errorPrefix ? "error" : undefined}
            />
            {errorPrefix && <div className="text-red-500">{errorPrefix}</div>}

            <Input
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="Sufijo"
              addonBefore="suffix"
              className="mb-2"
              status={errorSuffix ? "error" : undefined}
            />
            {errorSuffix && <div className="text-red-500">{errorSuffix}</div>}

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="ID del input"
              addonBefore="id"
              className="mb-2"
              status={errorId ? "error" : undefined}
            />
            {errorId && <div className="text-red-500">{errorId}</div>}

            <Checkbox
              checked={allowClear}
              disabled={antdVersion === "v3"}
              onChange={(e) => setAllowClear(e.target.checked)}
              className="mb-2"
            >
              allowClear
            </Checkbox>

            <Checkbox
              checked={showCount}
              disabled={antdVersion === "v3"}
              onChange={(e) => setShowCount(e.target.checked)}
              className="mb-2"
            >
              showCount
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Tamaño (size)</label>
              <Select
                value={size}
                onChange={setSize}
                style={{ width: "100%" }}
                status={errorSize ? "error" : undefined}
              >
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
              {errorSize && <div className="text-red-500">{errorSize}</div>}
            </div>

            {antdVersion !== "v3" && (
              <div>
                <label className="block mb-1">Estado</label>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: "100%" }}
                  status={errorStatus ? "error" : undefined}
                >
                  <Option value="">none</Option>
                  <Option value="error">error</Option>
                  <Option value="warning">warning</Option>
                </Select>
                {errorStatus && (
                  <div className="text-red-500">{errorStatus}</div>
                )}
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
