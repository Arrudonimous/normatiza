import { NextRequest, NextResponse } from "next/server";
import { createDownloadToken } from "@/lib/db/download-tokens";
import { createPack } from "@/lib/db/packs";
import { getPaymentByOrderNsu, markPaymentApproved, markPaymentRejected } from "@/lib/db/payments";
import { checkPayment, type InfinitePayWebhookPayload } from "@/lib/payments/infinitepay";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as InfinitePayWebhookPayload;

  const payment = await getPaymentByOrderNsu(payload.order_nsu);
  if (!payment) {
    // Pedido desconhecido: responde 200 mesmo assim pra não gerar retentativa infinita.
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Nunca libera o download só porque o webhook disse que pagou: confirma direto na InfinityPay.
  const check = await checkPayment({
    orderNsu: payload.order_nsu,
    transactionNsu: payload.transaction_nsu,
    slug: payload.invoice_slug,
  });

  if (!check.paid) {
    await markPaymentRejected(payment.id);
    return NextResponse.json({ ok: true, paid: false });
  }

  await markPaymentApproved(payment.id, payload.transaction_nsu);

  if (payment.kind === "pacote") {
    await createPack(payment.userId, payment.id);
  }

  const token = await createDownloadToken(payment.documentId, payment.id);

  return NextResponse.json({ ok: true, paid: true, downloadToken: token.token });
}
