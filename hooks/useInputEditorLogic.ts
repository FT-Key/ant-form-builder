import { useState, useCallback, useEffect } from "react";

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
  const [localCodeBlock, setLocalCodeBlock] = useState<string>("");

  // Cuando abres editor, carga el código actual para editarlo localmente
  const openEditor = useCallback(
    (id: string) => {
      setEditingInputId(id);
      const code = getCodeBlockByInputId(id) || "";
      setLocalCodeBlock(code);
    },
    [getCodeBlockByInputId]
  );

  const closeEditor = useCallback(() => {
    setEditingInputId(null);
    setLocalCodeBlock("");
  }, []);

  // Actualiza localCodeBlock mientras escribes en modal
  const updateLocalCodeBlock = useCallback((newCode: string) => {
    setLocalCodeBlock(newCode);
  }, []);

  // Guarda la edición llamando a onUpdateInput con el código local
  const saveEditor = useCallback(
    (updatedCode: string) => {
      if (!editingInputId) return;
      onUpdateInput(editingInputId, updatedCode);
      closeEditor();
    },
    [editingInputId, onUpdateInput, closeEditor]
  );

  // Si cambias de input que editas (editingInputId), sincroniza localCodeBlock
  useEffect(() => {
    if (editingInputId) {
      const code = getCodeBlockByInputId(editingInputId) || "";
      setLocalCodeBlock(code);
    } else {
      setLocalCodeBlock("");
    }
  }, [editingInputId, getCodeBlockByInputId]);

  return {
    editingInputId,
    codeBlock: localCodeBlock,
    openEditor,
    closeEditor,
    saveEditor,
    updateLocalCodeBlock, // para que modal actualice el código en tiempo real
  };
}
