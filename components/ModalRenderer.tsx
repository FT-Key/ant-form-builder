"use client";

import React from "react";
import { getInputType } from "@/utils/getInputType";
import { modalMap } from "@/utils/modalMap";

interface ModalRendererProps {
  editingInputId: string | null;
  codeBlock: string;
  onCancel: () => void;
  onSave: (newCodeBlock: string) => void;
}

export default function ModalRenderer({
  editingInputId,
  codeBlock,
  onCancel,
  onSave,
}: ModalRendererProps) {
  if (!editingInputId) return null;

  const inputType = getInputType(codeBlock);
  const ModalComponent = modalMap[inputType];
  if (!ModalComponent) return null;

  return (
    <ModalComponent
      open={true}
      codeBlock={codeBlock}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
