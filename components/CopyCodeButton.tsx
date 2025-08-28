"use client";

import { useState } from "react";
import { Button, message } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      message.success("Code copied!", 2); // mensaje sutil arriba
      setTimeout(() => setCopied(false), 2000); // vuelve al estado original
    } catch {
      message.error("Failed to copy code.", 2);
    }
  };

  return (
    <Button
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={handleCopy}
      size="large"
      className={`border-gray-200 font-medium ${
        copied
          ? "text-green-600 hover:text-green-700 hover:border-green-400"
          : "text-gray-700 hover:text-gray-900 hover:border-gray-300"
      }`}
    >
      {copied ? "Copied!" : "Copy Code"}
    </Button>
  );
}
