"use client";

import { Modal, Input, Collapse, Divider, Button, Space, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAntdVersion } from "@/context/AntdVersionContext";

const { Panel } = Collapse;

interface TransferEditModalProps {
  open: boolean;
  codeBlock: string;
  onCancel: () => void;
  onSave: (updatedCode: string) => void;
}

interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export default function TransferEditModal({
  open,
  codeBlock,
  onCancel,
  onSave,
}: TransferEditModalProps) {
  const { antdVersion } = useAntdVersion();

  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [inputId, setInputId] = useState("");
  const [oneWay, setOneWay] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [options, setOptions] = useState<TransferItem[]>([]);

  useEffect(() => {
    const matchAttr = (attr: string) =>
      codeBlock.match(new RegExp(`${attr}="([^"]+)"`))?.[1] || "";

    const hiddenMatch = codeBlock.match(
      /<Form\.Item[^>]*name="([^"]+)"[^>]*hidden>/
    );
    const extractedName = hiddenMatch?.[1] || matchAttr("name");

    // Extraemos el bloque de props dentro del <Transfer ... />
    const transferMatch = codeBlock.match(/<Transfer([\s\S]*?)\/?>/);
    let transferProps = transferMatch?.[1] || "";

    // Esta función elimina el contenido del dataSource={...} del string transferProps
    // para no confundir "disabled" dentro de dataSource con prop de Transfer
    const removeDataSourceContent = (str: string) => {
      // Busca dataSource={...} incluyendo llaves anidadas, no trivial en regex, usamos balance simple:
      // Simplificación: removemos desde dataSource={ hasta el cierre del arreglo correspondiente }
      const start = str.indexOf("dataSource={");
      if (start === -1) return str;

      let openBrackets = 0;
      let end = -1;
      for (let i = start + "dataSource={".length; i < str.length; i++) {
        if (str[i] === "[") openBrackets++;
        if (str[i] === "]") {
          openBrackets--;
          if (openBrackets === 0) {
            // Buscar cierre final }
            let j = i + 1;
            while (j < str.length && str[j] !== "}") j++;
            end = j;
            break;
          }
        }
      }
      if (end === -1) return str; // No encontró cierre, no hace nada

      // Elimina la parte dataSource={ ... }
      return str.slice(0, start) + str.slice(end + 1);
    };

    const cleanedProps = removeDataSourceContent(transferProps);

    // Verificamos props booleanas presentes sin importar valor (ej: disabled, disabled={true}, disabled={false} NO)
    // Solo detectamos si está como atributo sin valor o con valor true
    const hasProp = (propName: string) => {
      // Regex para detectar disabled o disabled={true} o disabled={someVar}
      // Excluye disabled={false} con lookahead negativo
      const regex = new RegExp(
        `\\b${propName}\\b(\\s*=\\s*\\{\\s*(true)\\s*\\})?|\\b${propName}\\b(?!\\s*=)`,
        "i"
      );
      return regex.test(cleanedProps);
    };

    const matchData = codeBlock.match(/dataSource=\{(\[[\s\S]*?\])\}/);
    let parsed: TransferItem[] = [];
    if (matchData?.[1]) {
      try {
        parsed = JSON.parse(matchData[1].replace(/'/g, '"'));
      } catch {
        // Ignorar error de parseo
      }
    }

    setOptions(parsed);
    setLabel(matchAttr("label"));
    setName(extractedName);
    setInputId(matchAttr("id"));
    setOneWay(hasProp("oneWay"));
    setDisabled(hasProp("disabled"));
    setShowSearch(hasProp("showSearch"));
  }, [codeBlock]);

  const updateOption = (
    index: number,
    key: keyof TransferItem,
    value: string | boolean
  ) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [key]: value };
    setOptions(updated);
  };

  const buildCode = () => {
    const props: string[] = [];
    // No ponemos id en Transfer (porque no acepta esa prop)
    if (oneWay) props.push("oneWay");
    if (disabled) props.push("disabled");
    if (showSearch) props.push("showSearch");

    const dataStr = JSON.stringify(options, null, 2);

    // Puedes poner id en Form.Item si querés
    const formItemId = inputId ? ` id="${inputId}"` : "";

    return `<Form.Item label="${label}"${formItemId}>
  <Transfer
    dataSource={${dataStr}}
    ${props.join(" ")}
    targetKeys={[]}
    render={item => item.title}
    onChange={(keys) => {
      const form = document.forms[0].__antd_form__;
      if (form) {
        form.setFieldsValue({ ${name}: keys });
      }
    }}
  />
</Form.Item>
<Form.Item name="${name}" hidden>
  <Input />
</Form.Item>`;
  };

  const handleSave = () => {
    if (!name) {
      alert("El campo 'name' es obligatorio para Transfer.");
      return;
    }
    onSave(buildCode());
  };

  return (
    <Modal
      open={open}
      title="Editar Transfer"
      onCancel={onCancel}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
      width={720}
    >
      <div className="space-y-4">
        <Divider>Campos básicos</Divider>

        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          addonBefore="label"
        />

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          addonBefore="name"
        />

        <Divider />
        <Collapse ghost>
          <Panel header="Opciones (ítems de lista)" key="1">
            {options.map((opt, i) => (
              <Space key={i} direction="vertical" className="w-full mb-2">
                <Input
                  addonBefore="key"
                  value={opt.key}
                  onChange={(e) => updateOption(i, "key", e.target.value)}
                />
                <Input
                  addonBefore="title"
                  value={opt.title}
                  onChange={(e) => updateOption(i, "title", e.target.value)}
                />
                <Input
                  addonBefore="description"
                  value={opt.description || ""}
                  onChange={(e) =>
                    updateOption(i, "description", e.target.value)
                  }
                />
                <Checkbox
                  checked={opt.disabled ?? false}
                  onChange={(e) =>
                    updateOption(i, "disabled", e.target.checked)
                  }
                >
                  disabled
                </Checkbox>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                >
                  Eliminar opción
                </Button>
                <Divider />
              </Space>
            ))}
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() =>
                setOptions([
                  ...options,
                  { key: "", title: "", description: "", disabled: false },
                ])
              }
            >
              Agregar ítem
            </Button>
          </Panel>

          <Panel header="Opciones avanzadas" key="2">
            <Checkbox
              checked={oneWay}
              onChange={(e) => setOneWay(e.target.checked)}
              className="mb-2"
            >
              oneWay
            </Checkbox>
            <Checkbox
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
              className="mb-2"
            >
              showSearch
            </Checkbox>
            <Checkbox
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="mb-2"
            >
              disabled
            </Checkbox>
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              addonBefore="id"
              className="mb-2"
            />
          </Panel>
        </Collapse>
      </div>
    </Modal>
  );
}
