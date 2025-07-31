"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { componentsByVersion } from "@/constants/antd/componentsByVersion";

export type AntdVersion = "v3" | "v4" | "v5";

interface AntdVersionContextType {
  antdVersion: AntdVersion;
  setAntdVersion: (version: AntdVersion) => void;
  getBaseCode: (version: AntdVersion) => string;
}

const AntdVersionContext = createContext<AntdVersionContextType | undefined>(
  undefined
);

export function AntdVersionProvider({ children }: { children: ReactNode }) {
  const [antdVersion, setAntdVersion] = useState<AntdVersion>("v5"); // versión por defecto

  const getBaseCode = (version: AntdVersion) => {
    return "";
  };

  return (
    <AntdVersionContext.Provider
      value={{ antdVersion, setAntdVersion, getBaseCode }}
    >
      {children}
    </AntdVersionContext.Provider>
  );
}

export function useAntdVersion() {
  const context = useContext(AntdVersionContext);
  if (!context) {
    throw new Error("useAntdVersion debe usarse dentro de AntdVersionProvider");
  }
  return context;
}
