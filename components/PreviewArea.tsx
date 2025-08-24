"use client";

import { Form, Button, message } from "antd";
import ReactJsxParser from "react-jsx-parser";
import ErrorBoundary from "./ErrorBoundary";
import { useState } from "react";
import { ShrinkOutlined, DownloadOutlined } from "@ant-design/icons";
import DownloadImageButton from "./DownloadImageButton";

interface ErrorLog {
  message: string;
  stack: string;
  timestamp: string;
}

export default function PreviewArea({
  code,
  components,
  previewRef,
  isExpanded,
  setIsExpanded,
  activeVersionId,
}: {
  code: string;
  components: any;
  previewRef: React.RefObject<HTMLDivElement>;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  activeVersionId?: number | null;
}) {
  const [logs, setLogs] = useState<ErrorLog[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("renderErrors") || "[]");
    } catch {
      return [];
    }
  });

  const handleError = (error: Error, info: React.ErrorInfo) => {
    const newError = {
      message: error.message,
      stack: info.componentStack,
      timestamp: new Date().toISOString(),
    };

    const existingLogs = JSON.parse(
      localStorage.getItem("renderErrors") || "[]"
    );
    const updatedLogs = [...existingLogs, newError].slice(-10);
    localStorage.setItem("renderErrors", JSON.stringify(updatedLogs));
    setLogs(updatedLogs);
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        backgroundColor: "#fff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `form-version-${activeVersionId ?? "latest"}.png`;
      link.href = dataUrl;
      link.click();
      message.success("Form exported!");
    } catch {
      message.error("Failed to export form.");
    }
  };

  const wrapperClass = isExpanded
    ? "fixed inset-0 bg-white p-8 overflow-auto z-[100]"
    : "form-capture-area lg:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-96 relative";

  return (
    <div
      ref={previewRef}
      className={wrapperClass}
      style={{ fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif" }}
    >
      {isExpanded && (
        <div className="sticky top-0 bg-white border-b border-gray-200 z-[110] flex justify-between items-center p-4 mb-6 shadow-sm action-bar">
          <DownloadImageButton
            nodeRef={previewRef}
            fileName={`form-version-${activeVersionId ?? "latest"}.png`}
            excludeClassNames={["action-bar"]} // aquí se excluye el wrapper de botones
          />
          <Button
            type="default"
            onClick={() => setIsExpanded(false)}
            icon={<ShrinkOutlined />}
          >
            Exit Fullscreen
          </Button>
        </div>
      )}

      <div className={isExpanded ? "" : "p-8"}>
        {code.trim() ? (
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
            <ErrorBoundary onError={handleError}>
              <Form
                layout="vertical"
                className="max-w-lg mx-auto"
                onFinish={(values) => console.log("Form values:", values)}
              >
                <ReactJsxParser jsx={code} components={components} key={code} />
              </Form>
            </ErrorBoundary>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              🚀
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ready to create
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Start by describing your form requirements or add components
              manually from the sidebar.
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-red-500 mb-2">
              Recent render errors (last {logs.length})
            </h3>

            <button
              type="button"
              className="text-sm text-blue-600 hover:underline mb-3"
              onClick={() => {
                localStorage.removeItem("renderErrors");
                setLogs([]);
              }}
            >
              Clear saved errors
            </button>

            <ul className="space-y-2 max-h-48 overflow-y-auto text-xs text-gray-700 bg-gray-100 p-3 rounded border border-gray-200">
              {logs.map((log, idx) => (
                <li key={idx} className="border-b border-gray-300 pb-2">
                  <strong>{new Date(log.timestamp).toLocaleString()}</strong>
                  <div>{log.message}</div>
                  <pre className="whitespace-pre-wrap text-gray-500">
                    {log.stack}
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
