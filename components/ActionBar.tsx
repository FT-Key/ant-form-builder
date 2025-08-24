import { Button } from "antd";
import { EyeOutlined, CodeOutlined } from "@ant-design/icons";
import CopyCodeButton from "./CopyCodeButton";
import DownloadImageButton from "./DownloadImageButton";
import { RefObject } from "react";

export default function ActionBar({
  showCode,
  setShowCode,
  code,
  previewRef,
  activeVersionId,
}: {
  showCode: boolean;
  setShowCode: (v: boolean) => void;
  code: string;
  previewRef: RefObject<HTMLElement>;
  activeVersionId?: number | null;
}) {
  const isEmpty = !code.trim();

  return (
    <div
      className="border border-gray-200 rounded-lg px-6 py-4 shadow-sm sticky top-4 z-20 transition-all"
      style={{
        minHeight: "64px",
        backgroundColor: "#ffffff",
        backgroundImage: isEmpty
          ? `repeating-linear-gradient(
              45deg,
              #f0f0f0,
              #f0f0f0 1px,
              transparent 2px,
              transparent 20px
            )`
          : "none",
      }}
    >
      <div className="flex justify-between items-center">
        {/* Toggle Preview / Code */}
        <Button
          icon={showCode ? <EyeOutlined /> : <CodeOutlined />}
          onClick={() => setShowCode(!showCode)}
          size="large"
          className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
        >
          {showCode ? "Preview Form" : "View Code"}
        </Button>

        {/* Botones secundarios */}
        {!isEmpty &&
          (showCode ? (
            <CopyCodeButton code={code} />
          ) : (
            <DownloadImageButton
              nodeRef={previewRef}
              fileName={`form-version-${activeVersionId ?? "latest"}.png`}
              excludeClassNames={["action-bar"]}
            />
          ))}
      </div>
    </div>
  );
}
