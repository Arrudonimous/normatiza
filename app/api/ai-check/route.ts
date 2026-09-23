import { NextRequest, NextResponse } from "next/server";
import { detectAiText, translateToEnglish } from "@/lib/ai-detection/huggingface";
import { ANONYMOUS_DAILY_LIMIT, registerAndCheckLimit } from "@/lib/db/ai-check-usage";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getActivePackWithQuota } from "@/lib/db/packs";

// Modelos gratuitos do Hugging Face podem levar um tempo pra "esquentar" na primeira
// chamada; dá mais margem que o padrão de 10s da Vercel.
export const maxDuration = 60;

// Três planos de uso: quem não tem conta só experimenta um trecho curto; logado
// analisa mais texto; quem tem pacote ativo ou é admin recebe uma varredura em
// vários trechos do documento, não só uma amostra do começo.
const TIERS = {
  anonymous: { wordLimit: 350, sections: 1, name: "sem conta" },
  loggedIn: { wordLimit: 800, sections: 2, name: "conta grátis" },
  full: { wordLimit: 1500, sections: 4, name: "pacote" },
} as const;

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  let tier: (typeof TIERS)[keyof typeof TIERS] = TIERS.anonymous;
  if (user) {
    const hasFullAccess = user.isAdmin || Boolean(await getActivePackWithQuota(user.id));
    tier = hasFullAccess ? TIERS.full : TIERS.loggedIn;
  }

  if (!user) {
    const ip = clientIp(request);
    const { allowed, count } = await registerAndCheckLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Você já usou as ${ANONYMOUS_DAILY_LIMIT} verificações grátis de hoje (${count - 1}). Crie uma conta pra continuar.`,
          rateLimited: true,
        },
        { status: 429 },
      );
    }
  }

  const { text } = (await request.json()) as { text?: string };
  const trimmed = (text ?? "").trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount < 40) {
    return NextResponse.json(
      { error: "Escreva pelo menos uns dois parágrafos pra ter uma estimativa confiável." },
      { status: 400 },
    );
  }

  if (wordCount > tier.wordLimit) {
    return NextResponse.json(
      {
        error: `Esse trecho tem ${wordCount} palavras. O plano ${tier.name} analisa até ${tier.wordLimit}.`,
        limitExceeded: true,
        limit: tier.wordLimit,
        tier: tier.name,
      },
      { status: 402 },
    );
  }

  try {
    const english = await translateToEnglish(trimmed);
    const result = await detectAiText(english, tier.sections);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Não deu pra verificar agora." },
      { status: 502 },
    );
  }
}
