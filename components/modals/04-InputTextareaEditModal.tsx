"use client";

import { useEffect, useState } from "react";
import { Modal, Divider, Collapse } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { buildInputCode } from "@/utils/modals/buildInputCode";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";

const { Panel } = Collapse;

interface TextAreaEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function TextAreaEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TextAreaEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estado editable
  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    placeholder: "",
    rows: 4,
    maxLength: undefined,
    autoSize: false,
    allowClear: false,
    showCount: false,
    disabled: false,
    readOnly: false,
    autoFocus: false,
    size: "middle",
    status: "",
    inputId: "",
    className: "",
  });

  const { activePanels, setActivePanels } = useCollapsePanels(
    // errores básicos
    [
      "errorLabel",
      "errorName",
      "errorPlaceholder",
      "errorRows",
      "errorMaxLength",
    ],
    // errores avanzados
    [
      "errorAutoSize",
      "errorAllowClear",
      "errorShowCount",
      "errorId",
      "errorClassName",
      "errorSize",
      "errorStatus",
    ]
  );

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, {}, "Input.TextArea"),
  });

  // Inicializar campos al abrir modal
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ||
      codeBlock.match(new RegExp(`${attr}='([^']+)'`))?.[1] ||
      "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const matchNumberProp = (attr: string): number | undefined => {
      const brace = codeBlock.match(new RegExp(`${attr}={(\\d+)}`));
      if (brace) return Number(brace[1]);
      const dbl = codeBlock.match(new RegExp(`${attr}="(\\d+)"`));
      if (dbl) return Number(dbl[1]);
      const sgl = codeBlock.match(new RegExp(`${attr}='(\\d+)'`));
      if (sgl) return Number(sgl[1]);
      return undefined;
    };

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      placeholder: matchAttr("placeholder"),
      inputId: matchAttr("id"),
      rows: matchNumberProp("rows") || 4,
      maxLength: matchNumberProp("maxLength"),
      disabled: matchBool("disabled"),
      readOnly: matchBool("readOnly"),
      autoFocus: matchBool("autoFocus"),
      autoSize: matchBool("autoSize"),
      allowClear: matchBool("allowClear"),
      showCount: matchBool("showCount"),
      size:
        codeBlock.match(/size="(large|middle|small)"/)?.[1] === "large"
          ? "large"
          : codeBlock.match(/size="(large|middle|small)"/)?.[1] === "small"
          ? "small"
          : "middle",
      status:
        codeBlock.match(/status="(error|warning)"/)?.[1] === "error"
          ? "error"
          : codeBlock.match(/status="(error|warning)"/)?.[1] === "warning"
          ? "warning"
          : "",
      className: matchAttr("className"),
    }));
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    const hasAdvancedErrors = [
      "errorAutoSize",
      "errorAllowClear",
      "errorShowCount",
      "errorId",
      "errorClassName",
      "errorSize",
      "errorStatus",
    ].some((key) => currentErrors[key]);

    if (hasAdvancedErrors && !activePanels.includes("1")) {
      setActivePanels([...activePanels, "1"]);
    }

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );

    if (!hasAnyErrors) {
      onSave(buildInputCode(localFields, {}, "Input.TextArea"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar TextArea"
      onCancel={onCancel}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>
        <BasicFields
          fields={localFields}
          setField={(key, value) =>
            setLocalFields((prev) => ({ ...prev, [key]: value }))
          }
          errors={errors}
          show={[
            "label",
            "name",
            "placeholder",
            "rows",
            "maxLength",
            "disabled",
            "readOnly",
            "autoFocus",
            "size",
            "status",
          ]}
        />

        <Collapse
          ghost
          activeKey={activePanels}
          onChange={(keys) => setActivePanels(keys as string[])}
        >
          <Panel header="Opciones avanzadas" key="1">
            <AdvancedFields
              fields={localFields}
              setField={(key, value) =>
                setLocalFields((prev) => ({ ...prev, [key]: value }))
              }
              errors={errors}
              show={[
                "autoSize",
                "allowClear",
                "showCount",
                "inputId",
                "className",
                "size",
                "status",
              ]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
