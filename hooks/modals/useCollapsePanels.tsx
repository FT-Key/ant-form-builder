import { useState, useRef } from "react";

export function useCollapsePanels(
  basicErrors: string[],
  advancedErrors: string[]
) {
  const [activePanels, setActivePanelsState] = useState<string[]>([]);
  const isManualChange = useRef(false);

  const setActivePanels = (panels: string[]) => {
    isManualChange.current = true; // usuario lo tocó manualmente
    setActivePanelsState(panels);
  };

  // Se llama SOLO cuando das "guardar"
  const validateAndOpen = (errors: Record<string, string>) => {
    const newActivePanels: string[] = [];

    if (basicErrors.some((key) => errors[key])) newActivePanels.push("0");
    if (advancedErrors.some((key) => errors[key])) newActivePanels.push("1");

    // forzar que se abran los que tengan error
    isManualChange.current = false;
    setActivePanelsState(newActivePanels);
  };

  return { activePanels, setActivePanels, validateAndOpen };
}
