"use client";

import { useState } from "react";
import { panelClass, secondaryButtonClass } from "@/components/ui/field";
import type { DocumentBlock } from "@/lib/document-model";

function extractPlainText(blocks: DocumentBlock[]): string {
  return blocks
    .filter((b) => b.type === "paragraph" || b.type === "quote")
    .map((b) => b.text)
    .join(" ");
}

interface Result {
  aiProbability: number;
  label: "ai" | "human" | "unknown";
}

export function AiCheckPanel({ blocks }: { blocks: DocumentBlock[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
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
        Estimativa experimental: traduzimos uma amostra do seu texto pro inglês antes de
        analisar, porque o modelo é treinado nesse idioma. Não é prova de nada, é só um
        alerta pra você revisar antes de entregar.
      </p>

      <button onClick={handleCheck} disabled={loading} className={`mt-4 ${secondaryButtonClass}`}>
        {loading ? "Analisando..." : "Verificar amostra do texto"}
      </button>

      {error && <p className="mt-3 text-xs text-red">{error}</p>}

      {result && <AiCheckResult result={result} />}
    </div>
  );
}

function AiCheckResult({ result }: { result: Result }) {
  const percent = Math.round(result.aiProbability * 100);

  if (result.label === "unknown") {
    return (
      <p className="mt-4 text-sm text-ink">
        O modelo não deu um resultado claro dessa vez ({percent}% de confiança num rótulo
        genérico). Tente de novo com um trecho maior.
      </p>
    );
  }

  const isAi = result.label === "ai";
  const tone = isAi ? (percent > 65 ? "text-red" : "text-ink") : "text-ink";

  return (
    <p className={`mt-4 text-sm ${tone}`}>
      {isAi
        ? `Cerca de ${percent}% de chance de esse trecho parecer gerado por IA. Vale reescrever com suas palavras antes de entregar.`
        : `Cerca de ${100 - percent}% de chance de esse trecho parecer escrito por humano. Sinal tranquilo, mas vale revisar do mesmo jeito.`}
    </p>
  );
}
