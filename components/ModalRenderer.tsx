// components/ModalRenderer.tsx
import React from "react";
import { getInputType } from "@/utils/getInputType";
import { modalMap } from "@/utils/modalMap";

interface ModalRendererProps {
  editingInputId: string | null;
  codeBlock: string;
  onCancel: () => void; // debe cerrar el modal (p.ej. setEditingInputId(null))
  onSave: (updatedCode?: any) => void; // actualiza el código en el padre
  onChangeCode: (newCodeBlock: string) => void;
}

export default function ModalRenderer({
  editingInputId,
  codeBlock,
  onCancel,
  onSave,
  onChangeCode,
}: ModalRendererProps) {
  if (!editingInputId) return null;

  const inputType = getInputType(codeBlock);
  const ModalComponent = modalMap[inputType];

  if (!ModalComponent) {
    console.warn(
      "[ModalRenderer] No ModalComponent encontrado para inputType:",
      inputType
    );
    return null;
  }

  // Envoltorios con logs
  const handleCancel = () => {
    try {
      onCancel();
    } catch (e) {
      console.error("[ModalRenderer] error calling onCancel:", e);
    }
  };

  // ⭐ Guardar y luego cerrar (opción 2 centralizada)
  const handleSave = async (updatedCode?: any) => {
    try {
      await Promise.resolve(onSave(updatedCode)); // por si onSave es async
      onCancel(); // cerrar después de guardar OK
    } catch (e) {
      console.error("[ModalRenderer] error calling onSave:", e);
      // Si prefieres cerrar aun con error, mueve onCancel() a un finally
      // finally { onCancel(); }
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
      onSave={handleSave} // ← los modales sólo llaman onSave(...)
      onChangeCode={handleChangeCode}
    />
  );
}
