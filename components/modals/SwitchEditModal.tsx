"use client";

import { Modal, Input, Switch, Select, Divider, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;

interface SwitchEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SwitchEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SwitchEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [checkedChildren, setCheckedChildren] = useState<string | null>(null);
  const [unCheckedChildren, setUnCheckedChildren] = useState<string | null>(
    null
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<"default" | "small">("default");
  const [inputId, setInputId] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const checkedChildrenMatch = codeBlock.match(/checkedChildren="([^"]*)"/);
    const unCheckedChildrenMatch = codeBlock.match(
      /unCheckedChildren="([^"]*)"/
    );
    const disabledMatch = /disabled/.test(codeBlock);
    const loadingMatch = /loading/.test(codeBlock);
    const sizeMatch = codeBlock.match(/size="(default|small)"/);
    const idMatch = codeBlock.match(/id="([^"]+)"/);
    const checkedMatch = /checked/.test(codeBlock);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setCheckedChildren(checkedChildrenMatch?.[1] || null);
    setUnCheckedChildren(unCheckedChildrenMatch?.[1] || null);
    setDisabled(disabledMatch);
    setLoading(loadingMatch);
    setSize(sizeMatch?.[1] === "small" ? "small" : "default");
    setInputId(idMatch?.[1] || "");
    setChecked(checkedMatch);
    setStatus(
      statusMatch &&
        (statusMatch[1] === "error" || statusMatch[1] === "warning")
        ? statusMatch[1]
        : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (disabled) props.push("disabled");
    if (loading) props.push("loading");
    if (size !== "default") props.push(`size="${size}"`);
    if (checkedChildren) props.push(`checkedChildren="${checkedChildren}"`);
    if (unCheckedChildren)
      props.push(`unCheckedChildren="${unCheckedChildren}"`);
    if (inputId) props.push(`id="${inputId}"`);
    if (checked) props.push("checked");
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}">
  <Switch ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Switch"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={500}
    >
      <div className="space-y-4">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etiqueta del Form.Item"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (name)"
        />
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        >
          checked (solo para referencia, no controla el valor en runtime)
        </Checkbox>
        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>
        <Checkbox
          checked={loading}
          onChange={(e) => setLoading(e.target.checked)}
        >
          loading
        </Checkbox>
        <Input
          value={checkedChildren || ""}
          onChange={(e) => setCheckedChildren(e.target.value || null)}
          placeholder="checkedChildren"
        />
        <Input
          value={unCheckedChildren || ""}
          onChange={(e) => setUnCheckedChildren(e.target.value || null)}
          placeholder="unCheckedChildren"
        />
        <div>
          <label className="block mb-1">Tamaño (size)</label>
          <Select
            value={size}
            onChange={(value) => setSize(value)}
            style={{ width: "100%" }}
          >
            <Option value="default">default</Option>
            <Option value="small">small</Option>
          </Select>
        </div>
        <Input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="ID"
          addonBefore="id"
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
              <Option value="error">error</Option>
              <Option value="warning">warning</Option>
            </Select>
          </div>
        )}
      </div>
    </Modal>
  );
}
