"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import ModalRenderer from "./ModalRenderer";
import { useInputEditorLogic } from "@/hooks/useInputEditorLogic";
import { useInputHierarchy } from "@/hooks/useInputHierarchy";
import { filterRootInputs } from "@/utils/inputFilters";

interface InputItem {
  id: string;
  label: string;
  code?: string;
}

interface InputListProps {
  inputs: InputItem[];
  onReorder: (newOrder: string[]) => void;
  onUpdateInput: (id: string, newCodeBlock: string) => void;
  getCodeBlockByInputId: (id: string) => string | undefined;
}

export default function InputList({
  inputs,
  onReorder,
  onUpdateInput,
  getCodeBlockByInputId,
}: InputListProps) {
  const {
    editingInputId,
    codeBlock,
    openEditor,
    closeEditor,
    saveEditor,
    updateLocalCodeBlock,
  } = useInputEditorLogic(inputs, getCodeBlockByInputId, onUpdateInput);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startConfirmTimeout = (id: string) => {
    setConfirmDeleteId(id);
    setTimeout(() => {
      setConfirmDeleteId((prev) => (prev === id ? null : prev));
    }, 2000); // vuelve al basurero en 2 segundos
  };

  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      onUpdateInput(id, "");
      setConfirmDeleteId(null);
    } else {
      startConfirmTimeout(id);
    }
  };

  // Mapeamos inputs con código
  const inputsWithCode = React.useMemo(
    () =>
      inputs.map((input) => {
        const code = getCodeBlockByInputId(input.id) || "";
        const match = code.match(/name="([^"]+)"/);
        return {
          id: input.id,
          label: match ? match[1] : input.label,
          code,
        };
      }),
    [inputs, getCodeBlockByInputId]
  );

  const rootInputs = React.useMemo(
    () =>
      filterRootInputs(inputsWithCode).map((input) => ({
        ...input,
        code: input.code || "",
      })),
    [inputsWithCode]
  );

  const { hierarchy, expanded, toggleExpand } = useInputHierarchy(rootInputs);

  const renderInputItem = (input: InputItem, index: number, level = 0) => {
    const hasChildren = hierarchy[input.id]?.length > 0;
    const children = hierarchy[input.id] || [];

    const renderButtons = (id: string) => (
      <div className="flex space-x-2">
        <EditOutlined
          className="text-gray-500 hover:text-blue-600 cursor-pointer"
          onClick={() => openEditor(id)}
        />
        <button
          onClick={() => handleDeleteClick(id)}
          onMouseLeave={() =>
            confirmDeleteId === id && setConfirmDeleteId(null)
          }
          className="text-red-500 hover:text-red-700 cursor-pointer focus:outline-none"
        >
          {confirmDeleteId === id ? <CheckOutlined /> : <DeleteOutlined />}
        </button>
      </div>
    );

    return (
      <React.Fragment key={input.id}>
        <Draggable draggableId={input.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`p-3 rounded border flex justify-between items-center ${
                snapshot.isDragging ? "bg-blue-100 border-blue-500" : "bg-white"
              }`}
              style={{
                paddingLeft: 16 + level * 20,
                ...provided.draggableProps.style,
              }}
            >
              <div
                {...provided.dragHandleProps}
                className="cursor-move flex items-center space-x-1 flex-grow"
              >
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(input.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={expanded[input.id] ? "Colapsar" : "Expandir"}
                    style={{ width: 20, height: 20, lineHeight: "20px" }}
                  >
                    {expanded[input.id] ? "▼" : "▶"}
                  </button>
                )}
                <span>{input.label}</span>
              </div>
              {renderButtons(input.id)}
            </div>
          )}
        </Draggable>

        {hasChildren && expanded[input.id] && (
          <div>
            {children.map((child) => (
              <div
                key={child.id}
                className="p-3 rounded border border-gray-200 flex justify-between items-center bg-gray-50"
                style={{ paddingLeft: 16 + (level + 1) * 20 }}
              >
                <span>{child.label}</span>
                {renderButtons(child.id)}
              </div>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newInputs = Array.from(inputs);
    const [removed] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, removed);
    onReorder(newInputs.map((i) => i.id));
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="input-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 bg-gray-50 p-4 rounded border border-gray-300 min-h-[300px]"
            >
              {rootInputs.map((input, index) => renderInputItem(input, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ModalRenderer
        editingInputId={editingInputId}
        codeBlock={codeBlock || ""}
        onCancel={closeEditor}
        onSave={saveEditor}
        onChangeCode={updateLocalCodeBlock}
      />
    </>
  );
}
