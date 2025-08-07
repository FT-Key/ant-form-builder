"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EditOutlined } from "@ant-design/icons";

// Importa todos los modales desde index.ts
import {
  InputTextModal,
  InputPasswordModal,
  InputNumberEditModal,
  InputTextareaModal,
  SelectEditModal,
  DatePickerEditModal,
  TimePickerEditModal,
  RangePickerEditModal,
  CheckboxEditModal,
  CheckboxGroupEditModal,
  RadioGroupEditModal,
  SwitchEditModal,
  UploadEditModal,
  SliderEditModal,
  RateEditModal,
  CascaderEditModal,
  TreeSelectEditModal,
  MentionsEditModal,
  AutoCompleteEditModal,
  TransferEditModal,
  StepsEditModal,
  ColorPickerEditModal,
  SearchEditModal,
  SubmitEditModal,
  TourEditModal,
  SegmentedEditModal,
  FloatButtonEditModal,
  WatermarkEditModal,
} from "./modals";

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

  // Detecta el tipo de input según el código
  const getInputType = (
    codeBlock?: string
  ):
    | "text"
    | "password"
    | "inputnumber"
    | "textarea"
    | "select"
    | "datepicker"
    | "timepicker"
    | "rangepicker"
    | "checkbox"
    | "checkboxgroup"
    | "radiogroup"
    | "switch"
    | "upload"
    | "slider"
    | "rate"
    | "cascader"
    | "treeselect"
    | "mentions"
    | "autocomplete"
    | "transfer"
    | "search"
    | "submit"
    | "steps"
    | "colorpicker"
    | "tour"
    | "segmented"
    | "floatbutton"
    | "watermark"
    | "other" => {
    if (!codeBlock) return "other";

    if (codeBlock.includes("<Input.Password")) return "password";
    if (codeBlock.includes("<Input.TextArea")) return "textarea";
    if (codeBlock.includes("<InputNumber")) return "inputnumber";
    if (codeBlock.includes("<Select")) return "select";
    if (codeBlock.includes("<DatePicker.RangePicker")) return "rangepicker";
    if (codeBlock.includes("<DatePicker ")) return "datepicker";
    if (codeBlock.includes("<TimePicker")) return "timepicker";
    if (codeBlock.includes("<Checkbox.Group")) return "checkboxgroup";
    if (codeBlock.includes("<Checkbox")) return "checkbox";
    if (codeBlock.includes("<Radio.Group")) return "radiogroup";
    if (codeBlock.includes("<Switch")) return "switch";
    if (codeBlock.includes("<Upload")) return "upload";
    if (codeBlock.includes("<Slider")) return "slider";
    if (codeBlock.includes("<Rate")) return "rate";
    if (codeBlock.includes("<Cascader")) return "cascader";
    if (codeBlock.includes("<TreeSelect")) return "treeselect";
    if (codeBlock.includes("<Mentions")) return "mentions";
    if (codeBlock.includes("<AutoComplete")) return "autocomplete";
    if (codeBlock.includes("<Transfer")) return "transfer";
    if (codeBlock.includes("<Input.Search")) return "search";
    if (codeBlock.includes("<Button")) return "submit";
    if (codeBlock.includes("<Steps")) return "steps";
    if (codeBlock.includes("<ColorPicker")) return "colorpicker";
    if (codeBlock.includes("<Tour")) return "tour";
    if (codeBlock.includes("<Segmented")) return "segmented";
    if (codeBlock.includes("<FloatButton")) return "floatbutton";
    if (codeBlock.includes("<Watermark")) return "watermark";
    if (codeBlock.includes("<Input")) return "text";

    return "other";
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newInputs = Array.from(inputs);
    const [removed] = newInputs.splice(result.source.index, 1);
    newInputs.splice(result.destination.index, 0, removed);

    onReorder(newInputs.map((i) => i.id));
  };

  const handleEditClick = (id: string) => {
    setEditingInputId(id);
  };

  const handleSave = (newCodeBlock: string) => {
    if (editingInputId) {
      onUpdateInput(editingInputId, newCodeBlock);
      setEditingInputId(null);
    }
  };

  const codeBlock = editingInputId ? getCodeBlockByInputId(editingInputId) : "";
  const inputType = editingInputId ? getInputType(codeBlock) : null;

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
                        onClick={() => handleEditClick(id)}
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

      {/* Renderizado de modales según tipo */}
      {inputType === "text" && editingInputId && (
        <InputTextModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "password" && editingInputId && (
        <InputPasswordModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "inputnumber" && editingInputId && (
        <InputNumberEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "textarea" && editingInputId && (
        <InputTextareaModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "select" && editingInputId && (
        <SelectEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "datepicker" && editingInputId && (
        <DatePickerEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "timepicker" && editingInputId && (
        <TimePickerEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "rangepicker" && editingInputId && (
        <RangePickerEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "checkbox" && editingInputId && (
        <CheckboxEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "checkboxgroup" && editingInputId && (
        <CheckboxGroupEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "radiogroup" && editingInputId && (
        <RadioGroupEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "switch" && editingInputId && (
        <SwitchEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "upload" && editingInputId && (
        <UploadEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "slider" && editingInputId && (
        <SliderEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "rate" && editingInputId && (
        <RateEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "cascader" && editingInputId && (
        <CascaderEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "treeselect" && editingInputId && (
        <TreeSelectEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "mentions" && editingInputId && (
        <MentionsEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "autocomplete" && editingInputId && (
        <AutoCompleteEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "transfer" && editingInputId && (
        <TransferEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "search" && editingInputId && (
        <SearchEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "submit" && editingInputId && (
        <SubmitEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "steps" && editingInputId && (
        <StepsEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "colorpicker" && editingInputId && (
        <ColorPickerEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "tour" && editingInputId && (
        <TourEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "segmented" && editingInputId && (
        <SegmentedEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "floatbutton" && editingInputId && (
        <FloatButtonEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}

      {inputType === "watermark" && editingInputId && (
        <WatermarkEditModal
          open={true}
          codeBlock={codeBlock}
          onCancel={() => setEditingInputId(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
