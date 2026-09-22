import { NextRequest, NextResponse } from "next/server";
import { getDownloadTokenByPaymentId } from "@/lib/db/download-tokens";
import { getPaymentByOrderNsu } from "@/lib/db/payments";

export async function GET(request: NextRequest) {
  const orderNsu = request.nextUrl.searchParams.get("order_nsu");
  if (!orderNsu) {
    return NextResponse.json({ error: "order_nsu é obrigatório" }, { status: 400 });
  }

  const payment = await getPaymentByOrderNsu(orderNsu);
  if (!payment) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  if (payment.status !== "approved") {
    return NextResponse.json({ status: payment.status });
  }

  const token = await getDownloadTokenByPaymentId(payment.id);
  return NextResponse.json({
    status: "approved",
    downloadToken: token?.token ?? null,
  });
}
