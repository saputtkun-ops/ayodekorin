import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Mendeteksi jika URL masih menggunakan placeholder bawaan
const isPlaceholder = !url || url.includes("your-database-name");
const isProduction = url && url.startsWith("libsql://") && !isPlaceholder;

export const client = createClient({
  url: isPlaceholder ? "file:local.db" : url,
  authToken: isPlaceholder ? undefined : authToken,
});

export const db = drizzle(client, { schema });

export function isDbConnectedToTurso(): boolean {
  return !!isProduction;
}
