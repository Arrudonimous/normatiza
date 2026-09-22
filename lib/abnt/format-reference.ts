import { formatAuthors } from "./authors";
import type {
  ArtigoReference,
  CapituloReference,
  LegislacaoReference,
  LivroReference,
  Reference,
  ReferenceSegment,
  SiteReference,
  TccReference,
} from "./types";

function seg(text: string, bold = false): ReferenceSegment {
  return { text, bold };
}

/** Junta segmentos vizinhos que têm o mesmo `bold`, evitando fragmentação desnecessária. */
function mergeSegments(segments: ReferenceSegment[]): ReferenceSegment[] {
  const merged: ReferenceSegment[] = [];
  for (const s of segments) {
    if (!s.text) continue;
    const last = merged[merged.length - 1];
    if (last && !!last.bold === !!s.bold) {
      last.text += s.text;
    } else {
      merged.push({ ...s });
    }
  }
  return merged;
}

function formatLivro(ref: LivroReference): ReferenceSegment[] {
  const autores = formatAuthors(ref.autores);
  const subtitulo = ref.subtitulo ? `: ${ref.subtitulo}` : "";
  const edicao = ref.edicao ? ` ${ref.edicao}. ed.` : "";
  return mergeSegments([
    seg(`${autores}. `),
    seg(`${ref.titulo}`, true),
    seg(`${subtitulo}.${edicao} ${ref.cidade}: ${ref.editora}, ${ref.ano}.`),
  ]);
}

function formatArtigo(ref: ArtigoReference): ReferenceSegment[] {
  const autores = formatAuthors(ref.autores);
  const cidade = ref.cidade ? `${ref.cidade}, ` : "";
  const volume = ref.volume ? `v. ${ref.volume}, ` : "";
  const numero = ref.numero ? `n. ${ref.numero}, ` : "";
  const paginas =
    ref.paginaInicial && ref.paginaFinal
      ? `p. ${ref.paginaInicial}-${ref.paginaFinal}, `
      : "";
  // meses abreviados (ex.: "jul.") já trazem o ponto, então não duplicamos aqui
  const mes = ref.mes ? `${ref.mes} ` : "";
  return mergeSegments([
    seg(`${autores}. ${ref.titulo}. `),
    seg(ref.revista, true),
    seg(`, ${cidade}${volume}${numero}${paginas}${mes}${ref.ano}.`),
  ]);
}

function formatSite(ref: SiteReference): ReferenceSegment[] {
  const autores = formatAuthors(ref.autores);
  const prefixo = autores ? `${autores}. ` : "";
  const anoPublicacao = ref.ano ? `, ${ref.ano}` : "";
  const nomeSite = ref.nomeSite ? `${ref.nomeSite}${anoPublicacao}. ` : "";
  return mergeSegments([
    seg(`${prefixo}${ref.titulo}. ${nomeSite}`),
    seg(
      `Disponível em: ${ref.url}. Acesso em: ${ref.diaAcesso} ${ref.mesAcesso} ${ref.anoAcesso}.`,
    ),
  ]);
}

function formatCapitulo(ref: CapituloReference): ReferenceSegment[] {
  const autoresCapitulo = formatAuthors(ref.autores);
  const autoresObra = formatAuthors(ref.autoresObra);
  const paginas =
    ref.paginaInicial && ref.paginaFinal
      ? ` p. ${ref.paginaInicial}-${ref.paginaFinal}.`
      : "";
  return mergeSegments([
    seg(`${autoresCapitulo}. ${ref.tituloCapitulo}. In: ${autoresObra}. `),
    seg(ref.tituloObra, true),
    seg(`. ${ref.cidade}: ${ref.editora}, ${ref.ano}.${paginas}`),
  ]);
}

function formatTcc(ref: TccReference): ReferenceSegment[] {
  const autores = formatAuthors(ref.autores);
  const subtitulo = ref.subtitulo ? `: ${ref.subtitulo}` : "";
  const folhas = ref.numeroFolhas ? ` ${ref.numeroFolhas} f.` : "";
  return mergeSegments([
    seg(`${autores}. `),
    seg(ref.titulo, true),
    seg(
      `${subtitulo}. ${ref.ano}.${folhas} ${ref.tipo} (${ref.grau} em ${ref.curso}) - ${ref.instituicao}, ${ref.cidade}, ${ref.ano}.`,
    ),
  ]);
}

function formatLegislacao(ref: LegislacaoReference): ReferenceSegment[] {
  const ementa = ref.ementa ? ` ${ref.ementa}.` : "";
  const acesso =
    ref.url && ref.diaAcesso && ref.mesAcesso && ref.anoAcesso
      ? ` Disponível em: ${ref.url}. Acesso em: ${ref.diaAcesso} ${ref.mesAcesso} ${ref.anoAcesso}.`
      : "";
  return mergeSegments([
    seg(
      `${ref.jurisdicao}. ${ref.titulo} nº ${ref.numero}, de ${ref.data}.${ementa}${acesso}`,
    ),
  ]);
}

export function formatReference(ref: Reference): ReferenceSegment[] {
  switch (ref.type) {
    case "livro":
      return formatLivro(ref);
    case "artigo":
      return formatArtigo(ref);
    case "site":
      return formatSite(ref);
    case "capitulo":
      return formatCapitulo(ref);
    case "tcc":
      return formatTcc(ref);
    case "legislacao":
      return formatLegislacao(ref);
  }
}

export function segmentsToPlainText(segments: ReferenceSegment[]): string {
  return segments.map((s) => s.text).join("");
}

export function segmentsToHtml(segments: ReferenceSegment[]): string {
  return segments
    .map((s) => (s.bold ? `<strong>${escapeHtml(s.text)}</strong>` : escapeHtml(s.text)))
    .join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
