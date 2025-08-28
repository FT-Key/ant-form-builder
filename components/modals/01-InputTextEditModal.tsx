"use client";

import { useEffect, useState } from "react";
import { Modal, Checkbox, Divider, Collapse } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { buildInputCode } from "@/utils/modals/buildInputCode";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";

const { Panel } = Collapse;

interface InputTextEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function InputTextEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: InputTextEditModalProps) {
  const { antdVersion } = useAntdVersion();

  // Estado local editable
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
    addonBefore: "",
    addonAfter: "",
    prefix: "",
    suffix: "",
    className: "",
    minLength: undefined,
    maxLength: undefined,
  });

  const [allowClear, setAllowClear] = useState(false);
  const [showCount, setShowCount] = useState(false);

  const { activePanels, setActivePanels } = useCollapsePanels(
    [
      "errorLabel",
      "errorName",
      "errorPlaceholder",
      "errorMinLength",
      "errorMaxLength",
    ],
    [
      "errorAddonBefore",
      "errorAddonAfter",
      "errorPrefix",
      "errorSuffix",
      "errorId",
      "errorSize",
      "errorStatus",
      "errorClassName",
    ]
  );

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () =>
      buildInputCode(localFields, {
        ...localFields,
        allowClear,
        showCount,
      }),
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
      minLength: matchNumberProp("minLength"),
      maxLength: matchNumberProp("maxLength"),
      addonBefore: matchAttr("addonBefore"),
      addonAfter: matchAttr("addonAfter"),
      prefix: matchAttr("prefix"),
      suffix: matchAttr("suffix"),
      className: matchAttr("className"),
      disabled: matchBool("disabled"),
      readOnly: matchBool("readOnly"),
      autoFocus: matchBool("autoFocus"),
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
    }));

    setAllowClear(matchBool("allowClear"));
    setShowCount(matchBool("showCount"));
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    const hasAdvancedErrors = [
      "errorAddonBefore",
      "errorAddonAfter",
      "errorPrefix",
      "errorSuffix",
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
      onSave(
        buildInputCode(localFields, {
          ...localFields,
          allowClear,
          showCount,
        })
      );
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Input Text"
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
            "readOnly",
            "autoFocus",
            "size",
            "status",
            "minLength",
            "maxLength",
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
                "addonBefore",
                "addonAfter",
                "prefix",
                "suffix",
                "inputId",
                "className",
                "size",
                "status",
                "allowClear",
                "showCount",
              ]}
              allowClear={allowClear}
              showCount={showCount}
              setAllowClear={setAllowClear}
              setShowCount={setShowCount}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
