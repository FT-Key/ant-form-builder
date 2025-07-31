import { Button } from "antd";
import {
  EyeOutlined,
  CodeOutlined,
  CopyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

export default function ActionBar({
  showCode,
  setShowCode,
  code,
  copyToClipboard,
  downloadImage,
}: {
  showCode: boolean;
  setShowCode: (v: boolean) => void;
  code: string;
  copyToClipboard: (text: string) => void;
  downloadImage: () => void;
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
      {!isEmpty && (
        <div className="flex justify-between items-center">
          <Button
            icon={showCode ? <EyeOutlined /> : <CodeOutlined />}
            onClick={() => setShowCode(!showCode)}
            size="large"
            className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
          >
            {showCode ? "Preview Form" : "View Code"}
          </Button>

          <Button
            icon={showCode ? <CopyOutlined /> : <DownloadOutlined />}
            onClick={showCode ? () => copyToClipboard(code) : downloadImage}
            size="large"
            className="border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-medium"
          >
            {showCode ? "Copy Code" : "Export"}
          </Button>
        </div>
      )}
    </div>
  );
}
