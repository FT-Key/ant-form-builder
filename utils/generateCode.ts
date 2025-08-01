import { AntdVersion } from "../context/AntdVersionContext";

export const buildMessages = (code: string, activeVersion: any) => {
  const systemMessage = {
    role: "system",
    content:
      "You generate React forms using Ant Design only. Use <Form>, <Form.Item>, <Input>, <Button>, etc. Return ONLY JSX code without explanations.",
  };
  const codeContext = {
    role: "user",
    content: `Current form code:\n${code}`,
  };
  const baseMessages = activeVersion?.messages || [];
  return [systemMessage, codeContext, ...baseMessages];
};

export const fetchGeneratedCode = async (
  prompt: string,
  code: string,
  activeVersion: any,
  versions: any[],
  setState: (data: {
    code: string;
    messages: any[];
    newVersionId: number;
  }) => void
) => {
  const userMessage = { role: "user", content: prompt.trim() };

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: buildMessages(code, activeVersion).concat(userMessage),
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const maxId = versions.length ? Math.max(...versions.map((v) => v.id)) : 0;
  const rawCode = data.code || "";
  const cleanedCode = rawCode.includes("<Form")
    ? rawCode.replace(/<Form[^>]*>([\s\S]*?)<\/Form>/i, "$1").trim()
    : rawCode;

  setState({
    code: cleanedCode,
    messages: [
      ...(activeVersion?.messages || []),
      userMessage,
      { role: "assistant", content: data.code },
    ],
    newVersionId: maxId + 1,
  });
};
