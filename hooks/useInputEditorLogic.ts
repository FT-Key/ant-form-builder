// hooks/useInputEditorLogic.ts
import { useState, useCallback, useMemo } from "react";

export interface SimpleInputItem {
  id: string;
  label: string;
}

export function useInputEditorLogic(
  inputs: SimpleInputItem[],
  getCodeBlockByInputId: (id: string) => string | undefined,
  onUpdateInput: (id: string, newCodeBlock: string) => void
) {
  const [editingInputId, setEditingInputId] = useState<string | null>(null);

  const openEditor = useCallback((id: string) => {
    setEditingInputId(id);
  }, []);

  const closeEditor = useCallback(() => {
    setEditingInputId(null);
  }, []);

  const saveEditor = useCallback(
    (newCodeBlock: string) => {
      if (!editingInputId) return;
      onUpdateInput(editingInputId, newCodeBlock);
      setEditingInputId(null);
    },
    [editingInputId, onUpdateInput]
  );

  const codeBlock = useMemo(() => {
    if (!editingInputId) return "";
    return getCodeBlockByInputId(editingInputId) ?? "";
  }, [editingInputId, getCodeBlockByInputId]);

  return {
    editingInputId,
    codeBlock,
    openEditor,
    closeEditor,
    saveEditor,
  };
}
