import { eq } from "drizzle-orm";
import { db } from "./client";
import { payments } from "./schema";

export type PaymentRow = typeof payments.$inferSelect;
export type NewPaymentRow = typeof payments.$inferInsert;

export async function createPayment(data: NewPaymentRow) {
  const [row] = await db().insert(payments).values(data).returning();
  return row;
}

export async function getPaymentByOrderNsu(orderNsu: string) {
  const [row] = await db()
    .select()
    .from(payments)
    .where(eq(payments.infinitepayOrderNsu, orderNsu));
  return row;
}

export async function markPaymentApproved(id: string, transactionNsu: string) {
  const [row] = await db()
    .update(payments)
    .set({
      status: "approved",
      infinitepayTransactionNsu: transactionNsu,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  return row;
}

export async function markPaymentRejected(id: string) {
  const [row] = await db()
    .update(payments)
    .set({ status: "rejected", updatedAt: new Date() })
    .where(eq(payments.id, id))
    .returning();
  return row;
}
