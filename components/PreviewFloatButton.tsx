"use client";
import React from "react";
import { FloatButton, FloatButtonProps } from "antd";

export default function PreviewFloatButton(props: FloatButtonProps) {
  return (
    <FloatButton
      {...props}
      style={{
        position: "absolute", // clave: relativo al contenedor padre con `relative`
        bottom: 16,
        right: 16,
        zIndex: 10,
        ...props.style,
      }}
    />
  );
}
