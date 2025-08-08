"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EditOutlined } from "@ant-design/icons";
import ModalRenderer from "./ModalRenderer";

interface InputItem {
  id: string;
  label: string;
}

interface InputListProps {
  inputs: InputItem[];
  onReorder: (newOrder: string[]) => void;
  onUpdateInput: (id: string, newCodeBlock: string) => void;
  getCodeBlockByInputId: (id: string) => string;
}

export default function InputList({
  inputs,
  onReorder,
  onUpdateInput,
  getCodeBlockByInputId,
}: InputListProps) {
  const [editingInputId, setEditingInputId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newInputs = Array.from(inputs);
    const [removed] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, removed);

    onReorder(newInputs.map((i) => i.id));
  };

  const handleSave = (newCodeBlock: string) => {
    if (editingInputId) {
      onUpdateInput(editingInputId, newCodeBlock);
      setEditingInputId(null);
    }
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
              {inputs.map(({ id, label }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-3 rounded border flex justify-between items-center ${
                        snapshot.isDragging
                          ? "bg-blue-100 border-blue-500"
                          : "bg-white"
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-move"
                      >
                        {label}
                      </div>
                      <EditOutlined
                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                        onClick={() => setEditingInputId(id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ModalRenderer
        editingInputId={editingInputId}
        codeBlock={editingInputId ? getCodeBlockByInputId(editingInputId) : ""}
        onCancel={() => setEditingInputId(null)}
        onSave={handleSave}
      />
    </>
  );
}
