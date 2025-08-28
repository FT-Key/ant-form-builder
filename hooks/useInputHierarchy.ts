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

function getRootName(block: string): string | null {
  const m = block.trim().match(/^<\s*([A-Za-z0-9_.]+)/);
  return m ? m[1] : null;
}

function extractChildInputs(parentId: string, code: string): ChildItem[] {
  // Detectamos el tipo de componente raíz
  const rootName = getRootName(code);

  // Si el padre es Form.Item, NO devolvemos hijos (no anidamos más)
  if (rootName === "Form.Item") {
    return [];
  }

  // Solo buscamos hijos <Form.Item> anidados
  const childRegex = /<Form\.Item([\s\S]*?)>([\s\S]*?)<\/Form\.Item>/g;

  const labelRegex = /label="([^"]+)"/;
  const nameRegex = /name="([^"]+)"/;

  const children: ChildItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = childRegex.exec(code))) {
    const fullTagContent = match[0];
    const tagProps = match[1];

    // Extraemos label o name para mostrar como etiqueta
    const labelMatch = tagProps.match(labelRegex);
    const nameMatch = tagProps.match(nameRegex);
    const label = labelMatch?.[1] || nameMatch?.[1] || "Form.Item";

    // Generamos id hijo basado en id padre y label
    const childId = `${parentId}::${label}`;

    children.push({
      id: childId,
      label,
      code: fullTagContent,
    });
  }

  return children;
}

export function useInputHierarchy(inputs: InputItem[]) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const hierarchy = useMemo(() => {
    const map: Record<string, ChildItem[]> = {};

    inputs.forEach(({ id, code }) => {
      if (!code) return;

      const children = extractChildInputs(id, code);

      // Sólo asignamos si tiene hijos
      if (children.length > 0) {
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
