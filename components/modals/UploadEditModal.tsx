"use client";

import { Modal, Input, Select, Divider, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Option } = Select;

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
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<"" | "error" | "warning">("");

  useEffect(() => {
    const labelMatch = codeBlock.match(/label="([^"]*)"/);
    const nameMatch = codeBlock.match(/name="([^"]*)"/);
    const actionMatch = codeBlock.match(/action="([^"]*)"/);
    const multipleMatch = /multiple/.test(codeBlock);
    const disabledMatch = /disabled/.test(codeBlock);
    const showUploadListMatch = /showUploadList/.test(codeBlock);
    const listTypeMatch = codeBlock.match(
      /listType="(text|picture|picture-card)"/
    );
    const idMatch = codeBlock.match(/id="([^"]+)"/);
    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    setLabel(labelMatch?.[1] || "");
    setName(nameMatch?.[1] || "");
    setAction(actionMatch?.[1] || "");
    setMultiple(multipleMatch);
    setDisabled(disabledMatch);
    setShowUploadList(showUploadListMatch);
    const listTypeValue = listTypeMatch?.[1];
    if (
      listTypeValue === "text" ||
      listTypeValue === "picture" ||
      listTypeValue === "picture-card"
    ) {
      setListType(listTypeValue);
    } else {
      setListType("text");
    }
    setInputId(idMatch?.[1] || "");
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
    if (action) props.push(`action="${action}"`);
    if (multiple) props.push("multiple");
    if (disabled) props.push("disabled");
    if (showUploadList) props.push("showUploadList");
    else props.push("showUploadList={false}");
    if (listType && listType !== "text") props.push(`listType="${listType}"`);
    if (inputId) props.push(`id="${inputId}"`);
    if (antdVersion !== "v3" && status) props.push(`status="${status}"`);

    return `<Form.Item label="${label}">
  <Upload ${props.join(" ")} />
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
        <Input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Propiedad action (URL)"
        />
        <Checkbox
          checked={multiple}
          onChange={(e) => setMultiple(e.target.checked)}
        >
          multiple
        </Checkbox>
        <Checkbox
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        >
          disabled
        </Checkbox>
        <Checkbox
          checked={showUploadList}
          onChange={(e) => setShowUploadList(e.target.checked)}
        >
          showUploadList
        </Checkbox>

        <div>
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
