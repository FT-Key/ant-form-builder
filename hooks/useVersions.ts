import { useState, useCallback } from "react";

export type Version = {
  id: number;
  prompt: string;
  code: string;
  messages?: any[];
};

export function useVersions(initialVersions: Version[] = []) {
  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);

  const handleVersionChange = useCallback(
    (
      id: number | null,
      setCode: (code: string) => void,
      setEditingMode: (mode: "builder" | "code") => void,
      setHasUnsavedChanges: (v: boolean) => void
    ) => {
      if (id === null) {
        setActiveVersionId(null);
        setCode("");
        setEditingMode("builder");
        setHasUnsavedChanges(false);
        return;
      }
      const version = versions.find((v) => v.id === id);
      if (version) {
        setActiveVersionId(id);
        setCode(version.code);
        setEditingMode("builder");
        setHasUnsavedChanges(false);
      }
    },
    [versions]
  );

  const handleSave = useCallback(
    (
      code: string,
      prompt: string,
      setHasUnsavedChanges: (v: boolean) => void
    ) => {
      const maxId = versions.length
        ? Math.max(...versions.map((v) => v.id))
        : 0;
      const newVersion: Version = {
        id: maxId + 1,
        prompt,
        code,
        messages: [],
      };
      setVersions((prev) => [...prev, newVersion]);
      setActiveVersionId(newVersion.id);
      setHasUnsavedChanges(false);
    },
    [versions]
  );

  const handleDeleteVersion = useCallback(
    (
      id: number,
      setCode: (code: string) => void,
      handleVersionChangeInternal: (id: number | null) => void
    ) => {
      setVersions((prev) => {
        const filtered = prev.filter((v) => v.id !== id);

        if (activeVersionId === id) {
          if (filtered.length > 0) {
            handleVersionChangeInternal(filtered[0].id);
          } else {
            handleVersionChangeInternal(null);
          }
        }

        return filtered;
      });
    },
    [activeVersionId]
  );

  return {
    versions,
    setVersions,
    activeVersionId,
    setActiveVersionId,
    handleVersionChange,
    handleSave,
    handleDeleteVersion,
  };
}
