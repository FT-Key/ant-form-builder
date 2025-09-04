"use client";

import { useEffect, useState } from "react";
import { Modal, Divider, Collapse, Checkbox } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { buildInputCode } from "@/utils/modals/buildInputCode";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";

const { Panel } = Collapse;

interface SwitchEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function SwitchEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SwitchEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estado base de campos comunes
  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    inputId: "",
    className: "",
    disabled: false,
    status: "",
    switchSize: "default",
  });

  // Props específicas del Switch
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkedChildren, setCheckedChildren] = useState("");
  const [unCheckedChildren, setUnCheckedChildren] = useState("");

  // Panels colapsables
  const { activePanels, setActivePanels } = useCollapsePanels(
    ["errorLabel", "errorName"],
    [
      "errorId",
      "errorClassName",
      "errorSwitchSize",
      "errorStatus",
      "errorCheckedChildren",
      "errorUnCheckedChildren",
    ]
  );

  // Hook de validación
  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    checkedChildren,
    unCheckedChildren,
    switchSize: localFields.switchSize,
    checked,
    loading,
    onSave,
    buildCode: () =>
      buildInputCode(localFields, {
        component: "Switch",
        checked,
        loading,
        checkedChildren,
        unCheckedChildren,
        switchSize: localFields.switchSize,
      }),
  });

  // Sincronizar estado con código al abrir el modal
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ||
      codeBlock.match(new RegExp(`${attr}='([^']+)'`))?.[1] ||
      "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      inputId: matchAttr("id"),
      className: matchAttr("className"),
      switchSize: codeBlock.match(/size="(default|small)"/)?.[1] || "default",
      status: codeBlock.match(/status="(error|warning)"/)?.[1] || "",
      disabled: matchBool("disabled"),
    }));

    // 🔹 Sincronizar props del Switch
    setChecked(matchBool("checked"));
    setLoading(matchBool("loading"));
    setCheckedChildren(matchAttr("checkedChildren"));
    setUnCheckedChildren(matchAttr("unCheckedChildren"));
  }, [open, codeBlock]);

  // Guardar cambios
  const handleSave = () => {
    const currentErrors = validateAndSave();

    const hasAdvancedErrors = [
      "errorId",
      "errorClassName",
      "errorSwitchSize",
      "errorStatus",
      "errorCheckedChildren",
      "errorUnCheckedChildren",
    ].some((key) => currentErrors[key]);

    if (hasAdvancedErrors && !activePanels.includes("1")) {
      setActivePanels([...activePanels, "1"]);
    }

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );

    if (!hasAnyErrors) {
      onSave(
        buildInputCode(localFields, {
          component: "Switch",
          checked,
          loading,
          checkedChildren,
          unCheckedChildren,
          switchSize: localFields.switchSize,
        })
      );
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Switch"
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
          show={["label", "name", "disabled"]}
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
                "switchAdvanced",
                "loading",
                "checkedChildren",
                "unCheckedChildren",
              ]}
              antdVersion={antdVersion}
              checked={checked}
              setChecked={setChecked}
              loading={loading}
              setLoading={setLoading}
              checkedChildren={checkedChildren}
              setCheckedChildren={setCheckedChildren}
              unCheckedChildren={unCheckedChildren}
              setUnCheckedChildren={setUnCheckedChildren}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
