import { Select, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

export default function VersionSelector({
  versions,
  activeVersionId,
  setActiveVersionId,
  onDeleteVersion,
}: {
  versions: { id: number }[];
  activeVersionId: number | null;
  setActiveVersionId: (id: number) => void;
  onDeleteVersion: (id: number) => void;
}) {
  if (versions.length === 0) return null;

  const showConfirmDelete = (id: number) => {
    Modal.confirm({
      title: `¿Eliminar la versión ${id}?`,
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        onDeleteVersion(id);
      },
    });
  };

  const options = versions.map((v) => ({
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Version {v.id}</span>
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // evita que seleccione la opción al hacer clic en el icono
            showConfirmDelete(v.id);
          }}
        />
      </div>
    ),
    value: v.id,
    // text para mostrar en el select cerrado:
    // Esto es la propiedad que usa optionLabelProp para mostrar texto simple sin iconos
    text: `Version ${v.id}`,
  }));

  return (
    <Select
      value={activeVersionId ?? undefined}
      placeholder="Select version"
      onChange={setActiveVersionId}
      size="large"
      style={{ width: 260 }}
      options={options}
      popupRender={(menu) => menu}
      optionLabelProp="text" // Esto hace que en el select cerrado se muestre solo el texto simple
    />
  );
}
