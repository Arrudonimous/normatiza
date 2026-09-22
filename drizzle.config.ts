import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Só é lida quando um comando do drizzle-kit roda de verdade (db:generate/db:push).
    // Configure DATABASE_URL no .env quando o Neon estiver pronto.
    url: process.env.DATABASE_URL ?? "",
  },
});
