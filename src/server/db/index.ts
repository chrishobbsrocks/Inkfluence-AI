import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import postgres from "postgres";
import * as schema from "./schema";

// Shared type across both drivers — consumers use standard Drizzle query API
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

let _db: Database | null = null;

function usePostgresJs(): boolean {
  return process.env.DB_DRIVER === "postgres-js";
}

export function getDb(): Database {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Please add it to your .env.local file."
    );
  }

  if (usePostgresJs()) {
    const client = postgres(url);
    _db = drizzlePostgres(client, { schema }) as unknown as Database;
  } else {
    const sql: NeonQueryFunction<boolean, boolean> = neon(url);
    _db = drizzleNeon(sql, { schema }) as unknown as Database;
  }

  return _db;
}

// Convenience getter — same lazy behavior, shorter import
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
