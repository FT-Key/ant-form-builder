"use client";

import {
  Modal,
  Input,
  InputNumber,
  Checkbox,
  Collapse,
  Divider,
  Select,
} from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface WatermarkEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function WatermarkEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: WatermarkEditModalProps) {
  const [content, setContent] = useState("");
  const [children, setChildren] = useState("");
  const [fontSize, setFontSize] = useState<number>();
  const [gapX, setGapX] = useState<number>();
  const [gapY, setGapY] = useState<number>();
  const [rotate, setRotate] = useState<number>();
  const [zIndex, setZIndex] = useState<number>();
  const [height, setHeight] = useState("");
  const [absolute, setAbsolute] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inputId, setInputId] = useState("");

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";
    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}={(\\d+)}`))?.[1];

    setContent(matchAttr("content"));
    setChildren(
      codeBlock.match(/<Watermark[^>]*>([\s\S]*?)<\/Watermark>/)?.[1].trim() ||
        ""
    );
    setInputId(matchAttr("id"));

    setFontSize(
      matchNum("fontSize") ? parseInt(matchNum("fontSize")!) : undefined
    );
    setGapX(matchNum("gapX") ? parseInt(matchNum("gapX")!) : undefined);
    setGapY(matchNum("gapY") ? parseInt(matchNum("gapY")!) : undefined);
    setRotate(matchNum("rotate") ? parseInt(matchNum("rotate")!) : undefined);
    setZIndex(matchNum("zIndex") ? parseInt(matchNum("zIndex")!) : undefined);
    setHeight(matchAttr("height"));
    setAbsolute(codeBlock.includes("absolute"));
    setDisabled(codeBlock.includes("disabled"));
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (content) props.push(`content="${content}"`);
    if (fontSize !== undefined) props.push(`fontSize={${fontSize}}`);
    if (gapX !== undefined) props.push(`gapX={${gapX}}`);
    if (gapY !== undefined) props.push(`gapY={${gapY}}`);
    if (rotate !== undefined) props.push(`rotate={${rotate}}`);
    if (zIndex !== undefined) props.push(`zIndex={${zIndex}}`);
    if (height) props.push(`height="${height}"`);
    if (absolute) props.push("absolute");
    if (disabled) props.push("disabled");
    if (inputId) props.push(`id="${inputId}"`);

    return `<Watermark ${props.join(" ")}>
  ${children || `<div style={{ height: 500 }} />`}
</Watermark>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Watermark"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          addonBefore="content"
        />
        <Input.TextArea
          rows={3}
          value={children}
          onChange={(e) => setChildren(e.target.value)}
          placeholder="Contenido hijo (opcional)"
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones avanzadas" key="1">
            <InputNumber
              value={fontSize}
              onChange={(val) => setFontSize(val ?? undefined)}
              placeholder="Tamaño de fuente (px)"
              addonBefore="fontSize"
              style={{ width: "100%" }}
              className="mb-2"
            />
            <InputNumber
              value={gapX}
              onChange={(val) => setGapX(val ?? undefined)}
              placeholder="Espaciado horizontal (px)"
              addonBefore="gapX"
              style={{ width: "100%" }}
              className="mb-2"
            />
            <InputNumber
              value={gapY}
              onChange={(val) => setGapY(val ?? undefined)}
              placeholder="Espaciado vertical (px)"
              addonBefore="gapY"
              style={{ width: "100%" }}
              className="mb-2"
            />
            <InputNumber
              value={rotate}
              onChange={(val) => setRotate(val ?? undefined)}
              placeholder="Rotación (grados)"
              addonBefore="rotate"
              style={{ width: "100%" }}
              className="mb-2"
            />
            <InputNumber
              value={zIndex}
              onChange={(val) => setZIndex(val ?? undefined)}
              placeholder="z-index"
              addonBefore="zIndex"
              style={{ width: "100%" }}
              className="mb-2"
            />

            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              addonBefore="height"
              placeholder="Ej: 500px, 100%, 20rem"
              className="mb-2"
            />

            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />

            <Checkbox
              checked={absolute}
              onChange={(e) => setAbsolute(e.target.checked)}
              className="mb-2"
            >
              absolute (detrás del contenido)
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
