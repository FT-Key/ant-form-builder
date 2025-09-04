// hooks/useInputValidation.ts
import { useState } from "react";
import * as validators from "@/utils/validators";
import { BaseInputFields } from "@/types/BaseInputFields";

export interface ValidationParams extends BaseInputFields {
  onSave: (code: string) => void;
  buildCode: () => string;
}

export function useInputValidation(params: ValidationParams) {
  const { onSave, buildCode, ...fields } = params;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSave = (): Record<string, string> => {
    let hasError = false;
    const newErrors: Record<string, string> = {};
    const code = buildCode();

    const checkField = (field: string, value: any, validator: Function) => {
      const res = validator(value);
      newErrors[field] = res.valid ? "" : res.error || "";
      if (!res.valid) hasError = true;
    };

    // ---- Strings ----
    if (fields.innerText !== undefined)
      checkField(
        "errorInnerText",
        fields.innerText,
        validators.validateInnerText
      );
    if (fields.label !== undefined)
      checkField("errorLabel", fields.label, validators.validateLabel);
    if (fields.name !== undefined)
      checkField("errorName", fields.name, validators.validateName);
    if (fields.placeholder !== undefined)
      checkField(
        "errorPlaceholder",
        fields.placeholder,
        validators.validatePlaceholder
      );
    if (fields.addonBefore !== undefined)
      checkField(
        "errorAddonBefore",
        fields.addonBefore,
        validators.validateAddonValue
      );
    if (fields.addonAfter !== undefined)
      checkField(
        "errorAddonAfter",
        fields.addonAfter,
        validators.validateAddonValue
      );
    if (fields.prefix !== undefined)
      checkField("errorPrefix", fields.prefix, validators.validateAddonValue);
    if (fields.suffix !== undefined)
      checkField("errorSuffix", fields.suffix, validators.validateAddonValue);
    if (fields.optionFilterProp !== undefined)
      checkField(
        "errorOptionFilterProp",
        fields.optionFilterProp,
        validators.validateOptionFilterProp
      );
    if (fields.optionLabelProp !== undefined)
      checkField(
        "errorOptionLabelProp",
        fields.optionLabelProp,
        validators.validateOptionLabelProp
      );
    if (fields.notFoundContent !== undefined)
      checkField(
        "errorNotFoundContent",
        fields.notFoundContent,
        validators.validateStringProp
      );
    if (fields.dropdownStyle !== undefined)
      checkField(
        "errorDropdownStyle",
        fields.dropdownStyle,
        validators.validateStringProp
      );
    if (fields.dropdownClassName !== undefined)
      checkField(
        "errorDropdownClassName",
        fields.dropdownClassName,
        validators.validateClassName
      );

    // ---- Numéricos ----
    if (fields.minLength !== undefined)
      checkField(
        "errorMinLength",
        fields.minLength,
        validators.validateMinLength
      );
    if (fields.maxLength !== undefined)
      checkField(
        "errorMaxLength",
        fields.maxLength,
        validators.validateMaxLength
      );
    if (fields.min !== undefined)
      checkField("errorMin", fields.min, validators.validateMin);
    if (fields.max !== undefined)
      checkField("errorMax", fields.max, validators.validateMax);
    if (fields.maxTagCount !== undefined)
      checkField(
        "errorMaxTagCount",
        fields.maxTagCount,
        validators.validatePositiveInteger
      );
    if (fields.listHeight !== undefined)
      checkField(
        "errorListHeight",
        fields.listHeight,
        validators.validatePositiveInteger
      );
    if (fields.listItemHeight !== undefined)
      checkField(
        "errorListItemHeight",
        fields.listItemHeight,
        validators.validatePositiveInteger
      );
    if (fields.step !== undefined)
      checkField("errorStep", fields.step, validators.validatePositiveNumber);
    if (fields.precision !== undefined)
      checkField(
        "errorPrecision",
        fields.precision,
        validators.validatePositiveInteger
      );
    if (fields.minuteStep !== undefined)
      checkField(
        "errorMinuteStep",
        fields.minuteStep,
        validators.validateMinuteStep
      );
    if (fields.secondStep !== undefined)
      checkField(
        "errorSecondStep",
        fields.secondStep,
        validators.validateSecondStep
      );
    // ---- RadioGroupAdvancedFields ----
    if (fields.optionType !== undefined) {
      checkField(
        "errorOptionType",
        fields.optionType,
        validators.validateOptionType
      );
    }
    if (fields.buttonStyle !== undefined) {
      checkField(
        "errorButtonStyle",
        fields.buttonStyle,
        validators.validateButtonStyle
      );
    }
    if (fields.size !== undefined && fields.optionType === "button") {
      checkField("errorButtonSize", fields.size, validators.validateButtonSize);
    }

    // ---- Booleans ----
    const booleanFields: (keyof ValidationParams)[] = [
      "block",
      "danger",
      "loading",
      "disabled",
      "visibilityToggle",
      "autoSize",
      "showCount",
      "allowClear",
      "showSearch",
      "filterOption",
      "dropdownMatchSelectWidth",
      "labelInValue",
      "defaultActiveFirstOption",
      "virtual",
      "bordered",
      "showArrow",
      "open",
      "keyboard",
      "controls",
      "dots",
      "range",
      "allowHalf",
      "tooltips",
      "use12Hours",
      "checked",
      "indeterminate",
    ];

    booleanFields.forEach((key) => {
      const value = fields[key as keyof typeof fields];
      if (value !== undefined) {
        let validatorFn = validators.validateCheckbox;
        if (key === "checked") validatorFn = validators.validateChecked;
        if (key === "indeterminate")
          validatorFn = validators.validateIndeterminate;

        const { valid, error } = validatorFn(value);

        const errorKey = `error${
          String(key)[0].toUpperCase() + String(key).slice(1)
        }`;
        newErrors[errorKey] = valid ? "" : error || "";

        if (!valid) hasError = true;
      }
    });

    // ---- Selects restringidos ----
    if (fields.size !== undefined)
      checkField("errorSize", fields.size, validators.validateSize);
    if (fields.status !== undefined)
      checkField("errorStatus", fields.status, validators.validateStatus);
    if (fields.placement !== undefined)
      checkField(
        "errorPlacement",
        fields.placement,
        validators.validatePlacement
      );
    if (fields.mode !== undefined)
      checkField("errorMode", fields.mode, validators.validateSelectMode);
    if (fields.formatDate !== undefined)
      checkField(
        "errorFormatDate",
        fields.formatDate,
        validators.validateFormatDate
      );
    if (fields.formatTime !== undefined)
      checkField(
        "errorFormatTime",
        fields.formatTime,
        validators.validateFormatTime
      );

    // ---- Button ----
    if (fields.type !== undefined)
      checkField("errorButtonType", fields.type, validators.validateButtonType);
    if (fields.label !== undefined && fields.type !== undefined)
      checkField(
        "errorButtonLabel",
        fields.label,
        validators.validateButtonLabel
      );
    if (fields.size !== undefined && fields.type !== undefined)
      checkField("errorButtonSize", fields.size, validators.validateButtonSize);

    // ---- Switch específicos ----
    if (fields.checkedChildren !== undefined)
      checkField(
        "errorCheckedChildren",
        fields.checkedChildren,
        validators.validateCheckedChildren
      );

    if (fields.unCheckedChildren !== undefined)
      checkField(
        "errorUnCheckedChildren",
        fields.unCheckedChildren,
        validators.validateUnCheckedChildren
      );

    if (fields.switchSize !== undefined)
      checkField(
        "errorSwitchSize",
        fields.switchSize,
        validators.validateSwitchSize
      );

    // ---- Options de Select ----
    if (fields.options !== undefined) {
      const res = validators.validateOptionsArray(fields.options);
      if (!res.valid) {
        Object.assign(newErrors, res.errors);
        hasError = true;
      }
    }

    // ---- Id y className ----
    if (fields.id !== undefined)
      checkField("errorId", fields.id, validators.validateId);
    if (fields.className !== undefined)
      checkField(
        "errorClassName",
        fields.className,
        validators.validateClassName
      );

    setErrors(newErrors);

    if (!hasError) {
      onSave(code);
    }

    return newErrors;
  };

  return {
    errors,
    validateAndSave,
    setErrors,
  };
}
