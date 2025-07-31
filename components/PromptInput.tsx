// components/PromptInput.tsx
import { ThunderboltOutlined, RocketOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";

const { TextArea } = Input;

export default function PromptInput({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
      <div className="space-y-6">
        <div className="relative">
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe your form requirements..."
            className="w-full border-gray-200 text-gray-900 placeholder-gray-400 rounded-md resize-none focus:border-gray-400 focus:ring-0"
            style={{ fontSize: "15px", lineHeight: "1.6", fontWeight: "400" }}
          />
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-md">
              <div className="flex items-center gap-3 text-gray-700">
                <ThunderboltOutlined className="animate-spin text-lg" />
                <span className="font-medium text-sm">Generating form...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={onGenerate}
            loading={isGenerating}
            className="flex-1 sm:flex-none h-11 bg-gray-900 border-gray-900 hover:bg-gray-800 font-medium"
          >
            {isGenerating ? "Generating..." : "Generate Form"}
          </Button>
        </div>
      </div>
    </div>
  );
}
