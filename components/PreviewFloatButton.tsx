"use client";
import React from "react";
import { FloatButton, FloatButtonProps } from "antd";

export default function PreviewFloatButton(props: FloatButtonProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <FloatButton
        {...props}
        style={{ position: "absolute", bottom: 16, right: 16, ...props.style }}
      />
    </div>
  );
}
