"use client";

import {
  Modal,
  Input,
  Switch,
  Select,
  Divider,
  Checkbox,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

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
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] || "";

    const labelMatch = matchAttr("label");
    const nameMatch = matchAttr("name");
    const checkedChildrenMatch = matchAttr("checkedChildren");
    const unCheckedChildrenMatch = matchAttr("unCheckedChildren");
    const sizeMatch = codeBlock.match(/size="(default|small)"/)?.[1];
    const idMatch = matchAttr("id");
    const statusMatch = codeBlock.match(/status="(error|warning)"/)?.[1];

    setLabel(labelMatch);
    setName(nameMatch);
    setCheckedChildren(checkedChildrenMatch || null);
    setUnCheckedChildren(unCheckedChildrenMatch || null);
    setDisabled(codeBlock.includes("disabled"));
    setLoading(codeBlock.includes("loading"));
    setSize(sizeMatch === "small" ? "small" : "default");
    setInputId(idMatch);
    setChecked(codeBlock.includes("checked"));
    setStatus(
      statusMatch === "error" || statusMatch === "warning" ? statusMatch : ""
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

    return `<Form.Item label="${label}" name="${name}">
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

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mb-2"
            >
              checked (referencia visual)
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="mb-2"
            >
              loading
            </Checkbox>

            <Input
              value={checkedChildren || ""}
              onChange={(e) => setCheckedChildren(e.target.value || null)}
              addonBefore="checkedChildren"
              className="mb-2"
            />
            <Input
              value={unCheckedChildren || ""}
              onChange={(e) => setUnCheckedChildren(e.target.value || null)}
              addonBefore="unCheckedChildren"
              className="mb-2"
            />

            <div className="mb-2">
              <label className="block mb-1">Tamaño</label>
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
