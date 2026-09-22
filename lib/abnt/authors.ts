import type { Author } from "./types";

function formatSingleAuthor(author: Author): string {
  const sobrenome = author.sobrenome.trim().toUpperCase();
  const nome = author.nome.trim();
  return nome ? `${sobrenome}, ${nome}` : sobrenome;
}

/**
 * Regra ABNT NBR 6023: até 3 autores, lista todos separados por ";".
 * Acima de 3, usa apenas o primeiro seguido de "et al.".
 */
export function formatAuthors(authors: Author[]): string {
  if (authors.length === 0) return "";
  if (authors.length > 3) {
    // sem ponto final aqui: quem chama já encerra a frase com ". "
    return `${formatSingleAuthor(authors[0])} et al`;
  }
  return authors.map(formatSingleAuthor).join("; ");
}

/** Chave de ordenação alfabética: sobrenome do primeiro autor. */
export function authorSortKey(authors: Author[]): string {
  if (authors.length === 0) return "";
  return authors[0].sobrenome.trim().toUpperCase();
}
