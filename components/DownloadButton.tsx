"use client";
import html2canvas from "html2canvas";

export function DownloadButton() {
  const handleDownload = async () => {
    const el = document.getElementById("form-preview");
    if (!el) return;

    const canvas = await html2canvas(el);
    const link = document.createElement("a");
    link.download = "form-mockup.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Descargar mockup
    </button>
  );
}
