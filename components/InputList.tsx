"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface InputListProps {
  inputs: { id: string; label: string }[];
  onReorder: (newOrder: string[]) => void;
}

export default function InputList({ inputs, onReorder }: InputListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newInputs = Array.from(inputs);
    const [removed] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, removed);

    onReorder(newInputs.map((i) => i.id));
  };

  return (
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
                    {...provided.dragHandleProps}
                    className={`p-3 rounded border ${
                      snapshot.isDragging
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white"
                    } cursor-move`}
                  >
                    {label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
