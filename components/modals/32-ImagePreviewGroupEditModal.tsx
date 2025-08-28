"use client";

import { Modal, Input, Divider, Collapse } from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface ImagePreviewGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function ImagePreviewGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: ImagePreviewGroupEditModalProps) {
  const [blockId, setBlockId] = useState("");
  const [previewVisible, setPreviewVisible] = useState(true);

  useEffect(() => {
    if (!codeBlock) return;

    const idMatch = codeBlock.match(/id="([^"]*)"/);
    const previewMatch = codeBlock.includes("preview={false}");

    setBlockId(idMatch?.[1] || "");
    setPreviewVisible(!previewMatch);
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];
    if (!previewVisible) props.push(`preview={false}`);
    if (blockId) props.push(`id="${blockId}"`);

    return `<Image.PreviewGroup ${props.join(" ")}>
  {/* <Image src="..." /> elementos aquí */}
</Image.PreviewGroup>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Image Preview Group"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
    >
      <Divider>Campos básicos</Divider>
      {/* Este componente no tiene label/name por no ser de formulario */}

      <Collapse ghost>
        <Panel header="Opciones avanzadas" key="1">
          <Input
            addonBefore="id"
            value={blockId}
            onChange={(e) => setBlockId(e.target.value)}
          />
          <label style={{ display: "block", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={previewVisible}
              onChange={(e) => setPreviewVisible(e.target.checked)}
            />{" "}
            preview
          </label>
        </Panel>
      </Collapse>
    </Modal>
  );
}
