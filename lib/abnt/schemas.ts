import { z } from "zod";

const authorSchema = z.object({
  sobrenome: z.string().min(1, "Informe o sobrenome"),
  nome: z.string(),
});

const authorsSchema = z.array(authorSchema).min(1, "Adicione pelo menos um autor");

export const livroSchema = z.object({
  type: z.literal("livro"),
  autores: authorsSchema,
  titulo: z.string().min(1, "Informe o título"),
  subtitulo: z.string().optional(),
  edicao: z.string().optional(),
  cidade: z.string().min(1, "Informe a cidade"),
  editora: z.string().min(1, "Informe a editora"),
  ano: z.string().min(4, "Informe o ano"),
});

export const artigoSchema = z.object({
  type: z.literal("artigo"),
  autores: authorsSchema,
  titulo: z.string().min(1, "Informe o título do artigo"),
  revista: z.string().min(1, "Informe o nome da revista"),
  cidade: z.string().optional(),
  volume: z.string().optional(),
  numero: z.string().optional(),
  paginaInicial: z.string().optional(),
  paginaFinal: z.string().optional(),
  mes: z.string().optional(),
  ano: z.string().min(4, "Informe o ano"),
});

export const siteSchema = z.object({
  type: z.literal("site"),
  autores: z.array(authorSchema),
  titulo: z.string().min(1, "Informe o título da página"),
  nomeSite: z.string().optional(),
  ano: z.string().optional(),
  url: z.string().min(1, "Informe a URL"),
  diaAcesso: z.string().min(1, "Informe o dia de acesso"),
  mesAcesso: z.string().min(1, "Informe o mês de acesso"),
  anoAcesso: z.string().min(4, "Informe o ano de acesso"),
});

export const capituloSchema = z.object({
  type: z.literal("capitulo"),
  autores: authorsSchema,
  tituloCapitulo: z.string().min(1, "Informe o título do capítulo"),
  autoresObra: authorsSchema,
  tituloObra: z.string().min(1, "Informe o título da obra"),
  cidade: z.string().min(1, "Informe a cidade"),
  editora: z.string().min(1, "Informe a editora"),
  ano: z.string().min(4, "Informe o ano"),
  paginaInicial: z.string().optional(),
  paginaFinal: z.string().optional(),
});

export const tccSchema = z.object({
  type: z.literal("tcc"),
  autores: authorsSchema,
  titulo: z.string().min(1, "Informe o título"),
  subtitulo: z.string().optional(),
  ano: z.string().min(4, "Informe o ano"),
  numeroFolhas: z.string().optional(),
  tipo: z.enum(["TCC", "Dissertação", "Tese"]),
  curso: z.string().min(1, "Informe o curso"),
  grau: z.string().min(1, "Informe o grau (ex.: Graduação)"),
  instituicao: z.string().min(1, "Informe a instituição"),
  cidade: z.string().min(1, "Informe a cidade"),
});

export const legislacaoSchema = z.object({
  type: z.literal("legislacao"),
  jurisdicao: z.string().min(1, "Informe a jurisdição (ex.: BRASIL)"),
  titulo: z.string().min(1, "Informe o tipo de norma (ex.: Lei)"),
  numero: z.string().min(1, "Informe o número"),
  data: z.string().min(1, "Informe a data"),
  ementa: z.string().optional(),
  url: z.string().optional(),
  diaAcesso: z.string().optional(),
  mesAcesso: z.string().optional(),
  anoAcesso: z.string().optional(),
});

export const referenceFormSchema = z.discriminatedUnion("type", [
  livroSchema,
  artigoSchema,
  siteSchema,
  capituloSchema,
  tccSchema,
  legislacaoSchema,
]);

export type ReferenceFormValues = z.infer<typeof referenceFormSchema>;
