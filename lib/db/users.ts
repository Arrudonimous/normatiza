import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema";

export type UserRow = typeof users.$inferSelect;

export async function createUser(email: string, passwordHash: string) {
  const [row] = await db()
    .insert(users)
    .values({ email: email.toLowerCase().trim(), passwordHash })
    .returning();
  return row;
}

export async function getUserByEmail(email: string) {
  const [row] = await db()
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()));
  return row;
}

export async function getUserById(id: string) {
  const [row] = await db().select().from(users).where(eq(users.id, id));
  return row;
}
