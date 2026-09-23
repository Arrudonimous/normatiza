import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "./client";
import { downloadTokens } from "./schema";

const TOKEN_VALIDITY_MINUTES = 30;

export async function createDownloadToken(documentId: string, paymentId: string | null) {
  const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MINUTES * 60 * 1000);
  const [row] = await db()
    .insert(downloadTokens)
    .values({ documentId, paymentId, expiresAt })
    .returning();
  return row;
}

/** Retorna o token se ele existir, ainda não tiver expirado e ainda não tiver sido usado. */
export async function getValidDownloadToken(token: string) {
  const [row] = await db()
    .select()
    .from(downloadTokens)
    .where(
      and(
        eq(downloadTokens.token, token),
        gt(downloadTokens.expiresAt, new Date()),
        isNull(downloadTokens.usedAt),
      ),
    );
  return row;
}

export async function getDownloadTokenByPaymentId(paymentId: string) {
  const [row] = await db()
    .select()
    .from(downloadTokens)
    .where(eq(downloadTokens.paymentId, paymentId));
  return row;
}

export async function consumeDownloadToken(token: string) {
  const [row] = await db()
    .update(downloadTokens)
    .set({ usedAt: new Date() })
    .where(eq(downloadTokens.token, token))
    .returning();
  return row;
}
