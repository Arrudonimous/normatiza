"use client";

import { useState } from "react";
import { AiCheckResult, type AiCheckResultData } from "@/components/ai-check/ai-check-result";
import { panelClass, secondaryButtonClass } from "@/components/ui/field";
import type { DocumentBlock } from "@/lib/document-model";

// Cobre o limite de quem tem conta mas ainda não comprou pacote (ver TIERS em
// app/api/ai-check/route.ts), pra não travar com "texto grande demais" à toa.
const MAX_WORDS_FROM_EDITOR = 750;

function extractPlainText(blocks: DocumentBlock[]): string {
  const fullText = blocks
    .filter((b) => b.type === "paragraph" || b.type === "quote")
    .map((b) => b.text)
    .join(" ");
  return fullText.split(/\s+/).filter(Boolean).slice(0, MAX_WORDS_FROM_EDITOR).join(" ");
}

export function AiCheckPanel({ blocks }: { blocks: DocumentBlock[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCheckResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const text = extractPlainText(blocks);
      const res = await fetch("/api/ai-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não deu pra verificar agora.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={panelClass}>
      <h2 className="text-sm font-medium text-ink-muted">Parece com IA?</h2>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        Estimativa experimental: traduzimos uma amostra do seu texto (até {MAX_WORDS_FROM_EDITOR}{" "}
        palavras) pro inglês antes de analisar, porque o modelo é treinado nesse idioma. Não é
        prova de nada, é só um alerta pra você revisar antes de entregar.
      </p>

      <button onClick={handleCheck} disabled={loading} className={`mt-4 ${secondaryButtonClass}`}>
        {loading ? "Analisando..." : "Verificar amostra do texto"}
      </button>

      {error && <p className="mt-3 text-xs text-red">{error}</p>}

      {result && (
        <div className="mt-4">
          <AiCheckResult result={result} />
        </div>
      )}
    </div>
  );
}
