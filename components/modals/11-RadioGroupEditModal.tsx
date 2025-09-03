// RadioGroupEditModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Modal, Divider, Collapse } from "antd";
import { useAntdVersion } from "@/context/AntdVersionContext";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useCollapsePanels } from "@/hooks/modals/useCollapsePanels";
import { BaseInputFields, OptionItem } from "@/types/BaseInputFields";
import { BasicFields } from "@/components/modals/BasicFields";
import { AdvancedFields } from "@/components/modals/AdvancedFields";
import { OptionsFields } from "@/components/modals/OptionsFields";
import { buildInputCode } from "@/utils/modals/buildInputCode";

const { Panel } = Collapse;

interface RadioGroupEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

export default function RadioGroupEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: RadioGroupEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [localFields, setLocalFields] = useState<BaseInputFields>({
    label: "",
    name: "",
    inputId: "",
    className: "",
    disabled: false,
    status: "",
  });

  const [options, setOptions] = useState<OptionItem[]>([]);
  const [optionType, setOptionType] = useState<"default" | "button">("default");
  const [buttonStyle, setButtonStyle] = useState<"outline" | "solid">(
    "outline"
  );
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [readOnly, setReadOnly] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);

  // --- Collapse hooks ---
  const {
    activePanels: activeOptionPanels,
    setActivePanels: setActiveOptionPanels,
    validateAndOpen: validateAndOpenOptions,
  } = useCollapsePanels([], [], ["errorOption"]); // <-- corregido: errorOption

  const {
    activePanels: activeAdvancedPanels,
    setActivePanels: setActiveAdvancedPanels,
    validateAndOpen: validateAndOpenAdvanced,
  } = useCollapsePanels([], ["errorId", "errorClassName", "errorStatus"]);

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    options,
    optionType,
    buttonStyle,
    size,
    readOnly,
    autoFocus,
    id: localFields.inputId,
    onSave,
    buildCode: () =>
      buildInputCode(
        {
          ...localFields,
          options,
          optionType,
          buttonStyle,
          size,
          readOnly,
          autoFocus,
        },
        { options },
        "Radio.Group"
      ),
  });

  // --- Parse codeBlock ---
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]*)"`))?.[1] ?? "";

    const matchBool = (attr: string) =>
      codeBlock.includes(attr) && !codeBlock.includes(`${attr}={false}`);

    const statusMatch = codeBlock.match(/status="(error|warning)"/);
    const optionTypeMatch = codeBlock.match(/optionType="(default|button)"/);
    const buttonStyleMatch = codeBlock.match(/buttonStyle="(outline|solid)"/);
    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/);

    const optionsMatch = codeBlock.match(/options=\{(\[[^\]]*\])\}/);
    let parsedOptions: OptionItem[] = [];

    if (optionsMatch) {
      try {
        const rawStr = optionsMatch[1].trim();
        const jsonStr = rawStr
          .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
          .replace(/'/g, '"');
        parsedOptions = JSON.parse(jsonStr);
      } catch {
        parsedOptions = [];
      }
    } else {
      const radioMatches = [
        ...codeBlock.matchAll(/<Radio\s+value="([^"]+)">([^<]+)<\/Radio>/g),
      ];
      parsedOptions = radioMatches.map((m) => ({ value: m[1], label: m[2] }));
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

    setOptionType(optionTypeMatch?.[1] === "button" ? "button" : "default");
    setButtonStyle(buttonStyleMatch?.[1] === "solid" ? "solid" : "outline");
    setSize(
      sizeMatch?.[1] === "small" || sizeMatch?.[1] === "large"
        ? (sizeMatch[1] as any)
        : "middle"
    );
    setReadOnly(matchBool("readOnly"));
    setAutoFocus(matchBool("autoFocus"));
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
      onSave(
        buildInputCode(
          {
            ...localFields,
            options,
            optionType,
            buttonStyle,
            size,
            readOnly,
            autoFocus,
          },
          { options },
          "Radio.Group"
        )
      );
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Radio Group"
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
            <OptionsFields
              options={options}
              setOptions={setOptions}
              errors={errors}
              type="radio"
            />
          </Panel>
        </Collapse>

        <Collapse
          ghost
          activeKey={activeAdvancedPanels}
          onChange={(keys) => setActiveAdvancedPanels(keys as string[])}
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
                "readOnly",
                "autoFocus",
                "optionType",
              ]}
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
