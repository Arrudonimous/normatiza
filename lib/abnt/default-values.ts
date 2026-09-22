import type { ReferenceFormValues } from "./schemas";
import type { ReferenceType } from "./types";

export function defaultValuesForType(type: ReferenceType): ReferenceFormValues {
  switch (type) {
    case "livro":
      return {
        type: "livro",
        autores: [{ sobrenome: "", nome: "" }],
        titulo: "",
        subtitulo: "",
        edicao: "",
        cidade: "",
        editora: "",
        ano: "",
      };
    case "artigo":
      return {
        type: "artigo",
        autores: [{ sobrenome: "", nome: "" }],
        titulo: "",
        revista: "",
        cidade: "",
        volume: "",
        numero: "",
        paginaInicial: "",
        paginaFinal: "",
        mes: "",
        ano: "",
      };
    case "site":
      return {
        type: "site",
        autores: [],
        titulo: "",
        nomeSite: "",
        ano: "",
        url: "",
        diaAcesso: "",
        mesAcesso: "",
        anoAcesso: "",
      };
    case "capitulo":
      return {
        type: "capitulo",
        autores: [{ sobrenome: "", nome: "" }],
        tituloCapitulo: "",
        autoresObra: [{ sobrenome: "", nome: "" }],
        tituloObra: "",
        cidade: "",
        editora: "",
        ano: "",
        paginaInicial: "",
        paginaFinal: "",
      };
    case "tcc":
      return {
        type: "tcc",
        autores: [{ sobrenome: "", nome: "" }],
        titulo: "",
        subtitulo: "",
        ano: "",
        numeroFolhas: "",
        tipo: "TCC",
        curso: "",
        grau: "Graduação",
        instituicao: "",
        cidade: "",
      };
    case "legislacao":
      return {
        type: "legislacao",
        jurisdicao: "BRASIL",
        titulo: "Lei",
        numero: "",
        data: "",
        ementa: "",
        url: "",
        diaAcesso: "",
        mesAcesso: "",
        anoAcesso: "",
      };
  }
}
