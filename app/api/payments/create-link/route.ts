import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getDocument, updateDocument } from "@/lib/db/documents";
import { createDownloadToken } from "@/lib/db/download-tokens";
import { getActivePackWithQuota, incrementPackUsage } from "@/lib/db/packs";
import { createPayment } from "@/lib/db/payments";
import { createPaymentLink } from "@/lib/payments/infinitepay";
import { AVULSO_PRICE_CENTS, PACOTE_DOCUMENTOS, PACOTE_PRICE_CENTS } from "@/lib/payments/pricing";

function baseUrl(request: NextRequest): string {
  // `||` (não `??`) de propósito: NEXT_PUBLIC_APP_URL="" no .env também deve cair
  // pro origin da requisição, não virar uma URL relativa inválida pra InfinityPay.
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { documentId, kind } = (await request.json()) as {
    documentId?: string;
    kind?: "avulso" | "pacote";
  };
  if (!documentId) {
    return NextResponse.json({ error: "documentId é obrigatório" }, { status: 400 });
  }

  const document = await getDocument(documentId);
  if (!document) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }
  if (document.userId && document.userId !== user.id) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }
  if (!document.userId) {
    await updateDocument(documentId, { userId: user.id });
  }

  // Se o usuário já tem um pacote ativo com cota sobrando, libera na hora, sem cobrar de novo.
  const activePack = await getActivePackWithQuota(user.id);
  if (activePack) {
    await incrementPackUsage(activePack.id);
    const token = await createDownloadToken(documentId, null);
    return NextResponse.json({ freeWithPack: true, downloadToken: token.token });
  }

  // Sem cota: se o front ainda não escolheu avulso/pacote, devolve os preços pra ele decidir.
  if (kind !== "avulso" && kind !== "pacote") {
    return NextResponse.json({
      needsPayment: true,
      prices: { avulso: AVULSO_PRICE_CENTS, pacote: PACOTE_PRICE_CENTS, pacoteDocumentos: PACOTE_DOCUMENTOS },
    });
  }

  const amountCents = kind === "pacote" ? PACOTE_PRICE_CENTS : AVULSO_PRICE_CENTS;
  const description =
    kind === "pacote"
      ? `Pacote de ${PACOTE_DOCUMENTOS} documentos (30 dias) - Normatiza`
      : "Exportação avulsa do documento formatado - Normatiza";

  const orderNsu = crypto.randomUUID();

  const payment = await createPayment({
    userId: user.id,
    documentId,
    kind,
    infinitepayOrderNsu: orderNsu,
    status: "pending",
    amount: String(amountCents),
  });

  const origin = baseUrl(request);
  const link = await createPaymentLink({
    orderNsu,
    items: [{ quantity: 1, price: amountCents, description }],
    redirectUrl: `${origin}/exportar/sucesso?order_nsu=${orderNsu}`,
    webhookUrl: `${origin}/api/payments/webhook`,
  });

  return NextResponse.json({ checkoutUrl: link.url, paymentId: payment.id });
}
