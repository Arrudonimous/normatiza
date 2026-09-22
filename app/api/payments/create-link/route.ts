import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/lib/db/documents";
import { createPayment } from "@/lib/db/payments";
import { createPaymentLink } from "@/lib/payments/infinitepay";
import { EXPORT_PRICE_CENTS } from "@/lib/payments/pricing";

function baseUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const { documentId } = (await request.json()) as { documentId?: string };
  if (!documentId) {
    return NextResponse.json({ error: "documentId é obrigatório" }, { status: 400 });
  }

  const document = await getDocument(documentId);
  if (!document) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  const orderNsu = crypto.randomUUID();

  const payment = await createPayment({
    documentId,
    infinitepayOrderNsu: orderNsu,
    status: "pending",
    amount: String(EXPORT_PRICE_CENTS),
  });

  const origin = baseUrl(request);
  const link = await createPaymentLink({
    orderNsu,
    items: [
      {
        quantity: 1,
        price: EXPORT_PRICE_CENTS,
        description: "Exportação do documento formatado - Normatiza",
      },
    ],
    redirectUrl: `${origin}/exportar/sucesso?order_nsu=${orderNsu}`,
    webhookUrl: `${origin}/api/payments/webhook`,
  });

  return NextResponse.json({ checkoutUrl: link.url, paymentId: payment.id });
}
