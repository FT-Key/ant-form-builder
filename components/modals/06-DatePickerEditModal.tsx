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

interface DatePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function DatePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: DatePickerEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    placeholder: "",
    disabled: false,
    readOnly: false,
    autoFocus: false,
    size: "middle",
    status: "",
    inputId: "",
    className: "",
    allowClear: true,
    showTime: false,
    format: "",
    use12Hours: false,
    picker: "date",
  });

  // Collapse avanzado
  const { activePanels, setActivePanels } = useCollapsePanels(
    ["errorLabel", "errorName", "errorPlaceholder"],
    ["errorId", "errorSize", "errorStatus", "errorClassName"]
  );

  // Validación + guardado
  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, {}, "DatePicker"),
  });

  // Parsear el codeBlock al abrir modal
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] || "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      placeholder: matchAttr("placeholder"),
      inputId: matchAttr("id"),
      format: matchAttr("format"),
      className: matchAttr("className"),
      disabled: matchBool("disabled"),
      autoFocus: matchBool("autoFocus"),
      allowClear: !/allowClear=\{false\}/.test(codeBlock),
      showTime: matchBool("showTime"),
      use12Hours: matchBool("use12Hours"),
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
      picker:
        (codeBlock.match(
          /picker="(date|week|month|quarter|year)"/
        )?.[1] as BaseInputFields["picker"]) || "date",
    }));
  }, [open, codeBlock]);

  // Guardar
  const handleSave = () => {
    const currentErrors = validateAndSave();

    const hasAdvancedErrors = [
      "errorId",
      "errorSize",
      "errorStatus",
      "errorClassName",
    ].some((key) => currentErrors[key]);

    if (hasAdvancedErrors && !activePanels.includes("1")) {
      setActivePanels([...activePanels, "1"]);
    }

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );
    if (!hasAnyErrors) {
      onSave(buildInputCode(localFields, {}, "DatePicker"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar DatePicker"
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
            "disabled",
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
                "inputId",
                "className",
                "allowClear",
                "showTime",
                "format",
                "use12Hours",
                "picker",
              ]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
