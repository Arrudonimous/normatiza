import { authorSortKey } from "./authors";
import type { Reference } from "./types";

function referenceSortKey(ref: Reference): string {
  switch (ref.type) {
    case "livro":
    case "artigo":
    case "site":
    case "capitulo":
    case "tcc":
      return authorSortKey(ref.autores) || ("titulo" in ref ? ref.titulo : "");
    case "legislacao":
      return ref.jurisdicao;
  }
}

/** Ordem alfabética por sobrenome do primeiro autor, regra ABNT pra lista de referências. */
export function sortReferences(refs: Reference[]): Reference[] {
  return [...refs].sort((a, b) =>
    referenceSortKey(a).localeCompare(referenceSortKey(b), "pt-BR"),
  );
}
