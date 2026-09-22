import { eq } from "drizzle-orm";
import { db } from "./client";
import { documents } from "./schema";

export type DocumentRow = typeof documents.$inferSelect;
export type NewDocumentRow = typeof documents.$inferInsert;

export async function createDocument(data: Partial<NewDocumentRow> = {}) {
  const [row] = await db().insert(documents).values(data).returning();
  return row;
}

export async function getDocument(id: string) {
  const [row] = await db().select().from(documents).where(eq(documents.id, id));
  return row;
}

export async function updateDocument(id: string, data: Partial<NewDocumentRow>) {
  const [row] = await db()
    .update(documents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(documents.id, id))
    .returning();
  return row;
}

export async function markDocumentExported(id: string) {
  return updateDocument(id, { status: "exported" });
}
