import { useEffect } from "react";

interface UseCodeEditorShortcutsProps {
  textareaRef: React.RefObject<any>; // any porque es componente Antd con refs internos
  onSave: () => void;
  onChange: (value: string) => void;
}

export function useCodeEditorShortcuts({
  textareaRef,
  onSave,
  onChange,
}: UseCodeEditorShortcutsProps) {
  useEffect(() => {
    const textarea = textareaRef.current?.resizableTextArea?.textArea as
      | HTMLTextAreaElement
      | undefined;

    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, altKey, shiftKey } = e;

      // Guardar con Ctrl+S o Cmd+S
      if ((ctrlKey || metaKey) && key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
        return;
      }

      const value = textarea.value;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      const getLineInfo = () => {
        const lines = value.split("\n");
        const startLine =
          value.substring(0, selectionStart).split("\n").length - 1;
        const endLine = value.substring(0, selectionEnd).split("\n").length - 1;
        return { lines, startLine, endLine };
      };

      // Mover línea arriba/abajo con Alt + Flecha
      if (altKey && !shiftKey && (key === "ArrowUp" || key === "ArrowDown")) {
        e.preventDefault();
        const { lines, startLine, endLine } = getLineInfo();

        if (key === "ArrowUp" && startLine > 0) {
          const temp = lines[startLine - 1];
          lines[startLine - 1] = lines[startLine];
          lines[startLine] = temp;
          onChange(lines.join("\n"));
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart - (temp.length + 1);
          }, 0);
        }

        if (key === "ArrowDown" && endLine < lines.length - 1) {
          const temp = lines[endLine + 1];
          lines[endLine + 1] = lines[endLine];
          lines[endLine] = temp;
          onChange(lines.join("\n"));
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart + (temp.length + 1);
          }, 0);
        }
      }

      // Duplicar línea con Alt+Shift+Flecha
      if (altKey && shiftKey && (key === "ArrowUp" || key === "ArrowDown")) {
        e.preventDefault();
        const { lines, startLine, endLine } = getLineInfo();
        const selectedLines = lines.slice(startLine, endLine + 1);
        if (key === "ArrowUp") {
          lines.splice(startLine, 0, ...selectedLines);
        } else {
          lines.splice(endLine + 1, 0, ...selectedLines);
        }
        onChange(lines.join("\n"));
      }
    };

    textarea.addEventListener("keydown", handleKeyDown);
    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
    };
  }, [textareaRef, onSave, onChange]);
}
