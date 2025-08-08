"use client";

import { Button, Alert } from "antd";
import {
  DeleteOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";

export default function EditActions({
  hasUnsavedChanges,
  onSave,
  onCancel,
  onClear,
  isPreviewExpanded,
  setIsPreviewExpanded,
  isPreviewVisible, // 👈 NUEVO
}: {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
  onClear: () => void;
  isPreviewExpanded: boolean;
  setIsPreviewExpanded: (value: boolean) => void;
  isPreviewVisible: boolean; // 👈 NUEVO
}) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
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

        <div className="flex gap-2">
          <Button danger icon={<DeleteOutlined />} onClick={onClear} />

          {isPreviewVisible && ( // 👈 SOLO si está visible el preview
            <Button
              type="default"
              icon={
                isPreviewExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />
              }
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
            />
          )}
        </div>
      </div>

      {hasUnsavedChanges && (
        <Alert
          message="Cambios sin guardar"
          type="warning"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
}
