import { useState, useRef } from "react";

export function useCollapsePanels(
  basicErrors: string[] = [],
  advancedErrors: string[] = [],
  optionsErrorPrefixes: string[] = ["errorOption"] // prefijo correcto para Options
) {
  const [activePanels, setActivePanelsState] = useState<string[]>([]);
  const isManualChange = useRef(false);

  const setActivePanels = (panels: string[]) => {
    isManualChange.current = true;
    setActivePanelsState(panels);
  };

  const validateAndOpen = (errors: Record<string, string>) => {
    const newActivePanels: string[] = [];

    // ---- Basic ----
    const basicHasError = basicErrors.some((key) => errors[key]);
    if (basicHasError) newActivePanels.push("0");

    // ---- Advanced ----
    const advancedHasError = advancedErrors.some((key) => errors[key]);
    if (advancedHasError) newActivePanels.push("1");

    // ---- Options ----
    let optionsHasError = false;

    Object.keys(errors).forEach((key) => {
      if (
        optionsErrorPrefixes.some(
          (prefix) => key.startsWith(prefix) && errors[key]
        )
      ) {
        optionsHasError = true;
      }
    });

    if (optionsHasError) newActivePanels.push("options");

    // ---- Actualizar estado ----
    isManualChange.current = false;
    setActivePanelsState(newActivePanels);
  };

  return { activePanels, setActivePanels, validateAndOpen };
}
