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

interface RangePickerEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function RangePickerEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: RangePickerEditModalProps) {
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
    formatDate: undefined, // <- undefined por defecto
    picker: "date",
  });

  const { activePanels, setActivePanels } = useCollapsePanels(
    ["errorLabel", "errorName", "errorPlaceholder"],
    ["errorId", "errorSize", "errorStatus", "errorClassName"]
  );

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, {}, "RangePicker"),
  });

  // Parsear codeBlock
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1];

    const matchBool = (attr: string) =>
      codeBlock.includes(attr) && !codeBlock.includes(`${attr}={false}`);

    const isFalse = (attr: string) => codeBlock.includes(`${attr}={false}`);

    const rawPicker = matchAttr("picker");
    const pickerValue: BaseInputFields["picker"] = [
      "date",
      "week",
      "month",
      "quarter",
      "year",
    ].includes(rawPicker || "")
      ? (rawPicker as BaseInputFields["picker"])
      : "date";

    const rawFormat = matchAttr("formatDate") || matchAttr("format");
    const formatDateValue: BaseInputFields["formatDate"] | undefined =
      rawFormat &&
      ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"].includes(
        rawFormat
      )
        ? (rawFormat as BaseInputFields["formatDate"])
        : undefined;

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label") ?? "",
      name: matchAttr("name") ?? "",
      placeholder: matchAttr("placeholder") ?? "",
      inputId: matchAttr("id") ?? "",
      className: matchAttr("className") ?? "",
      formatDate: formatDateValue,
      picker: pickerValue,
      showTime: matchBool("showTime"),
      allowClear: !isFalse("allowClear"),
      disabled: matchBool("disabled"),
      autoFocus: matchBool("autoFocus"),
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
      onSave(buildInputCode(localFields, {}, "RangePicker"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar RangePicker"
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
                "formatDate",
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
