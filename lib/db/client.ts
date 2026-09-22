import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lê a connection string do Neon só na hora de usar (não no import), assim o
 * resto da aplicação carrega normalmente mesmo antes do banco ser configurado.
 */
function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não configurada. Crie um projeto no Neon e defina a variável de ambiente antes de usar o banco.",
    );
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

let cached: ReturnType<typeof getDb> | undefined;

export function db() {
  if (!cached) cached = getDb();
  return cached;
}
