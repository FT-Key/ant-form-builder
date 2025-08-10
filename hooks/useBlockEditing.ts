import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ParsedBlock {
  block: string;
  index: number;
  length: number;
}

/**
 * Hook que mantiene el mapa id -> bloque de código (top-level),
 * permite sincronizar con parsedBlocks, actualizar bloques, reorder, etc.
 */
export function useBlockEditing(parsedBlocks: ParsedBlock[]) {
  // Mapa estable id -> bloque de código
  const idToBlockRef = useRef<Map<string, string>>(new Map());

  // Sincroniza idToBlockRef con parsedBlocks:
  // mantiene ids para bloques iguales, genera ids nuevos para bloques nuevos,
  // elimina ids que ya no existen.
  const syncIdToBlockMap = useCallback(() => {
    const prevMap = idToBlockRef.current;
    const newMap = new Map<string, string>();

    // Busca id existente para un bloque dado
    const findIdForBlock = (block: string) => {
      for (const [id, b] of prevMap.entries()) {
        if (b === block) return id;
      }
      return null;
    };

    for (const { block } of parsedBlocks) {
      const existingId = findIdForBlock(block);
      if (existingId) {
        newMap.set(existingId, block);
      } else {
        newMap.set(uuidv4(), block);
      }
    }

    idToBlockRef.current = newMap;
  }, [parsedBlocks]);

  // Obtiene el bloque de código asociado a un id.
  // Soporta ids de hijos en formato "parentId::childLabel"
  const getCodeBlockByInputId = useCallback(
    (id: string): string | undefined => {
      if (!id.includes("::")) {
        // Id raíz
        return idToBlockRef.current.get(id);
      }
      // Id hijo: "parentId::childLabel"
      const [parentId, childLabel] = id.split("::");
      const parentBlock = idToBlockRef.current.get(parentId);
      if (!parentBlock) return undefined;

      // Regex para extraer Form.Item hijo con label exacto
      const childRegex = new RegExp(
        `<Form\\.Item[\\s\\S]*?label="${childLabel}"[\\s\\S]*?<\\/Form\\.Item>`,
        "g"
      );
      const matches = parentBlock.match(childRegex);
      return matches && matches.length > 0 ? matches[0] : undefined;
    },
    []
  );

  // Reordena el código según el nuevo orden de ids
  const reorderCodeByInputIds = useCallback(
    (
      newOrder: string[],
      setCode: (code: string) => void,
      setHasUnsavedChanges: (v: boolean) => void
    ) => {
      const idToBlock = idToBlockRef.current;
      const reorderedBlocks: string[] = [];
      for (const id of newOrder) {
        const b = idToBlock.get(id);
        if (b) reorderedBlocks.push(b);
      }
      setCode(reorderedBlocks.join("\n"));
      setHasUnsavedChanges(true);
    },
    []
  );

  // Actualiza el bloque de código asociado a inputId con newCodeBlock
  // y reconstruye el código completo respetando el orden actual de parsedBlocks.
  const handleUpdateInput = useCallback(
    (
      inputId: string,
      newCodeBlock: string,
      parsedBlocks: ParsedBlock[],
      setCode: (code: string) => void,
      setHasUnsavedChanges: (v: boolean) => void
    ) => {
      const idToBlock = idToBlockRef.current;
      if (!idToBlock.has(inputId)) return;

      // Actualiza el mapa
      idToBlock.set(inputId, newCodeBlock);

      const rebuilt: string[] = [];
      for (const { block } of parsedBlocks) {
        // Buscar id para este bloque en el mapa, buscando coincidencia por valor
        let foundId: string | undefined;
        for (const [id, b] of idToBlock.entries()) {
          if (b === block) {
            foundId = id;
            break;
          }
        }
        // fallback si no encontramos el id por match
        if (!foundId) {
          // Si el inputId es el que editamos, insertamos el nuevo código
          const currentForId = idToBlock.get(inputId);
          if (
            currentForId &&
            block !== currentForId &&
            block === idToBlock.get(inputId)
          ) {
            foundId = inputId;
          }
        }

        if (foundId) {
          rebuilt.push(idToBlock.get(foundId)!);
        } else {
          rebuilt.push(block);
        }
      }

      // En caso extremo (parsedBlocks vacío), reconstruye con todo lo del mapa
      if (rebuilt.length === 0) {
        rebuilt.push(...Array.from(idToBlock.values()));
      }

      setCode(rebuilt.join("\n"));
      setHasUnsavedChanges(true);
    },
    []
  );

  // Ref para contar insertados y generar sufijos únicos
  const insertCountRef = useRef(0);

  // Genera código único reemplazando name y label con sufijos numéricos
  const getUniqueCode = useCallback((originalCode: string, label?: string) => {
    insertCountRef.current++;
    const suffix = insertCountRef.current;

    let newCode = originalCode;

    // Si ya tiene name → agrega sufijo
    if (/name="([^"]+)"/.test(newCode)) {
      newCode = newCode.replace(/name="([^"]+)"/, `name="$1_${suffix}"`);
    } else {
      // Si no tiene name, generamos uno a partir del label
      const baseName =
        (label || "component")
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "") || "component";

      if (/<Form\.Item/.test(newCode)) {
        // Añadir name al Form.Item
        newCode = newCode.replace(
          /<Form\.Item([^>]*)>/,
          `<Form.Item$1 name="${baseName}_${suffix}">`
        );
      } else {
        // Añadir name al primer tag del código
        newCode = newCode.replace(
          /<([A-Z][A-Za-z0-9.]*)/,
          `<$1 name="${baseName}_${suffix}"`
        );
      }
    }

    // Mantener la lógica de label como antes
    newCode = newCode.replace(/label="([^"]+)"/, `label="$1 ${suffix}"`);

    return newCode;
  }, []);

  return {
    idToBlockRef,
    syncIdToBlockMap,
    getCodeBlockByInputId,
    reorderCodeByInputIds,
    handleUpdateInput,
    getUniqueCode,
  };
}
