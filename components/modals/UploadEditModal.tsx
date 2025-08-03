"use client";

import { Modal, Input, Select, Divider, Checkbox, Collapse } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;
const { Panel } = Collapse;

interface UploadEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function UploadEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: UploadEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [multiple, setMultiple] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showUploadList, setShowUploadList] = useState(true);
  const [listType, setListType] = useState<"text" | "picture" | "picture-card">(
    "text"
  );
  const [drag, setDrag] = useState(false);
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const actionMatch = codeBlock.match(/action="([^"]*)"/);
    const multipleMatch = /multiple/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const showUploadListMatch = codeBlock.match(
      /showUploadList(?:={(false|true)})?/
    );
    const listTypeMatch = codeBlock.match(
      /listType="(text|picture|picture-card)"/
    );
    const isDragger = /<Upload\.Dragger/.test(codeBlock);
    const idMatch = codeBlock.match(/id="([^"]+)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setAction(actionMatch?.[1] || "");
    setMultiple(multipleMatch);
    setDisabled(disabledMatch);
    setShowUploadList(
      showUploadListMatch?.[1] === "false"
        ? false
        : showUploadListMatch
        ? true
        : true // default visible
    );
    setDrag(isDragger);
    setListType(
      listTypeMatch?.[1] === "picture" || listTypeMatch?.[1] === "picture-card"
        ? listTypeMatch[1]
        : "text"
    );
    setInputId(idMatch?.[1] || "");
    setStatus(
      statusMatch?.[1] === "error" || statusMatch?.[1] === "warning"
        ? statusMatch[1]
        : ""
    );
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (name) props.push(`name="${name}"`);
    if (action) props.push(`action="${action}"`);
    if (multiple) props.push("multiple");
    if (disabled) props.push("disabled");
    if (!showUploadList) props.push("showUploadList={false}");
    if (listType !== "text") props.push(`listType="${listType}"`);
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    const propsStr = props.join(" ");

    // Si está en modo drag
    if (drag) {
      return `<Form.Item label="${label}" name="${name}">
  <Upload.Dragger ${propsStr}>
    <p style={{ textAlign: 'center' }}>
      <span>Haz clic o arrastra archivos aquí para subir</span>
    </p>
  </Upload.Dragger>
</Form.Item>`;
    }

    // Upload normal
    return `<Form.Item label="${label}" name="${name}">
  <Upload ${propsStr}>
    <Button type="primary">Subir archivo</Button>
  </Upload>
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Upload"
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
        <Input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          addonBefore="action"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="advanced">
            <Checkbox
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
              className="mb-2"
            >
              multiple
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={showUploadList}
              onChange={(e) => setShowUploadList(e.target.checked)}
              className="mb-2"
            >
              showUploadList
            </Checkbox>
            <Checkbox
              checked={drag}
              onChange={(e) => setDrag(e.target.checked)}
              className="mb-4"
            >
              drag (modo arrastrar archivos)
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">listType</label>
              <Select
                value={listType}
                onChange={(value) => setListType(value)}
                style={{ width: "100%" }}
              >
                <Option value="text">text</Option>
                <Option value="picture">picture</Option>
                <Option value="picture-card">picture-card</Option>
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
