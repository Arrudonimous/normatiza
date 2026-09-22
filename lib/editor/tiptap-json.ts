import type { JSONContent } from "@tiptap/react";
import type { DocumentBlock } from "../document-model";

export function blocksToTiptapJson(blocks: DocumentBlock[]): JSONContent {
  return {
    type: "doc",
    content: blocks.length > 0 ? blocks.map(blockToNode) : [{ type: "paragraph" }],
  };
}

function blockToNode(block: DocumentBlock): JSONContent {
  switch (block.type) {
    case "heading":
      return { type: "heading", attrs: { level: block.level }, content: textContent(block.text) };
    case "paragraph":
      return { type: "paragraph", content: textContent(block.text) };
    case "quote":
      return {
        type: "blockquote",
        content: [{ type: "paragraph", content: textContent(block.text) }],
      };
  }
}

function textContent(text: string): JSONContent[] {
  return text ? [{ type: "text", text }] : [];
}

export function tiptapJsonToBlocks(doc: JSONContent): DocumentBlock[] {
  const nodes = doc.content ?? [];
  const blocks: DocumentBlock[] = [];

  for (const node of nodes) {
    if (node.type === "heading") {
      const level = (node.attrs?.level as 1 | 2 | 3) ?? 1;
      blocks.push({ type: "heading", level, text: extractText(node) });
    } else if (node.type === "paragraph") {
      blocks.push({ type: "paragraph", text: extractText(node) });
    } else if (node.type === "blockquote") {
      // A citação pode ter mais de um parágrafo interno (Enter dentro dela cria um novo
      // parágrafo irmão, ainda dentro da citação); junta o texto de todos.
      const paragraphs = node.content ?? [];
      const text = paragraphs
        .map(extractText)
        .filter((t) => t.length > 0)
        .join(" ");
      blocks.push({ type: "quote", text });
    }
  }

  return blocks;
}

function extractText(node: JSONContent): string {
  if (!node.content) return "";
  return node.content.map((child) => child.text ?? "").join("");
}
