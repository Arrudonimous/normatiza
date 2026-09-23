import { NextRequest, NextResponse } from "next/server";
import { importDocx } from "@/lib/parse/docx-import";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie um arquivo .docx" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".docx")) {
    return NextResponse.json({ error: "O arquivo precisa ser um .docx" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { blocks, warnings } = await importDocx(buffer);
    return NextResponse.json({ blocks, warnings });
  } catch {
    return NextResponse.json(
      { error: "Não conseguimos ler esse arquivo. Confirme que é um .docx válido." },
      { status: 422 },
    );
  }
}
