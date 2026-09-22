import type { Reference } from "./abnt/types";

export interface DocumentMetadata {
  titulo: string;
  instituicao: string;
  curso: string;
  autor: string;
  orientador?: string;
  cidade: string;
  ano: string;
}

export type DocumentBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string };

export interface InternalDocument {
  metadata: DocumentMetadata;
  blocks: DocumentBlock[];
  references: Reference[];
}

export function emptyDocumentMetadata(): DocumentMetadata {
  return {
    titulo: "",
    instituicao: "",
    curso: "",
    autor: "",
    orientador: "",
    cidade: "",
    ano: "",
  };
}
