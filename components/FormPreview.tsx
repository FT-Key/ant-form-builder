"use client";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

export default function FormPreview({ code }: { code: string }) {
  return (
    <Card className="p-4" id="form-preview">
      {/* Simulación por ahora */}
      <p className="text-muted-foreground">Vista previa del formulario</p>
    </Card>
  );
}
