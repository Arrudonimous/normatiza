export interface AiCheckResultData {
  aiProbability: number;
  label: "ai" | "human" | "unknown";
  sections: number;
}

export function AiCheckResult({ result }: { result: AiCheckResultData }) {
  const percent = Math.round(result.aiProbability * 100);
  const sectionsNote =
    result.sections > 1 ? ` Análise feita em ${result.sections} trechos do texto.` : "";

  if (result.label === "unknown") {
    return (
      <p className="text-sm text-ink">
        O modelo não deu um resultado claro dessa vez ({percent}% de confiança num rótulo
        genérico). Tente de novo com um trecho maior.
      </p>
    );
  }

  const isAi = result.label === "ai";
  const tone = isAi ? (percent > 65 ? "text-red" : "text-ink") : "text-ink";

  return (
    <p className={`text-sm ${tone}`}>
      {isAi
        ? `Cerca de ${percent}% de chance de esse texto parecer gerado por IA. Vale reescrever com suas próprias palavras antes de entregar.`
        : `Cerca de ${100 - percent}% de chance de esse texto parecer escrito por humano. Sinal tranquilo, mas vale revisar do mesmo jeito.`}
      {sectionsNote}
    </p>
  );
}
