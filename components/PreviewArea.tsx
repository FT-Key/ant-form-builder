"use client";

import { Form, Button } from "antd";
import ReactJsxParser from "react-jsx-parser";
import ErrorBoundary from "./ErrorBoundary";
import { useState } from "react";
import { ShrinkOutlined } from "@ant-design/icons";

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
}: {
  code: string;
  components: any;
  previewRef: any;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
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
        <div className="absolute top-4 right-4 z-[110]">
          <Button
            type="default"
            onClick={() => setIsExpanded(false)}
            icon={<ShrinkOutlined />}
          />
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
              Logs de errores recientes (últimos {logs.length})
            </h3>
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
