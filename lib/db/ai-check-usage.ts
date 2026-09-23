import { sql } from "drizzle-orm";
import { db } from "./client";
import { aiCheckUsage } from "./schema";

export const ANONYMOUS_DAILY_LIMIT = 15;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Incrementa o contador do dia pra esse IP e diz se ele ainda está dentro do limite. */
export async function registerAndCheckLimit(
  ip: string,
  limit = ANONYMOUS_DAILY_LIMIT,
): Promise<{ allowed: boolean; count: number }> {
  const [row] = await db()
    .insert(aiCheckUsage)
    .values({ ip, day: today(), count: 1 })
    .onConflictDoUpdate({
      target: [aiCheckUsage.ip, aiCheckUsage.day],
      set: { count: sql`${aiCheckUsage.count} + 1` },
    })
    .returning();

  return { allowed: row.count <= limit, count: row.count };
}
