"use client";

import { useState } from "react";
import Link from "next/link";
import { AiCheckResult, type AiCheckResultData } from "@/components/ai-check/ai-check-result";
import { inputClass, primaryButtonClass } from "@/components/ui/field";

interface ErrorState {
  message: string;
  limitExceeded?: boolean;
  rateLimited?: boolean;
}

export function AiCheckerClient({
  loggedIn,
  hasFullAccess,
}: {
  loggedIn: boolean;
  hasFullAccess: boolean;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCheckResultData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError({
          message: data.error ?? "Não deu pra verificar agora.",
          limitExceeded: data.limitExceeded,
          rateLimited: data.rateLimited,
        });
        return;
      }
      setResult(data);
    } catch {
      setError({ message: "Não deu pra verificar agora. Tenta de novo em instantes." });
    } finally {
      setLoading(false);
    }
  }

  const tierLabel = hasFullAccess
    ? "Seu pacote libera até 1.500 palavras por verificação, em até 4 trechos do texto."
    : loggedIn
      ? "Sua conta libera até 800 palavras por verificação."
      : "Sem conta, dá pra verificar até 350 palavras por vez, 15 vezes por dia.";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <span className="text-xs font-semibold tracking-wide text-red">Ferramenta grátis</span>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
        Esse texto parece escrito por IA?
      </h1>
      <p className="mt-4 max-w-[60ch] text-ink-muted">
        Cola um trecho do seu trabalho e a gente traduz pra inglês e roda um classificador
        treinado pra distinguir texto humano de texto gerado por ChatGPT. É uma estimativa,
        não uma prova: serve pra você revisar antes de entregar, não pra acusar ninguém.
      </p>
      <p className="mt-2 text-sm text-ink-muted">{tierLabel}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole aqui o trecho que você quer verificar..."
        rows={10}
        className={`${inputClass} mt-6 h-auto w-full resize-y py-3`}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
        <span>{wordCount} palavras</span>
      </div>

      <button
        onClick={handleCheck}
        disabled={loading || wordCount < 40}
        className={`mt-4 ${primaryButtonClass}`}
      >
        {loading ? "Analisando..." : "Verificar texto"}
      </button>

      {wordCount > 0 && wordCount < 40 && (
        <p className="mt-3 text-xs text-ink-muted">
          Escreva pelo menos uns dois parágrafos (40 palavras) pra ter uma estimativa confiável.
        </p>
      )}

      {error && (
        <div className="mt-4 flex flex-col gap-2 border border-l-4 border-rule border-l-red bg-paper-raised py-3 pl-4 pr-3">
          <p className="text-sm text-red">{error.message}</p>
          {error.limitExceeded && !loggedIn && (
            <Link href="/signup" className="text-sm text-red underline underline-offset-2">
              Criar conta grátis pra analisar textos maiores
            </Link>
          )}
          {error.limitExceeded && loggedIn && !hasFullAccess && (
            <Link href="/editor" className="text-sm text-red underline underline-offset-2">
              Exportar um documento no editor libera o pacote, que analisa textos maiores
            </Link>
          )}
          {error.rateLimited && (
            <Link href="/signup" className="text-sm text-red underline underline-offset-2">
              Criar conta grátis pra continuar verificando hoje
            </Link>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 border border-rule bg-paper-raised p-5">
          <AiCheckResult result={result} />
        </div>
      )}
    </main>
  );
}
