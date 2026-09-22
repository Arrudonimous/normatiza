import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  // preparado pra autenticação futura; no MVP fica sempre nulo (sem login)
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull().default(""),
  // instituição, curso, autor, orientador, cidade, ano
  metadata: jsonb("metadata").notNull().default({}),
  // estrutura vinda do editor/importação: headings e parágrafos
  content: jsonb("content").notNull().default({}),
  // lista de referências ABNT desse documento
  references: jsonb("references").notNull().default([]),
  status: text("status", { enum: ["draft", "exported"] })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  infinitepayOrderNsu: text("infinitepay_order_nsu").notNull(),
  infinitepayTransactionNsu: text("infinitepay_transaction_nsu"),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  amount: text("amount").notNull(), // valor em centavos, como string pra evitar erro de ponto flutuante
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const downloadTokens = pgTable("download_tokens", {
  token: uuid("token").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});
