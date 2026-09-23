// A Hugging Face descontinuou o antigo api-inference.huggingface.co em favor desse
// roteador ("Inference Providers"); nem todo modelo antigo continua servido de graça,
// então os dois modelos abaixo foram escolhidos por estarem confirmados como
// disponíveis no provider gratuito "hf-inference" (testado em 2026-09-23).
const HF_API_URL = "https://router.huggingface.co/hf-inference/models";

// Modelo multilíngue de tradução pra inglês (cobre português com o prefixo ">>pt<<").
// O detector abaixo só foi treinado em inglês, então traduzir antes melhora bastante
// a precisão em texto acadêmico em português.
const TRANSLATE_MODEL = "Helsinki-NLP/opus-mt-ROMANCE-en";

// Treinado no dataset HC3 (Hello-SimpleAI) pra distinguir texto humano de texto
// gerado por ChatGPT. Rótulos: "Human" e "ChatGPT".
const DETECT_MODEL = "Hello-SimpleAI/chatgpt-detector-roberta";

function hfHeaders() {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  if (!token) {
    throw new Error(
      "HUGGINGFACE_API_TOKEN não configurada. Gere um token grátis em huggingface.co/settings/tokens.",
    );
  }
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function hfRequest(model: string, payload: unknown, retriesLeft = 2): Promise<unknown> {
  const res = await fetch(`${HF_API_URL}/${model}`, {
    method: "POST",
    headers: hfHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 503 && retriesLeft > 0) {
    // Modelo "frio": a API do Hugging Face está carregando ele, tenta de novo em breve.
    const body = await res.json().catch(() => ({}) as { estimated_time?: number });
    const waitMs = Math.min((body.estimated_time ?? 3) * 1000, 8000);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return hfRequest(model, payload, retriesLeft - 1);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Hugging Face (${model}) respondeu ${res.status}: ${detail.slice(0, 200)}`);
  }

  return res.json();
}

function chunkByWords(text: string, maxWords: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks.length > 0 ? chunks : [""];
}

export async function translateToEnglish(text: string): Promise<string> {
  // Texto formal com números e citações (ex.: "Silva et al. (2023, p. 45)") tokeniza
  // bem mais denso que texto corrido, então 250 palavras por chunk (em vez de 350)
  // e "truncation" no payload evitam o erro "index out of range" do modelo Marian.
  const chunks = chunkByWords(text, 250);
  const translated: string[] = [];

  for (const chunk of chunks) {
    // ">>pt<<" diz pro modelo multilíngue de qual idioma de origem traduzir.
    const result = (await hfRequest(TRANSLATE_MODEL, {
      inputs: `>>pt<< ${chunk}`,
      parameters: { truncation: true },
    })) as { translation_text?: string }[] | { translation_text?: string };
    const item = Array.isArray(result) ? result[0] : result;
    translated.push(item?.translation_text ?? "");
  }

  return translated.join(" ").trim();
}

export interface AiDetectionResult {
  aiProbability: number; // 0 a 1, média entre as seções analisadas
  label: "ai" | "human" | "unknown";
  sections: number; // quantos trechos de ~380 palavras foram analisados
}

interface ClassificationPrediction {
  label: string;
  score: number;
}

interface SectionResult {
  aiProbability: number;
  label: "ai" | "human" | "unknown";
}

// O RoBERTa aceita ~512 tokens, mas texto formal/traduzido pode tokenizar em mais de
// 1 token por palavra (nomes, pontuação, números), então 380 palavras já estourou o
// limite em alguns casos reais. 260 dá mais folga, e "truncation" no payload garante
// que o Hugging Face corta em vez de dar erro se ainda assim passar do limite.
const WORDS_PER_SECTION = 260;

async function detectAiSection(englishChunk: string): Promise<SectionResult> {
  let raw: unknown;
  try {
    raw = await hfRequest(DETECT_MODEL, {
      inputs: englishChunk,
      parameters: { truncation: true },
    });
  } catch (err) {
    // Se mesmo com truncation o texto ainda estourar o limite de tokens do modelo
    // (nomes próprios, números e pontuação tokenizam de forma imprevisível), corta
    // o trecho pela metade e tenta uma última vez em vez de falhar a verificação inteira.
    if (err instanceof Error && /tensor|size/i.test(err.message)) {
      const halfWords = englishChunk.split(/\s+/).filter(Boolean);
      const half = halfWords.slice(0, Math.ceil(halfWords.length / 2)).join(" ");
      raw = await hfRequest(DETECT_MODEL, { inputs: half, parameters: { truncation: true } });
    } else {
      throw err;
    }
  }
  const predictions = (Array.isArray(raw) && Array.isArray(raw[0]) ? raw[0] : raw) as
    ClassificationPrediction[];

  const aiEntry = predictions.find((p) => /ai|chatgpt|gpt|machine|fake|generated/i.test(p.label));
  if (aiEntry) {
    return { aiProbability: aiEntry.score, label: aiEntry.score >= 0.5 ? "ai" : "human" };
  }

  const humanEntry = predictions.find((p) => /human|real/i.test(p.label));
  if (humanEntry) {
    return { aiProbability: 1 - humanEntry.score, label: humanEntry.score >= 0.5 ? "human" : "ai" };
  }

  // Rótulos genéricos (LABEL_0/LABEL_1): não dá pra saber qual é qual com certeza.
  const top = predictions.reduce((a, b) => (b.score > a.score ? b : a));
  return { aiProbability: top.score, label: "unknown" };
}

/**
 * `maxSections` controla quantos trechos de ~380 palavras são analisados (cada um é
 * uma chamada à API). Planos maiores podem varrer mais do texto em vez de só o começo.
 */
export async function detectAiText(englishText: string, maxSections = 1): Promise<AiDetectionResult> {
  const chunks = chunkByWords(englishText, WORDS_PER_SECTION).slice(0, Math.max(1, maxSections));
  const sections = await Promise.all(chunks.map(detectAiSection));

  const known = sections.filter((s) => s.label !== "unknown");
  if (known.length === 0) {
    return { aiProbability: sections[0].aiProbability, label: "unknown", sections: sections.length };
  }

  const avgProbability = known.reduce((sum, s) => sum + s.aiProbability, 0) / known.length;
  return {
    aiProbability: avgProbability,
    label: avgProbability >= 0.5 ? "ai" : "human",
    sections: sections.length,
  };
}
