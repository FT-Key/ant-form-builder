import { useState, useMemo } from "react";

interface InputItem {
  id: string;
  label: string;
  code: string;
}

interface ChildItem {
  id: string;
  label: string;
  code: string;
}

// Esta función extrae bloques hijos <Form.Item> dentro de un bloque padre, con id y label
function extractChildInputs(parentId: string, code: string): ChildItem[] {
  const childRegex = /<Form\.Item[\s\S]*?<\/Form\.Item>/g;
  const labelRegex = /label="([^"]+)"/;

  const children: ChildItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = childRegex.exec(code))) {
    const childCode = match[0];
    const labelMatch = childCode.match(labelRegex);
    const label = labelMatch ? labelMatch[1] : "Form.Item";

    // Generamos un ID hijo basado en el padre + índice o label para evitar conflictos
    const childId = `${parentId}::${label}`;

    children.push({
      id: childId,
      label,
      code: childCode,
    });
  }

  return children;
}

export function useInputHierarchy(inputs: InputItem[]) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Construye jerarquía: padreId -> hijos [{id,label,code}]
  const hierarchy = useMemo(() => {
    const map: Record<string, ChildItem[]> = {};

    inputs.forEach(({ id, code }) => {
      const children = extractChildInputs(id, code);
      if (children.length) {
        map[id] = children;
      }
    });

    return map;
  }, [inputs]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return { hierarchy, expanded, toggleExpand };
}
