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

interface TimePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function TimePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TimePickerEditModalProps) {
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
    use12Hours: false,
    format: "",
    minuteStep: undefined,
    secondStep: undefined,
  });

  const { activePanels, setActivePanels } = useCollapsePanels(
    ["errorLabel", "errorName", "errorPlaceholder"],
    ["errorId", "errorSize", "errorStatus", "errorClassName"]
  );

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, {}, "TimePicker"),
  });

  // Parsear codeBlock
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] || "";

    const matchNum = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}=\{\\s*(\\d+)\\s*\}`))?.[1];

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const isFalse = (attr: string) =>
      new RegExp(`${attr}=\{false\}`).test(codeBlock);

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      placeholder: matchAttr("placeholder"),
      inputId: matchAttr("id"),
      format: matchAttr("format"),
      disabled: matchBool("disabled"),
      autoFocus: matchBool("autoFocus"),
      allowClear: !isFalse("allowClear"),
      use12Hours: matchBool("use12Hours"),
      minuteStep: matchNum("minuteStep")
        ? parseInt(matchNum("minuteStep")!)
        : undefined,
      secondStep: matchNum("secondStep")
        ? parseInt(matchNum("secondStep")!)
        : undefined,
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
      onSave(buildInputCode(localFields, {}, "TimePicker"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar TimePicker"
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
                "use12Hours",
                "format",
                "minuteStep",
                "secondStep",
              ]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
