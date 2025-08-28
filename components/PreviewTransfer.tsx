"use client";

import React, { useState, useEffect } from "react";
import { Transfer, Input, FormInstance, Form } from "antd";

interface PreviewTransferProps {
  form?: FormInstance;
  name?: string;
  dataSource?: {
    key: string;
    title: string;
    description?: string;
    disabled?: boolean;
  }[];
  oneWay?: boolean;
  disabled?: boolean;
  showSearch?: boolean;
  id?: string;
}

export default function PreviewTransfer({
  form,
  name = "transfer",
  dataSource = [],
  oneWay = false,
  disabled = false,
  showSearch = false,
  id,
}: PreviewTransferProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  // DataSource por defecto para evitar lista vacía
  const defaultDataSource = [
    { key: "1", title: "Option 1" },
    { key: "2", title: "Option 2" },
  ];

  const dataSrc = dataSource.length > 0 ? dataSource : defaultDataSource;

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ [name]: targetKeys });
    }
  }, [targetKeys, form, name]);

  const onChange = (
    keys: React.Key[],
    direction: "left" | "right",
    moveKeys: React.Key[]
  ) => {
    const stringKeys = keys.map(String);
    setTargetKeys(stringKeys);

    if (form) {
      form.setFieldsValue({ [name]: stringKeys });
    }
  };

  return (
    <>
      <div id={id}>
        <Transfer
          dataSource={dataSource}
          targetKeys={targetKeys}
          render={(item) => item.title}
          onChange={onChange}
          showSearch={showSearch}
          disabled={disabled}
          oneWay={oneWay}
        />
      </div>
      {form && (
        <Form.Item name={name} hidden>
          <Input />
        </Form.Item>
      )}
    </>
  );
}
