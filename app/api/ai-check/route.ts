import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { detectAiText, translateToEnglish } from "@/lib/ai-detection/huggingface";

// Modelos gratuitos do Hugging Face podem levar um tempo pra "esquentar" na primeira
// chamada; dá mais margem que o padrão de 10s da Vercel.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { text } = (await request.json()) as { text?: string };
  const trimmed = (text ?? "").trim();
  if (trimmed.split(/\s+/).filter(Boolean).length < 40) {
    return NextResponse.json(
      { error: "Escreva pelo menos uns dois parágrafos pra ter uma estimativa confiável." },
      { status: 400 },
    );
  }

  // Analisa uma amostra (não o documento inteiro) pra manter a resposta rápida.
  const sample = trimmed.split(/\s+/).slice(0, 600).join(" ");

  try {
    const english = await translateToEnglish(sample);
    const result = await detectAiText(english);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Não deu pra verificar agora." },
      { status: 502 },
    );
  }
}
