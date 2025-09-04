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
    className: "",
    allowClear: false,
    showSearch: false,
    mode: "",
    options: [],
  });

  // --- Collapse hook único ---
  const { activePanels, setActivePanels, validateAndOpen } = useCollapsePanels(
    ["errorLabel", "errorName"], // errores básicos
    [
      "errorId",
      "errorClassName",
      "errorStatus",
      "errorAllowClear",
      "errorShowSearch",
    ], // errores avanzados
    ["errorOption"] // errores de opciones
  );

  // --- Input validation hook ---
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

  // --- Inicializar campos al abrir modal ---
  useEffect(() => {
    if (!open) return;

    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ||
      codeBlock.match(new RegExp(`${attr}='([^']+)'`))?.[1] ||
      "";

    const matchBool = (attr: string) =>
      new RegExp(`\\b${attr}\\b`).test(codeBlock);

    const rawPlacement = matchAttr("placement");
    const validPlacements = [
      "bottomLeft",
      "bottomRight",
      "topLeft",
      "topRight",
    ] as const;

    setLocalFields((prev) => ({
      ...prev,
      label: matchAttr("label"),
      name: matchAttr("name"),
      placeholder: matchAttr("placeholder"),
      inputId: matchAttr("id"),
      className: matchAttr("className"),
      disabled: matchBool("disabled"),
      readOnly: matchBool("readOnly"),
      autoFocus: matchBool("autoFocus"),
      allowClear: matchBool("allowClear"),
      showSearch: matchBool("showSearch"),
      mode:
        (codeBlock.match(/mode="(multiple|tags)"/)?.[1] as
          | "multiple"
          | "tags") || "",
      filterOption: !/filterOption={false}/.test(codeBlock),
      loading: matchBool("loading"),
      optionFilterProp: matchAttr("optionFilterProp"),
      maxTagCount: Number(matchAttr("maxTagCount")) || undefined,
      dropdownMatchSelectWidth: !/dropdownMatchSelectWidth={false}/.test(
        codeBlock
      ),
      labelInValue: matchBool("labelInValue"),
      optionLabelProp: matchAttr("optionLabelProp"),
      defaultActiveFirstOption: !/defaultActiveFirstOption={false}/.test(
        codeBlock
      ),
      virtual: !/virtual={false}/.test(codeBlock),
      bordered: !/bordered={false}/.test(codeBlock),
      showArrow: !/showArrow={false}/.test(codeBlock),
      open: matchBool("open"),
      notFoundContent: matchAttr("notFoundContent"),
      dropdownStyle: matchAttr("dropdownStyle"),
      dropdownClassName: matchAttr("dropdownClassName"),
      listHeight: Number(matchAttr("listHeight")) || undefined,
      listItemHeight: Number(matchAttr("listItemHeight")) || undefined,
      placement: validPlacements.includes(rawPlacement as any)
        ? (rawPlacement as (typeof validPlacements)[number])
        : undefined,
      options: Array.from(
        codeBlock.matchAll(
          /<Select\.Option value="([^"]+)">([^<]+)<\/Select\.Option>/g
        )
      ).map((m) => ({ value: m[1], label: m[2] })),
    }));
  }, [open, codeBlock]);

  const handleSave = () => {
    const currentErrors = validateAndSave();

    // abrir paneles solo al guardar si hay errores
    validateAndOpen(currentErrors);

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
          activeKey={activePanels}
          onChange={(keys) => setActivePanels(keys as string[])}
        >
          <Panel header="Opciones" key="options">
            <OptionsFields
              options={localFields.options}
              setOptions={(opts) =>
                setLocalFields((prev) => ({ ...prev, options: opts }))
              }
              errors={errors}
            />
          </Panel>

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
                "allowClear",
                "showSearch",
                "filterOption",
                "loading",
                "optionFilterProp",
                "maxTagCount",
                "dropdownMatchSelectWidth",
                "labelInValue",
                "optionLabelProp",
                "defaultActiveFirstOption",
                "virtual",
                "bordered",
                "showArrow",
                "open",
                "notFoundContent",
                "dropdownStyle",
                "dropdownClassName",
                "listHeight",
                "listItemHeight",
                "placement",
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
