import mammoth from "mammoth";
import { htmlToBlocks } from "./html-to-blocks";
import type { DocumentBlock } from "../document-model";

// Mapeia o estilo "Citação"/"Quote" do Word (usado pra citação longa) pra <blockquote>,
// já que o mammoth por padrão não converte esse estilo específico.
const STYLE_MAP = [
  "p[style-name='Quote'] => blockquote:fresh",
  "p[style-name='Intense Quote'] => blockquote:fresh",
  "p[style-name='Citação'] => blockquote:fresh",
];

export interface ImportDocxResult {
  blocks: DocumentBlock[];
  warnings: string[];
}

export async function importDocx(buffer: Buffer): Promise<ImportDocxResult> {
  const result = await mammoth.convertToHtml({ buffer }, { styleMap: STYLE_MAP });
  const blocks = htmlToBlocks(result.value);
  const warnings = result.messages.map((m) => m.message);
  return { blocks, warnings };
}
