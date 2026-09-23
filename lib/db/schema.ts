import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  // Admin exporta qualquer documento de graça, sem pacote nem pagamento avulso.
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  // nulo até o usuário logar (rascunho pode começar sem conta; dono é atribuído no login/export)
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
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  // "avulso": libera só esse documento. "pacote": libera esse documento e cria/renova
  // o pacote de 3 documentos em 30 dias (ver tabela `packs`).
  kind: text("kind", { enum: ["avulso", "pacote"] }).notNull(),
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
  // nulo quando o download veio da cota do pacote em vez de um pagamento avulso
  paymentId: uuid("payment_id").references(() => payments.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

/**
 * Pacote de 30 dias (R$14,90): libera até `documentsLimit` exportações sem cobrança
 * nova enquanto `documentsUsed < documentsLimit` e `expiresAt` não passou. Não é uma
 * assinatura de verdade (a InfinityPay não tem API pública de cobrança recorrente):
 * quando o prazo ou a cota acabam, o usuário precisa comprar um pacote novo.
 */
export const packs = pgTable("packs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id),
  documentsLimit: integer("documents_limit").notNull().default(3),
  documentsUsed: integer("documents_used").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Limite diário do verificador de IA público (`/verificador-ia`), por IP, já que
 * essa tela não exige login. Sem isso, um script poderia esgotar sozinho a cota
 * gratuita da Hugging Face que é compartilhada por todo mundo.
 */
export const aiCheckUsage = pgTable(
  "ai_check_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ip: text("ip").notNull(),
    day: text("day").notNull(), // "AAAA-MM-DD", em vez de timestamp, pra facilitar o unique por dia
    count: integer("count").notNull().default(0),
  },
  (table) => [uniqueIndex("ai_check_usage_ip_day_idx").on(table.ip, table.day)],
);
