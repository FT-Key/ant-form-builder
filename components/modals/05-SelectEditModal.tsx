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
import { OptionsFields } from "./OptionsFields";

const { Panel } = Collapse;

interface SelectEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface SelectFields extends BaseInputFields {
  allowClear?: boolean;
  showSearch?: boolean;
  mode?: "" | "multiple" | "tags";
  options: { label: string; value: string }[];
}

export default function SelectEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: SelectEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [localFields, setLocalFields] = useState<SelectFields>({
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
    allowClear: false,
    showSearch: false,
    mode: "",
    options: [],
  });

  // --- useCollapse para Advanced ---
  const {
    activePanels: activeAdvancedPanels,
    setActivePanels: setActiveAdvancedPanels,
    validateAndOpen: validateAndOpenAdvanced,
  } = useCollapsePanels(
    [],
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

  // --- useCollapse para Options ---
  const {
    activePanels: activeOptionPanels,
    setActivePanels: setActiveOptionPanels,
    validateAndOpen: validateAndOpenOptions,
  } = useCollapsePanels([], [], ["errorOptions"]);

  const { errors, validateAndSave } = useInputValidation({
    ...localFields,
    id: localFields.inputId,
    onSave,
    buildCode: () =>
      buildInputCode(
        localFields,
        {
          allowClear: localFields.allowClear,
          showSearch: localFields.showSearch,
          mode: localFields.mode,
        },
        "Select"
      ).replace(
        "<Select ",
        `<Select ${localFields.options.length > 0 ? "" : ""}`
      ) +
      (localFields.options.length > 0
        ? `\n      ${localFields.options
            .map(
              (opt) =>
                `<Select.Option value="${opt.value}">${opt.label}</Select.Option>`
            )
            .join("\n      ")}\n    </Select>`
        : "</Select>"),
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

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      placeholder: matchAttr("placeholder"),
      inputId: matchAttr("id"),
      addonBefore: matchAttr("addonBefore"),
      addonAfter: matchAttr("addonAfter"),
      prefix: matchAttr("prefix"),
      suffix: matchAttr("suffix"),
      className: matchAttr("className"),
      disabled: matchBool("disabled"),
      readOnly: matchBool("readOnly"),
      autoFocus: matchBool("autoFocus"),
      allowClear: matchBool("allowClear"),
      showSearch: matchBool("showSearch"),
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
      mode:
        (codeBlock.match(/mode="(multiple|tags)"/)?.[1] as
          | "multiple"
          | "tags") || "",
      options: Array.from(
        codeBlock.matchAll(
          /<Select\.Option value="([^"]+)">([^<]+)<\/Select\.Option>/g
        )
      ).map((m) => ({ value: m[1], label: m[2] })),
    }));
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    // abrir panel Advanced si hay errores
    validateAndOpenAdvanced(currentErrors);
    // abrir panel Options si hay errores
    validateAndOpenOptions(currentErrors);

    const hasAnyErrors = Object.keys(currentErrors).some(
      (key) => currentErrors[key]
    );

    if (!hasAnyErrors) {
      onSave(
        buildInputCode(
          localFields,
          {
            allowClear: localFields.allowClear,
            showSearch: localFields.showSearch,
            mode: localFields.mode,
          },
          "Select"
        )
      );
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      title="Editar Select"
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
          ]}
        />

        <Collapse
          ghost
          activeKey={activeOptionPanels}
          onChange={(keys) => setActiveOptionPanels(keys as string[])}
        >
          <Panel header="Opciones" key="options">
            <OptionsFields
              options={localFields.options}
              mode={localFields.mode}
              setMode={(v) => setLocalFields((prev) => ({ ...prev, mode: v }))}
              setOptions={(opts) =>
                setLocalFields((prev) => ({ ...prev, options: opts }))
              }
              errors={errors}
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
                "addonBefore",
                "addonAfter",
                "prefix",
                "suffix",
                "inputId",
                "className",
                "size",
                "status",
                "allowClear",
                "showSearch",
              ]}
              allowClear={localFields.allowClear}
              setAllowClear={(v) =>
                setLocalFields((prev) => ({ ...prev, allowClear: v }))
              }
              showSearch={localFields.showSearch}
              setShowSearch={(v) =>
                setLocalFields((prev) => ({ ...prev, showSearch: v }))
              }
              antdVersion={antdVersion}
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
