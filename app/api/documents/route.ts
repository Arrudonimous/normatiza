import { NextRequest, NextResponse } from "next/server";
import { createDocument, getDocument, updateDocument } from "@/lib/db/documents";
import type { DocumentBlock, DocumentMetadata } from "@/lib/document-model";
import type { Reference } from "@/lib/abnt/types";

interface SaveDocumentBody {
  documentId?: string;
  metadata: DocumentMetadata;
  blocks: DocumentBlock[];
  references: Reference[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SaveDocumentBody;

  const data = {
    title: body.metadata.titulo || "",
    metadata: body.metadata,
    content: { blocks: body.blocks },
    references: body.references,
  };

  const row = body.documentId
    ? await updateDocument(body.documentId, data)
    : await createDocument(data);

  if (!row) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ documentId: row.id });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
  }

  const row = await getDocument(id);
  if (!row) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ document: row });
}
