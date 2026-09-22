import { NextRequest, NextResponse } from "next/server";
import { getValidDownloadToken } from "@/lib/db/download-tokens";
import { getDocument } from "@/lib/db/documents";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token é obrigatório" }, { status: 400 });
  }

  const row = await getValidDownloadToken(token);
  if (!row) {
    return NextResponse.json({ error: "Link expirado ou inválido" }, { status: 410 });
  }

  const document = await getDocument(row.documentId);
  if (!document) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  // TODO(Plano B): chamar generateDocx(document) assim que o editor e o modelo de
  // documento interno existirem (lib/export/generate-docx.ts), devolver o arquivo
  // .docx como resposta binária e só então chamar consumeDownloadToken(token). Por
  // enquanto o pagamento e o token já funcionam de ponta a ponta, só falta essa
  // peça pra liberar o arquivo de verdade (por isso o token não é consumido aqui).
  return NextResponse.json(
    {
      error: "Geração do .docx ainda não implementada (aguardando o editor/Plano B)",
    },
    { status: 501 },
  );
}
