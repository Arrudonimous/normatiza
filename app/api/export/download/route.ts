import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken, getValidDownloadToken } from "@/lib/db/download-tokens";
import { getDocument, markDocumentExported } from "@/lib/db/documents";
import { generateDocx } from "@/lib/export/generate-docx";
import type { DocumentBlock, DocumentMetadata, InternalDocument } from "@/lib/document-model";
import type { Reference } from "@/lib/abnt/types";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token é obrigatório" }, { status: 400 });
  }

  const row = await getValidDownloadToken(token);
  if (!row) {
    return NextResponse.json({ error: "Link expirado ou inválido" }, { status: 410 });
  }

  const documentRow = await getDocument(row.documentId);
  if (!documentRow) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  const internalDocument: InternalDocument = {
    metadata: documentRow.metadata as DocumentMetadata,
    blocks: (documentRow.content as { blocks?: DocumentBlock[] }).blocks ?? [],
    references: documentRow.references as Reference[],
  };

  const buffer = await generateDocx(internalDocument);

  await consumeDownloadToken(token);
  await markDocumentExported(documentRow.id);

  const fileName = `${(internalDocument.metadata.titulo || "documento-normatiza").slice(0, 60)}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
}
