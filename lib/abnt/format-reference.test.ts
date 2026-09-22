import { describe, expect, it } from "vitest";
import { formatReference, segmentsToPlainText } from "./format-reference";
import { sortReferences } from "./sort-references";
import type { Reference } from "./types";

function plain(ref: Reference): string {
  return segmentsToPlainText(formatReference(ref));
}

describe("formatReference", () => {
  it("formata livro com edição e subtítulo", () => {
    const ref: Reference = {
      id: "1",
      type: "livro",
      autores: [{ sobrenome: "Silva", nome: "João" }],
      titulo: "A gestão de projetos",
      subtitulo: "uma abordagem prática",
      edicao: "2",
      cidade: "São Paulo",
      editora: "Atlas",
      ano: "2019",
    };
    expect(plain(ref)).toBe(
      "SILVA, João. A gestão de projetos: uma abordagem prática. 2. ed. São Paulo: Atlas, 2019.",
    );
  });

  it("formata livro com mais de 3 autores usando et al.", () => {
    const ref: Reference = {
      id: "2",
      type: "livro",
      autores: [
        { sobrenome: "Silva", nome: "João" },
        { sobrenome: "Souza", nome: "Maria" },
        { sobrenome: "Costa", nome: "Ana" },
        { sobrenome: "Lima", nome: "Pedro" },
      ],
      titulo: "Engenharia de software",
      cidade: "Rio de Janeiro",
      editora: "Campus",
      ano: "2020",
    };
    expect(plain(ref)).toBe(
      "SILVA, João et al. Engenharia de software. Rio de Janeiro: Campus, 2020.",
    );
  });

  it("formata artigo científico", () => {
    const ref: Reference = {
      id: "3",
      type: "artigo",
      autores: [{ sobrenome: "Oliveira", nome: "Carla" }],
      titulo: "Inteligência artificial na educação",
      revista: "Revista Brasileira de Educação",
      cidade: "Brasília",
      volume: "25",
      numero: "3",
      paginaInicial: "45",
      paginaFinal: "60",
      mes: "jul.",
      ano: "2021",
    };
    expect(plain(ref)).toBe(
      "OLIVEIRA, Carla. Inteligência artificial na educação. Revista Brasileira de Educação, Brasília, v. 25, n. 3, p. 45-60, jul. 2021.",
    );
  });

  it("formata site com data de acesso", () => {
    const ref: Reference = {
      id: "4",
      type: "site",
      autores: [{ sobrenome: "Ibge", nome: "" }],
      titulo: "Censo demográfico 2022",
      nomeSite: "IBGE",
      ano: "2022",
      url: "https://www.ibge.gov.br/censo2022",
      diaAcesso: "10",
      mesAcesso: "mar.",
      anoAcesso: "2024",
    };
    expect(plain(ref)).toBe(
      "IBGE. Censo demográfico 2022. IBGE, 2022. Disponível em: https://www.ibge.gov.br/censo2022. Acesso em: 10 mar. 2024.",
    );
  });

  it("formata capítulo de livro", () => {
    const ref: Reference = {
      id: "5",
      type: "capitulo",
      autores: [{ sobrenome: "Pereira", nome: "Lucas" }],
      tituloCapitulo: "Metodologias ágeis",
      autoresObra: [{ sobrenome: "Santos", nome: "Rafael" }],
      tituloObra: "Fundamentos de engenharia de software",
      cidade: "Porto Alegre",
      editora: "Bookman",
      ano: "2018",
      paginaInicial: "120",
      paginaFinal: "145",
    };
    expect(plain(ref)).toBe(
      "PEREIRA, Lucas. Metodologias ágeis. In: SANTOS, Rafael. Fundamentos de engenharia de software. Porto Alegre: Bookman, 2018. p. 120-145.",
    );
  });

  it("formata TCC", () => {
    const ref: Reference = {
      id: "6",
      type: "tcc",
      autores: [{ sobrenome: "Arruda", nome: "Diego" }],
      titulo: "Formatação automática de referências acadêmicas",
      ano: "2026",
      numeroFolhas: "60",
      tipo: "TCC",
      curso: "Ciência da Computação",
      grau: "Graduação",
      instituicao: "Unip",
      cidade: "São Paulo",
    };
    expect(plain(ref)).toBe(
      "ARRUDA, Diego. Formatação automática de referências acadêmicas. 2026. 60 f. TCC (Graduação em Ciência da Computação) - Unip, São Paulo, 2026.",
    );
  });

  it("formata legislação", () => {
    const ref: Reference = {
      id: "7",
      type: "legislacao",
      jurisdicao: "BRASIL",
      titulo: "Lei",
      numero: "13.709",
      data: "14 de agosto de 2018",
      ementa: "Lei Geral de Proteção de Dados Pessoais",
      url: "https://www.planalto.gov.br/lgpd",
      diaAcesso: "5",
      mesAcesso: "jan.",
      anoAcesso: "2025",
    };
    expect(plain(ref)).toBe(
      "BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais. Disponível em: https://www.planalto.gov.br/lgpd. Acesso em: 5 jan. 2025.",
    );
  });
});

describe("sortReferences", () => {
  it("ordena alfabeticamente pelo sobrenome do primeiro autor", () => {
    const refs: Reference[] = [
      {
        id: "1",
        type: "livro",
        autores: [{ sobrenome: "Souza", nome: "Maria" }],
        titulo: "Título B",
        cidade: "SP",
        editora: "Ed",
        ano: "2020",
      },
      {
        id: "2",
        type: "livro",
        autores: [{ sobrenome: "Alves", nome: "João" }],
        titulo: "Título A",
        cidade: "SP",
        editora: "Ed",
        ano: "2020",
      },
    ];
    const sorted = sortReferences(refs);
    expect(sorted.map((r) => r.id)).toEqual(["2", "1"]);
  });
});
