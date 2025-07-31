import { NextResponse } from "next/server";

export const AI_CONFIG = {
  model: "deepseek/deepseek-v3-0324",
  maxTokens: 1000,
  temperature: 0.7,
  apiUrl: "https://router.huggingface.co/novita/v3/openai/chat/completions",
};

// Función para limpiar código quitando bloques ```jsx ... ```
function cleanCode(rawCode: string): string {
  return rawCode
    .replace(/```(?:jsx)?\s*([\s\S]*?)```/gi, (_, innerCode) =>
      innerCode.trim()
    )
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) {
      return NextResponse.json(
        { error: "Token de Hugging Face no configurado" },
        { status: 500 }
      );
    }

    const version = body.version || "v5"; // default
    const systemMessage = {
      role: "system",
      content:
        `You are a React code generator. ONLY return valid JSX code for forms using Ant Design version ${version}. ` +
        "Each <Form.Item> with a `name` prop MUST have exactly one single child element. " +
        "Do NOT include explanations, comments, or markdown. Return ONLY clean, valid JSX code.",
    };

    let messages = [];

    if (Array.isArray(body.messages)) {
      messages = [
        systemMessage,
        ...body.messages.filter((m) => m.role && m.content),
      ];
    } else if (
      typeof body.prompt === "string" &&
      body.prompt.trim().length > 0
    ) {
      messages = [systemMessage, { role: "user", content: body.prompt.trim() }];
    } else {
      return NextResponse.json(
        { error: "Prompt o messages inválidos o vacíos" },
        { status: 400 }
      );
    }

    const response = await fetch(AI_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Error de Hugging Face: " + errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawCode = data.choices?.[0]?.message?.content ?? "";
    const code = cleanCode(rawCode);

    return NextResponse.json({ code });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
