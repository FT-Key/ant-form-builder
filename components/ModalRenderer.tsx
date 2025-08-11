// components/ModalRenderer.tsx
import React from "react";
import { getInputType } from "@/utils/getInputType";
import { modalMap } from "@/utils/modalMap";

interface ModalRendererProps {
  editingInputId: string | null;
  codeBlock: string;
  onCancel: () => void;
  onSave: (...args: any[]) => void;
  onChangeCode: (newCodeBlock: string) => void;
}

export default function ModalRenderer({
  editingInputId,
  codeBlock,
  onCancel,
  onSave,
  onChangeCode,
}: ModalRendererProps) {

  if (!editingInputId) {
    return null;
  }

  const inputType = getInputType(codeBlock);

  const ModalComponent = modalMap[inputType];
  if (!ModalComponent) {
    console.warn(
      "[ModalRenderer] No ModalComponent encontrado para inputType:",
      inputType
    );
    return null;
  }

  // simple wrappers that only add logging, then call the original callbacks
  const handleCancel = () => {
    try {
      onCancel();
    } catch (e) {
      console.error("[ModalRenderer] error calling onCancel:", e);
    }
  };

  const handleSave = (updatedCode?: any) => {
    try {
      (onSave as any)(updatedCode);
    } catch (e) {
      console.error("[ModalRenderer] error calling onSave:", e);
    }
  };

  const handleChangeCode = (newCode: string) => {
    try {
      onChangeCode?.(newCode);
    } catch (e) {
      console.error("[ModalRenderer] error calling onChangeCode:", e);
    }
  };

  return (
    <ModalComponent
      open={true}
      codeBlock={codeBlock}
      onCancel={handleCancel}
      onSave={handleSave}
      onChangeCode={handleChangeCode}
    />
  );
}
