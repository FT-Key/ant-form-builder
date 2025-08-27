import { useState, useRef } from "react";

export function useCollapsePanels(
  basicErrors: string[] = [],
  advancedErrors: string[] = [],
  optionsErrors: string[] = [] // para opciones, se puede pasar "errorOptions"
) {
  const [activePanels, setActivePanelsState] = useState<string[]>([]);
  const isManualChange = useRef(false);

  const setActivePanels = (panels: string[]) => {
    isManualChange.current = true;
    setActivePanelsState(panels);
  };

  // Abrir automáticamente paneles con errores
  const validateAndOpen = (errors: Record<string, string>) => {
    const newActivePanels: string[] = [];

    // Basic
    if (basicErrors.some((key) => errors[key])) newActivePanels.push("0");

    // Advanced
    if (advancedErrors.some((key) => errors[key])) newActivePanels.push("1");

    // Options: abrir si cualquier key empieza con "errorOptions"
    if (
      Object.keys(errors).some(
        (key) => key.startsWith("errorOptions") && errors[key]
      )
    ) {
      newActivePanels.push("options");
    }

    // Forzar apertura
    isManualChange.current = false;
    setActivePanelsState(newActivePanels);
  };

  return { activePanels, setActivePanels, validateAndOpen };
}
