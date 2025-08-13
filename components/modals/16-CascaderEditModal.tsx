"use client";

import {
  Modal,
  Input,
  InputNumber,
  Checkbox,
  Select,
  Collapse,
  Divider,
  Button,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { useAntdVersion } from "@/context/AntdVersionContext";
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

interface CascaderEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

type ExpandTrigger = "click" | "hover";

interface OptionNode {
  value: string;
  label: string;
  children?: OptionNode[];
  expanded?: boolean; // para toggle UI
}

// Función para parsear options desde el codeBlock, con reemplazo de comillas simples por dobles
function parseOptionsFromCode(code: string): OptionNode[] {
  const match = code.match(/options=\{(\[[\s\S]*?\])\}/);
  if (match && match[1]) {
    let rawOptions = match[1];

    // Reemplazo simple de comillas simples por dobles
    // IMPORTANTE: esta solución es simple y funciona para casos comunes como el tuyo,
    // pero podría fallar en casos con strings que contienen comillas internas complejas
    try {
      const jsonLike = rawOptions.replace(/'/g, '"');
      const parsed = JSON.parse(jsonLike);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // Si no se puede parsear, devolver vacío
      return [];
    }
  }
  return [];
}

function serializeOptions(options: OptionNode[]): string {
  return JSON.stringify(options, null, 2);
}

function OptionEditor({
  option,
  onChange,
  onAddSibling,
  onAddChild,
  onDelete,
  level = 0,
}: {
  option: OptionNode;
  onChange: (newOption: OptionNode) => void;
  onAddSibling: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  level?: number;
}) {
  const toggleExpanded = () => {
    onChange({ ...option, expanded: !option.expanded });
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...option, value: e.target.value });
  };
  const onChangeLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...option, label: e.target.value });
  };

  const hasChildren = option.children && option.children.length > 0;

  return (
    <div
      style={{
        marginLeft: level * 20,
        borderLeft: "1px solid #ddd",
        paddingLeft: 8,
        marginBottom: 8,
      }}
    >
      <Space align="start">
        {hasChildren ? (
          option.expanded ? (
            <DownOutlined
              onClick={toggleExpanded}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <RightOutlined
              onClick={toggleExpanded}
              style={{ cursor: "pointer" }}
            />
          )
        ) : (
          <span style={{ width: 14 }} />
        )}

        <Input
          placeholder="value"
          size="small"
          style={{ width: 120 }}
          value={option.value}
          onChange={onChangeValue}
        />
        <Input
          placeholder="label"
          size="small"
          style={{ width: 120 }}
          value={option.label}
          onChange={onChangeLabel}
        />

        <Button
          type="text"
          size="small"
          onClick={onAddChild}
          title="Agregar hijo"
          icon={<PlusOutlined />}
        />
        <Button
          type="text"
          size="small"
          onClick={onAddSibling}
          title="Agregar opción hermana"
          icon={<PlusOutlined />}
        />
        <Button
          type="text"
          size="small"
          danger
          onClick={onDelete}
          title="Eliminar opción"
          icon={<DeleteOutlined />}
        />
      </Space>

      {hasChildren && option.expanded && (
        <div style={{ marginTop: 4 }}>
          {option.children!.map((child, i) => (
            <OptionEditor
              key={i}
              option={child}
              level={level + 1}
              onChange={(newChild) => {
                const newChildren = [...(option.children ?? [])];
                newChildren[i] = newChild;
                onChange({ ...option, children: newChildren });
              }}
              onAddSibling={() => {
                const newChildren = [...(option.children ?? [])];
                newChildren.splice(i + 1, 0, {
                  value: "",
                  label: "",
                  expanded: false,
                });
                onChange({ ...option, children: newChildren });
              }}
              onAddChild={() => {
                const newChildren = [...(option.children ?? [])];
                newChildren[i] = {
                  ...newChildren[i],
                  children: [
                    ...(newChildren[i].children ?? []),
                    { value: "", label: "", expanded: false },
                  ],
                  expanded: true,
                };
                onChange({ ...option, children: newChildren });
              }}
              onDelete={() => {
                const newChildren = [...(option.children ?? [])];
                newChildren.splice(i, 1);
                onChange({ ...option, children: newChildren });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CascaderEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: CascaderEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [allowClear, setAllowClear] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [bordered, setBordered] = useState(true);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [inputId, setInputId] = useState("");

  const [changeOnSelect, setChangeOnSelect] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState<ExpandTrigger>("click");
  const [multiple, setMultiple] = useState(false);
  const [maxTagCount, setMaxTagCount] = useState<number | undefined>(undefined);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState<OptionNode[]>([]);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";

    setLabel(matchAttr("label"));
    setName(matchAttr("name"));
    setPlaceholder(matchAttr("placeholder"));
    setInputId(matchAttr("id"));

    setAllowClear(!codeBlock.includes("allowClear={false}"));
    setDisabled(codeBlock.includes("disabled"));
    setBordered(!codeBlock.includes("bordered={false}"));

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );

    setChangeOnSelect(codeBlock.includes("changeOnSelect"));
    if (codeBlock.includes('expandTrigger="hover"')) {
      setExpandTrigger("hover");
    } else {
      setExpandTrigger("click");
    }
    setMultiple(codeBlock.includes("multiple"));
    const maxTagMatch = codeBlock.match(/maxTagCount={(\d+)}/);
    setMaxTagCount(maxTagMatch ? parseInt(maxTagMatch[1]) : undefined);
    setShowSearch(codeBlock.includes("showSearch"));
    setLoading(codeBlock.includes("loading"));

    const parsedOptions = parseOptionsFromCode(codeBlock);

    const addExpandedFlag = (nodes: OptionNode[]): OptionNode[] =>
      nodes.map((n) => ({
        ...n,
        expanded: false,
        children: n.children ? addExpandedFlag(n.children) : undefined,
      }));

    setOptions(addExpandedFlag(parsedOptions));
  }, [codeBlock]);

  const updateOptionAt = (index: number, newOption: OptionNode) => {
    const newOpts = [...options];
    newOpts[index] = newOption;
    setOptions(newOpts);
  };

  const addRootOption = () => {
    setOptions([...options, { value: "", label: "", expanded: false }]);
  };

  const deleteRootOption = (index: number) => {
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  const buildCode = () => {
    const cleanOptions = (opts: OptionNode[]): any[] =>
      opts.map(({ expanded, ...rest }) => ({
        ...rest,
        children: rest.children ? cleanOptions(rest.children) : undefined,
      }));

    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (!allowClear) props.push(`allowClear={false}`);
    if (disabled) props.push(`disabled`);
    if (!bordered) props.push(`bordered={false}`);
    if (size !== "middle") props.push(`size="${size}"`);
    if (changeOnSelect) props.push(`changeOnSelect`);
    if (expandTrigger !== "click")
      props.push(`expandTrigger="${expandTrigger}"`);
    if (multiple) props.push(`multiple`);
    if (maxTagCount !== undefined) props.push(`maxTagCount={${maxTagCount}}`);
    if (showSearch) props.push(`showSearch`);
    if (loading) props.push(`loading`);
    if (inputId) props.push(`id="${inputId}"`);

    const optionsStr = JSON.stringify(cleanOptions(options), null, 2);

    return `<Form.Item label="${label}" name="${name}">
  <Cascader options={${optionsStr}} ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar Cascader"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      okText="Guardar"
      cancelText="Cancelar"
      width={720}
      destroyOnClose
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <Input
          addonBefore="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Input
          addonBefore="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          addonBefore="placeholder"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
        />

        <Divider />

        <Collapse ghost>
          <Panel header="Opciones" key="options">
            {options.map((opt, i) => (
              <OptionEditor
                key={i}
                option={opt}
                onChange={(newOpt) => updateOptionAt(i, newOpt)}
                onAddSibling={() => {
                  const newOpts = [...options];
                  newOpts.splice(i + 1, 0, {
                    value: "",
                    label: "",
                    expanded: false,
                  });
                  setOptions(newOpts);
                }}
                onAddChild={() => {
                  const newOpts = [...options];
                  const optToUpdate = { ...newOpts[i] };
                  optToUpdate.children = [
                    ...(optToUpdate.children ?? []),
                    { value: "", label: "", expanded: false },
                  ];
                  optToUpdate.expanded = true;
                  newOpts[i] = optToUpdate;
                  setOptions(newOpts);
                }}
                onDelete={() => deleteRootOption(i)}
              />
            ))}
            <Button
              type="dashed"
              block
              onClick={addRootOption}
              icon={<PlusOutlined />}
            >
              Agregar opción raíz
            </Button>
          </Panel>

          <Panel header="Opciones avanzadas" key="advanced">
            <Checkbox
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
              className="mb-2"
            >
              allowClear
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={bordered}
              onChange={(e) => setBordered(e.target.checked)}
              className="mb-2"
            >
              bordered
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">Tamaño</label>
              <Select value={size} onChange={setSize} style={{ width: "100%" }}>
                <Option value="small">small</Option>
                <Option value="middle">middle</Option>
                <Option value="large">large</Option>
              </Select>
            </div>

            <Checkbox
              checked={changeOnSelect}
              onChange={(e) => setChangeOnSelect(e.target.checked)}
              className="mb-2"
            >
              changeOnSelect
            </Checkbox>

            <div className="mb-2">
              <label className="block mb-1">expandTrigger</label>
              <Select
                value={expandTrigger}
                onChange={setExpandTrigger}
                style={{ width: "100%" }}
              >
                <Option value="click">click</Option>
                <Option value="hover">hover</Option>
              </Select>
            </div>

            <Checkbox
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
              className="mb-2"
            >
              multiple
            </Checkbox>

            <InputNumber
              style={{ width: "100%" }}
              value={maxTagCount}
              onChange={(val) => setMaxTagCount(val ?? undefined)}
              placeholder="maxTagCount"
              addonBefore="maxTagCount"
              className="mb-2"
              min={0}
            />

            <Checkbox
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
              className="mb-2"
            >
              showSearch
            </Checkbox>

            <Checkbox
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="mb-2"
            >
              loading
            </Checkbox>

            <Input
              addonBefore="id"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="mb-2"
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
