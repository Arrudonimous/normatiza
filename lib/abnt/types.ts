export interface Author {
  sobrenome: string;
  nome: string;
}

interface BaseReference {
  id: string;
}

export interface LivroReference extends BaseReference {
  type: "livro";
  autores: Author[];
  titulo: string;
  subtitulo?: string;
  edicao?: string;
  cidade: string;
  editora: string;
  ano: string;
}

export interface ArtigoReference extends BaseReference {
  type: "artigo";
  autores: Author[];
  titulo: string;
  revista: string;
  cidade?: string;
  volume?: string;
  numero?: string;
  paginaInicial?: string;
  paginaFinal?: string;
  mes?: string;
  ano: string;
}

export interface SiteReference extends BaseReference {
  type: "site";
  autores: Author[];
  titulo: string;
  nomeSite?: string;
  url: string;
  diaAcesso: string;
  mesAcesso: string;
  anoAcesso: string;
  ano?: string;
}

export interface CapituloReference extends BaseReference {
  type: "capitulo";
  autores: Author[];
  tituloCapitulo: string;
  autoresObra: Author[];
  tituloObra: string;
  cidade: string;
  editora: string;
  ano: string;
  paginaInicial?: string;
  paginaFinal?: string;
}

export interface TccReference extends BaseReference {
  type: "tcc";
  autores: Author[];
  titulo: string;
  subtitulo?: string;
  ano: string;
  numeroFolhas?: string;
  tipo: "TCC" | "Dissertação" | "Tese";
  curso: string;
  grau: string;
  instituicao: string;
  cidade: string;
}

export interface LegislacaoReference extends BaseReference {
  type: "legislacao";
  jurisdicao: string;
  titulo: string;
  numero: string;
  data: string;
  ementa?: string;
  url?: string;
  diaAcesso?: string;
  mesAcesso?: string;
  anoAcesso?: string;
}

export type Reference =
  | LivroReference
  | ArtigoReference
  | SiteReference
  | CapituloReference
  | TccReference
  | LegislacaoReference;

export type ReferenceType = Reference["type"];

export const REFERENCE_TYPE_LABELS: Record<ReferenceType, string> = {
  livro: "Livro",
  artigo: "Artigo científico",
  site: "Site / página web",
  capitulo: "Capítulo de livro",
  tcc: "TCC / dissertação / tese",
  legislacao: "Legislação",
};

/** Um trecho de referência formatada: `bold` indica se deve ser exibido/exportado em negrito (título da obra, por norma ABNT). */
export interface ReferenceSegment {
  text: string;
  bold?: boolean;
}
