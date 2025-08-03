import { NextResponse } from "next/server";

export const AI_CONFIG = {
  model: "deepseek/deepseek-v3-0324",
  maxTokens: 4096, // Aumentado para permitir respuestas largas
  temperature: 0.7,
  apiUrl: "https://router.huggingface.co/novita/v3/openai/chat/completions",
};

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Limpia código eliminando bloques de markdown ```jsx ... ```
function cleanCode(rawCode: string): string {
  return rawCode
    .replace(/```(?:jsx)?\s*([\s\S]*?)```/gi, (_, innerCode) =>
      innerCode.trim()
    )
    .trim();
}

// Verifica si el código tiene signos de estar truncado
function isPossiblyTruncated(code: string): boolean {
  // Heurística: termina con etiqueta sin cerrar o no contiene cierres comunes
  return (
    code.length >= AI_CONFIG.maxTokens - 50 || // Casi tocó el límite
    /<\w[^>]*$/.test(code) || // termina con etiqueta abierta
    (code.includes("<Form.Item") && !code.includes("</Form.Item>")) ||
    (code.includes("<Form") && !code.includes("</Form>"))
  );
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

    const version = body.version || "v5";
    const systemMessage: ChatMessage = {
      role: "system",
      content:
        `You are a React code generator. ONLY return valid JSX code for forms using Ant Design version ${version}. ` +
        "Each <Form.Item> with a `name` prop MUST have exactly one single child element. " +
        "Do NOT include explanations, comments, or markdown. Return ONLY clean, valid JSX code.",
    };

    let messages: ChatMessage[] = [];

    if (Array.isArray(body.messages)) {
      const rawMessages = body.messages as ChatMessage[];
      messages = [
        systemMessage,
        ...rawMessages.filter((m) => m.role && m.content),
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
    const cleaned = cleanCode(rawCode);

    if (isPossiblyTruncated(cleaned)) {
      console.warn("⚠️ Respuesta posiblemente truncada o malformada");
      return NextResponse.json(
        {
          error:
            "La respuesta generada parece estar incompleta o malformada. Intenta pedir menos componentes.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ code: cleaned });
  } catch (error: any) {
    console.error("❌ Error interno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
