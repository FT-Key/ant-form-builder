"use client";
import { useState } from "react";

export default function PromptInput({
  onSubmit,
}: {
  onSubmit: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-2">
      <label htmlFor="prompt" className="block font-medium">
        Prompt
      </label>
      <textarea
        id="prompt"
        className="w-full border p-2 rounded"
        placeholder="Ej: Formulario de login con email, password y remember me"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={() => onSubmit(prompt)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generar formulario
      </button>
    </div>
  );
}
