import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "./client";
import { packs } from "./schema";

const PACK_DURATION_DAYS = 30;
export const PACK_DOCUMENTS_LIMIT = 3;

export type PackRow = typeof packs.$inferSelect;

/** O pacote ativo mais recente do usuário, se ainda tiver cota e não tiver expirado. */
export async function getActivePackWithQuota(userId: string): Promise<PackRow | undefined> {
  const [row] = await db()
    .select()
    .from(packs)
    .where(and(eq(packs.userId, userId), gt(packs.expiresAt, new Date())))
    .orderBy(desc(packs.expiresAt));

  if (!row || row.documentsUsed >= row.documentsLimit) return undefined;
  return row;
}

export async function createPack(userId: string, paymentId: string) {
  const expiresAt = new Date(Date.now() + PACK_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const [row] = await db()
    .insert(packs)
    .values({
      userId,
      paymentId,
      documentsLimit: PACK_DOCUMENTS_LIMIT,
      documentsUsed: 1, // já conta o documento que disparou a compra do pacote
      expiresAt,
    })
    .returning();
  return row;
}

/** Incremento atômico (evita corrida se o usuário clicar exportar duas vezes rápido). */
export async function incrementPackUsage(packId: string) {
  const [row] = await db()
    .update(packs)
    .set({ documentsUsed: sql`${packs.documentsUsed} + 1` })
    .where(eq(packs.id, packId))
    .returning();
  return row;
}

/** O pacote mais recente do usuário, tenha cota ou não (pra mostrar status na conta). */
export async function getLatestPackForUser(userId: string): Promise<PackRow | undefined> {
  const [row] = await db()
    .select()
    .from(packs)
    .where(eq(packs.userId, userId))
    .orderBy(desc(packs.createdAt));
  return row;
}
