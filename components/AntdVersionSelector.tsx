"use client";

import React from "react";
import { Select } from "antd";
import { useAntdVersion, AntdVersion } from "../context/AntdVersionContext";

const { Option } = Select;

const versions: { label: string; value: AntdVersion }[] = [
  { label: "Ant Design v3", value: "v3" },
  { label: "Ant Design v4", value: "v4" },
  { label: "Ant Design v5", value: "v5" },
];

export default function AntdVersionSelector() {
  const { antdVersion, setAntdVersion } = useAntdVersion();

  return (
    <div className="mb-4">
      <label
        htmlFor="antd-version-select"
        className="block mb-1 font-medium text-gray-700"
      >
        Select Ant Design Version
      </label>
      <Select
        id="antd-version-select"
        value={antdVersion}
        onChange={(value: AntdVersion) => setAntdVersion(value)}
        style={{ width: "100%" }}
        options={versions}
      />
    </div>
  );
}
