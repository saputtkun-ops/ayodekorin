import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Mendeteksi jika URL masih menggunakan placeholder bawaan
const isPlaceholder = !url || url.includes("your-database-name");
const isProduction = url && url.startsWith("libsql://") && !isPlaceholder;

export const db = createClient({
  url: isPlaceholder ? "file:local.db" : url,
  authToken: isPlaceholder ? undefined : authToken,
});

export function isDbConnectedToTurso(): boolean {
  return !!isProduction;
}
