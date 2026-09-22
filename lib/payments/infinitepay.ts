const API_BASE = "https://api.checkout.infinitepay.io";

function getHandle(): string {
  return process.env.INFINITEPAY_HANDLE ?? "arrudonimous";
}

export interface InfinitePayItem {
  quantity: number;
  /** valor unitário em centavos (R$ 14,90 = 1490) */
  price: number;
  description: string;
}

export interface CreatePaymentLinkInput {
  orderNsu: string;
  items: InfinitePayItem[];
  redirectUrl: string;
  webhookUrl: string;
  customer?: {
    name?: string;
    email?: string;
    phone_number?: string;
  };
}

export interface CreatePaymentLinkResult {
  url: string;
}

/**
 * Cria um link de pagamento avulso na InfinityPay pro handle configurado.
 * Não exige chave secreta: a API é pública, autenticada só pelo handle do recebedor.
 * https://docs.infinitepay.io (POST /links)
 */
export async function createPaymentLink(
  input: CreatePaymentLinkInput,
): Promise<CreatePaymentLinkResult> {
  const response = await fetch(`${API_BASE}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: getHandle(),
      order_nsu: input.orderNsu,
      redirect_url: input.redirectUrl,
      webhook_url: input.webhookUrl,
      items: input.items,
      ...(input.customer ? { customer: input.customer } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao criar link de pagamento na InfinityPay: ${response.status} ${await response.text()}`,
    );
  }

  return response.json();
}

export interface PaymentCheckInput {
  orderNsu: string;
  transactionNsu?: string;
  slug?: string;
}

export interface PaymentCheckResult {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: "credit_card" | "pix";
}

/**
 * Confirma no lado do servidor se um pedido foi realmente pago, em vez de confiar
 * cegamente no payload recebido no webhook (a documentação pública da InfinityPay
 * não deixa claro um mecanismo de assinatura pro webhook).
 * https://docs.infinitepay.io (POST /payment_check)
 */
export async function checkPayment(
  input: PaymentCheckInput,
): Promise<PaymentCheckResult> {
  const response = await fetch(`${API_BASE}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: getHandle(),
      order_nsu: input.orderNsu,
      transaction_nsu: input.transactionNsu,
      slug: input.slug,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao verificar pagamento na InfinityPay: ${response.status} ${await response.text()}`,
    );
  }

  return response.json();
}

/** Formato do payload que a InfinityPay envia pro `webhook_url` quando o pagamento é aprovado. */
export interface InfinitePayWebhookPayload {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: "credit_card" | "pix";
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items: InfinitePayItem[];
}
