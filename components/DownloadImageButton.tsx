import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";
import { RefObject } from "react";

export default function DownloadImageButton({
  nodeRef,
  fileName = "form.png",
  excludeClassNames = [],
}: {
  nodeRef: RefObject<HTMLElement>;
  fileName?: string;
  excludeClassNames?: string[]; // nodos que queremos excluir
}) {
  const handleDownload = async () => {
    if (!nodeRef.current) return;

    try {
      const dataUrl = await toPng(nodeRef.current, {
        cacheBust: true,
        backgroundColor: "#fff",
        pixelRatio: 2,
        filter: (node) => {
          // Excluimos cualquier nodo que tenga alguna clase en excludeClassNames
          if (node instanceof HTMLElement) {
            return !excludeClassNames.some((cls) =>
              node.classList.contains(cls)
            );
          }
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      message.success("Form exported!");
    } catch {
      message.error("Failed to export form.");
    }
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      size="large"
      className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
    >
      Export
    </Button>
  );
}
