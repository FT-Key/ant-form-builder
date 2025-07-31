// components/PreviewArea.tsx
import { Form } from "antd";
import ReactJsxParser from "react-jsx-parser";

export default function PreviewArea({
  manualCode,
  components,
  previewRef,
}: {
  manualCode: string;
  components: any;
  previewRef: any;
}) {
  return (
    <div
      className="form-capture-area lg:col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-96"
      ref={previewRef}
    >
      <div className="p-8">
        {manualCode.trim() ? (
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
            <Form
              layout="vertical"
              className="max-w-lg mx-auto"
              onFinish={(values) => console.log("Form values:", values)}
            >
              <ReactJsxParser
                jsx={manualCode}
                components={components}
                key={manualCode}
              />
            </Form>
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
      </div>
    </div>
  );
}
