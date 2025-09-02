"use client";

import { useEffect, useState } from "react";
import { Modal, Divider, Collapse } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";
import { buildInputCode } from "@/utils/modals/buildInputCode";

const { Panel } = Collapse;

interface CheckboxEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function CheckboxEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: CheckboxEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    inputId: "",
    className: "",
    disabled: false,
    readOnly: false,
    autoFocus: false,
    status: "",
    allowClear: true,
    indeterminate: false,
    checked: false,
  });

  // Collapse avanzado
  const { activePanels, setActivePanels } = useCollapsePanels(
    ["errorLabel", "errorName"],
    ["errorId", "errorClassName", "errorStatus"]
  );

  // Validación + guardado
  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, {}, "Checkbox"),
  });

  // Parsear codeBlock al abrir modal
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1];

    const matchBool = (attr: string) =>
      codeBlock.includes(attr) && !codeBlock.includes(`${attr}={false}`);

    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    const labelMatch = codeBlock.match(/<Checkbox[^>]*>([^<]+)<\/Checkbox>/);

    setLocalFields((prev) => ({
      ...prev,
      label: labelMatch?.[1] ?? "",
      name: matchAttr("name") ?? "",
      inputId: matchAttr("id") ?? "",
      className: matchAttr("className") ?? "",
      disabled: matchBool("disabled"),
      autoFocus: matchBool("autoFocus"),
      readOnly: matchBool("readOnly"),
      allowClear: !isFalse("allowClear"),
      indeterminate: matchBool("indeterminate"),
      checked: matchBool("checked"),
      status:
        codeBlock.match(/status="(error|warning)"/)?.[1] === "error"
          ? "error"
          : codeBlock.match(/status="(error|warning)"/)?.[1] === "warning"
          ? "warning"
          : "",
    }));
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    const hasAdvancedErrors = ["errorId", "errorClassName", "errorStatus"].some(
      (key) => currentErrors[key]
    );

    if (hasAdvancedErrors && !activePanels.includes("1")) {
      setActivePanels([...activePanels, "1"]);
    }

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );

    if (!hasAnyErrors) {
      onSave(buildInputCode(localFields, {}, "Checkbox"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Checkbox"
      onCancel={onCancel}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <BasicFields
          fields={localFields}
          setField={(key, value) =>
            setLocalFields((prev) => ({ ...prev, [key]: value }))
          }
          errors={errors}
          show={["innerText", "label", "name", "disabled", "readOnly", "autoFocus"]}
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
                "inputId",
                "className",
                "status",
                "checked",
                "indeterminate",
              ]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
