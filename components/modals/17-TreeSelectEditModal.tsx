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

interface TreeSelectEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface TreeNode {
  title: string;
  value: string;
  key?: string;
  children?: TreeNode[];
  expanded?: boolean;
}

function parseTreeData(code: string): TreeNode[] {
  const match = code.match(/treeData=\{(\[[\s\S]*?\])\}/);
  if (!match) return [];
  try {
    const raw = match[1].replace(/'/g, '"');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type SerializableTreeNode = Omit<TreeNode, "expanded">;

function clean(arr: TreeNode[]): SerializableTreeNode[] {
  return arr.map(({ expanded, ...node }) => ({
    ...node,
    children: node.children ? clean(node.children) : undefined,
  }));
}

function serializeTreeData(nodes: TreeNode[]): string {
  return JSON.stringify(clean(nodes), null, 2);
}

function TreeNodeEditor({
  node,
  onChange,
  onAddSibling,
  onAddChild,
  onDelete,
  level = 0,
}: {
  node: TreeNode;
  onChange: (newNode: TreeNode) => void;
  onAddSibling: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  level?: number;
}) {
  const toggleExpanded = () => onChange({ ...node, expanded: !node.expanded });

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...node, value: e.target.value });
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...node, title: e.target.value });

  const hasChildren = node.children && node.children.length > 0;

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
          node.expanded ? (
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
          value={node.value}
          onChange={onChangeValue}
        />
        <Input
          placeholder="title"
          size="small"
          style={{ width: 120 }}
          value={node.title}
          onChange={onChangeTitle}
        />

        <Button
          type="text"
          size="small"
          onClick={onAddChild}
          icon={<PlusOutlined />}
          title="Agregar hijo"
        />
        <Button
          type="text"
          size="small"
          onClick={onAddSibling}
          icon={<PlusOutlined />}
          title="Agregar hermano"
        />
        <Button
          type="text"
          size="small"
          danger
          onClick={onDelete}
          icon={<DeleteOutlined />}
          title="Eliminar"
        />
      </Space>

      {hasChildren && node.expanded && (
        <div style={{ marginTop: 4 }}>
          {node.children!.map((child, i) => (
            <TreeNodeEditor
              key={i}
              node={child}
              level={level + 1}
              onChange={(newChild) => {
                const newChildren = [...(node.children ?? [])];
                newChildren[i] = newChild;
                onChange({ ...node, children: newChildren });
              }}
              onAddSibling={() => {
                const newChildren = [...(node.children ?? [])];
                newChildren.splice(i + 1, 0, {
                  title: "",
                  value: "",
                  expanded: false,
                });
                onChange({ ...node, children: newChildren });
              }}
              onAddChild={() => {
                const newChildren = [...(node.children ?? [])];
                newChildren[i] = {
                  ...newChildren[i],
                  children: [
                    ...(newChildren[i].children ?? []),
                    { title: "", value: "", expanded: false },
                  ],
                  expanded: true,
                };
                onChange({ ...node, children: newChildren });
              }}
              onDelete={() => {
                const newChildren = [...(node.children ?? [])];
                newChildren.splice(i, 1);
                onChange({ ...node, children: newChildren });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeSelectEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TreeSelectEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [allowClear, setAllowClear] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [bordered, setBordered] = useState(true);
  const [treeCheckable, setTreeCheckable] = useState(false);
  const [treeCheckStrictly, setTreeCheckStrictly] = useState(false);
  const [size, setSize] = useState<"small" | "middle" | "large">("middle");
  const [inputId, setInputId] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const [multiple, setMultiple] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [treeDefaultExpandAll, setTreeDefaultExpandAll] = useState(false);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

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
    setTreeCheckStrictly(codeBlock.includes("treeCheckStrictly"));
    setTreeCheckable(
      codeBlock.includes("treeCheckable") ||
        codeBlock.includes("treeCheckStrictly")
    );

    const sizeMatch = codeBlock.match(/size="(small|middle|large)"/)?.[1];
    setSize(
      sizeMatch === "small" || sizeMatch === "large" ? sizeMatch : "middle"
    );

    setMultiple(codeBlock.includes("multiple"));
    setShowSearch(codeBlock.includes("showSearch"));
    setTreeDefaultExpandAll(codeBlock.includes("treeDefaultExpandAll"));

    const treeExpandedKeysMatch = codeBlock.match(
      /treeExpandedKeys=\{\[([^\]]+)\]\}/
    );
    setTreeExpandedKeys(treeExpandedKeysMatch?.[1]);

    setLoading(codeBlock.includes("loading"));

    const parsed = parseTreeData(codeBlock);
    const withExpand = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) => ({
        ...n,
        expanded: false,
        children: n.children ? withExpand(n.children) : undefined,
      }));

    setTreeData(withExpand(parsed));
  }, [codeBlock]);

  const buildCode = () => {
    const props: string[] = [];

    if (placeholder) props.push(`placeholder="${placeholder}"`);
    if (!allowClear) props.push("allowClear={false}");
    if (disabled) props.push("disabled");
    if (!bordered) props.push("bordered={false}");
    if (treeCheckStrictly) props.push("treeCheckStrictly");
    if (treeCheckable && !treeCheckStrictly) props.push("treeCheckable");
    if (size !== "middle") props.push(`size="${size}"`);
    if (multiple) props.push("multiple");
    if (showSearch) props.push("showSearch");
    if (treeDefaultExpandAll) props.push("treeDefaultExpandAll");
    if (treeExpandedKeys)
      props.push(`treeExpandedKeys={[${treeExpandedKeys}]}`);
    if (loading) props.push("loading");
    if (inputId) props.push(`id="${inputId}"`);

    return `<Form.Item label="${label}" name="${name}">
  <TreeSelect treeData={${serializeTreeData(treeData)}} ${props.join(" ")} />
</Form.Item>`;
  };

  return (
    <Modal
      open={open}
      title="Editar TreeSelect"
      onCancel={onCancel}
      onOk={() => onSave(buildCode())}
      destroyOnClose
      width={720}
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
          <Panel header="treeData" key="treeData">
            {treeData.map((node, i) => (
              <TreeNodeEditor
                key={i}
                node={node}
                onChange={(newNode) => {
                  const newTree = [...treeData];
                  newTree[i] = newNode;
                  setTreeData(newTree);
                }}
                onAddSibling={() => {
                  const newTree = [...treeData];
                  newTree.splice(i + 1, 0, {
                    title: "",
                    value: "",
                    expanded: false,
                  });
                  setTreeData(newTree);
                }}
                onAddChild={() => {
                  const nodeToUpdate = { ...treeData[i] };
                  nodeToUpdate.children = [
                    ...(nodeToUpdate.children ?? []),
                    { title: "", value: "", expanded: false },
                  ];
                  nodeToUpdate.expanded = true;
                  const newTree = [...treeData];
                  newTree[i] = nodeToUpdate;
                  setTreeData(newTree);
                }}
                onDelete={() => {
                  const newTree = [...treeData];
                  newTree.splice(i, 1);
                  setTreeData(newTree);
                }}
              />
            ))}
            <Button
              type="dashed"
              block
              onClick={() =>
                setTreeData([
                  ...treeData,
                  { title: "", value: "", expanded: false },
                ])
              }
              icon={<PlusOutlined />}
            >
              Agregar nodo raíz
            </Button>
          </Panel>

          <Panel header="Opciones avanzadas" key="advanced">
            <Checkbox
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
            >
              allowClear
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            >
              disabled
            </Checkbox>
            <Checkbox
              checked={bordered}
              onChange={(e) => setBordered(e.target.checked)}
            >
              bordered
            </Checkbox>
            <Checkbox
              checked={treeCheckable}
              onChange={(e) => setTreeCheckable(e.target.checked)}
            >
              treeCheckable
            </Checkbox>
            <Checkbox
              checked={treeCheckStrictly}
              onChange={(e) => setTreeCheckStrictly(e.target.checked)}
            >
              treeCheckStrictly
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
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
            >
              multiple
            </Checkbox>
            <Checkbox
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
            >
              showSearch
            </Checkbox>
            <Checkbox
              checked={treeDefaultExpandAll}
              onChange={(e) => setTreeDefaultExpandAll(e.target.checked)}
            >
              treeDefaultExpandAll
            </Checkbox>
            <Input
              addonBefore="treeExpandedKeys"
              value={treeExpandedKeys ?? ""}
              onChange={(e) => setTreeExpandedKeys(e.target.value)}
              placeholder="Ej: 'key1', 'key2'"
              className="mb-2"
            />
            <Checkbox
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
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
