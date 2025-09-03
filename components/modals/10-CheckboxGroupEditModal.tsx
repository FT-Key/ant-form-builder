// CheckboxGroupEditModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Modal, Divider, Collapse } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";
import { OptionsFields } from "@/components/modals/OptionsFields";
import { buildInputCode } from "@/utils/modals/buildInputCode";

const { Panel } = Collapse;

interface CheckboxGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function CheckboxGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: CheckboxGroupEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    inputId: "",
    className: "",
    disabled: false,
    status: "",
  });

  const [options, setOptions] = useState<
    { label: string; value: string; disabled?: boolean }[]
  >([]);

  // --- Collapse hooks ---
  const {
    activePanels: activeOptionPanels,
    setActivePanels: setActiveOptionPanels,
    validateAndOpen: validateAndOpenOptions,
  } = useCollapsePanels([], [], ["errorOption"]); // <-- corregido prefijo

  const {
    activePanels: activeAdvancedPanels,
    setActivePanels: setActiveAdvancedPanels,
    validateAndOpen: validateAndOpenAdvanced,
  } = useCollapsePanels([], ["errorId", "errorClassName", "errorStatus"]);

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    options,
    id: localFields.inputId,
    onSave,
    buildCode: () => buildInputCode(localFields, { options }, "Checkbox.Group"),
  });

  // --- Parse codeBlock ---
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] ?? "";

    const matchBool = (attr: string) =>
      codeBlock.includes(attr) && !codeBlock.includes(`${attr}={false}`);

    const statusMatch = codeBlock.match(/status="(error|warning)"/);

    const optionsMatch = codeBlock.match(/options=\{(\[[^\]]*\])\}/);
    let parsedOptions: { label: string; value: string }[] = [];

    if (optionsMatch) {
      try {
        const rawStr = optionsMatch[1].trim();
        if (
          /^\s*['"].+['"](,\s*['"].+['"])*\s*$/.test(
            rawStr.replace(/[\[\]]/g, "")
          )
        ) {
          const strArray = JSON.parse(rawStr.replace(/'/g, '"')) as string[];
          parsedOptions = strArray.map((v) => ({ label: v, value: v }));
        } else {
          const jsonStr = rawStr
            .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
            .replace(/'/g, '"');
          parsedOptions = JSON.parse(jsonStr);
        }
      } catch {
        parsedOptions = [];
      }
    }

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      inputId: matchAttr("id"),
      className: matchAttr("className"),
      disabled: matchBool("disabled"),
      status:
        statusMatch?.[1] === "error" || statusMatch?.[1] === "warning"
          ? statusMatch[1]
          : "",
    }));
    setOptions(parsedOptions);
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    // Abrir automáticamente los panels que tengan errores
    validateAndOpenOptions(currentErrors);
    validateAndOpenAdvanced(currentErrors);

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );
    if (!hasAnyErrors) {
      onSave(buildInputCode(localFields, { options }, "Checkbox.Group"));
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Checkbox Group"
      onCancel={onCancel}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
      width={650}
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
          show={["label", "name", "disabled"]}
        />

        <Collapse
          ghost
          activeKey={activeOptionPanels}
          onChange={(keys) => setActiveOptionPanels(keys as string[])}
        >
          <Panel header="Opciones" key="options">
            {" "}
            {/* key coincide con useCollapsePanels */}
            <OptionsFields
              options={options}
              setOptions={setOptions}
              errors={errors}
            />
          </Panel>
        </Collapse>

        <Collapse
          ghost
          activeKey={activeAdvancedPanels}
          onChange={(keys) => setActiveAdvancedPanels(keys as string[])}
        >
          <Panel header="Opciones avanzadas" key="advanced">
            <AdvancedFields
              fields={localFields}
              setField={(key, value) =>
                setLocalFields((prev) => ({ ...prev, [key]: value }))
              }
              errors={errors}
              show={["inputId", "className", "status"]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
