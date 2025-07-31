"use client";

import React, { useState, useEffect } from "react";
import { Transfer, Input, FormInstance, Form } from "antd";

interface PreviewTransferProps {
  form?: FormInstance;
  name?: string;
}

export default function PreviewTransfer({
  form,
  name = "transfer",
}: PreviewTransferProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ [name]: targetKeys });
    }
  }, [targetKeys, form, name]);

  const onChange = (
    targetKeys: React.Key[],
    direction: "left" | "right",
    moveKeys: React.Key[]
  ) => {
    const stringKeys = targetKeys.map(String);
    setTargetKeys(stringKeys);

    if (form) {
      form.setFieldsValue({ [name]: stringKeys });
    }
  };

  const dataSource = [
    { key: "1", title: "Option 1" },
    { key: "2", title: "Option 2" },
    { key: "3", title: "Option 3" },
  ];

  return (
    <>
      <Transfer
        dataSource={dataSource}
        targetKeys={targetKeys}
        render={(item) => item.title}
        onChange={onChange}
        showSearch
      />
      {form && (
        <Form.Item name={name} hidden>
          <Input />
        </Form.Item>
      )}
    </>
  );
}
