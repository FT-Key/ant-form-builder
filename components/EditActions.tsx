"use client";
import { Button, Alert } from "antd";

export default function EditActions({
  hasUnsavedChanges,
  onSave,
  onCancel,
}: {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-4">
      {hasUnsavedChanges && (
        <Alert
          message="Cambios sin guardar"
          type="warning"
          showIcon
          className="mb-4"
        />
      )}
      <div className="flex gap-4">
        <Button
          type="default"
          onClick={onCancel}
          disabled={!hasUnsavedChanges}
          className="border-gray-300 text-gray-600 hover:border-gray-400"
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="bg-gray-900 border-gray-900 hover:bg-gray-800"
        >
          Save & Return
        </Button>
      </div>
    </div>
  );
}
