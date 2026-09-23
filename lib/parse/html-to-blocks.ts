import { parse, type HTMLElement, NodeType } from "node-html-parser";
import type { DocumentBlock } from "../document-model";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * Converte o HTML que o mammoth gera a partir de um .docx pro nosso modelo de
 * blocos. Só reconhece título (h1-h6, com h4-h6 achatados pro nível 3), parágrafo
 * e citação (blockquote): qualquer outra coisa (lista, tabela, imagem) é ignorada
 * nessa primeira versão, condizente com a importação sendo "melhor esforço".
 */
export function htmlToBlocks(html: string): DocumentBlock[] {
  const root = parse(html);
  const blocks: DocumentBlock[] = [];

  for (const node of root.childNodes) {
    if (node.nodeType !== NodeType.ELEMENT_NODE) continue;
    const el = node as HTMLElement;
    const tag = el.tagName?.toLowerCase();
    const text = el.text.trim();
    if (!text) continue;

    if (tag && HEADING_TAGS.has(tag)) {
      const level = Math.min(Number(tag[1]), 3) as 1 | 2 | 3;
      blocks.push({ type: "heading", level, text });
    } else if (tag === "blockquote") {
      blocks.push({ type: "quote", text });
    } else if (tag === "p") {
      blocks.push({ type: "paragraph", text });
    }
  }

  return blocks;
}
