#!/usr/bin/env node
/**
 * Applies src/lib/db/schema.sql.
 *
 * Prefers DATABASE_URL_UNPOOLED when it is set: DDL is safest on a direct
 * connection, because a transaction-mode pooler can route statements of one
 * logical migration to different backends.
 *
 * Every statement in the schema is idempotent (`IF NOT EXISTS`), so this is
 * safe to run repeatedly and on every deploy.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';
import { sanitiseConnectionUrl, sslOption, describeHost } from './db-url.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, '..', 'src', 'lib', 'db', 'schema.sql');

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. See .env.example.');
  process.exit(1);
}

const usingDirect = Boolean(process.env.DATABASE_URL_UNPOOLED);
const host = describeHost(url);
console.log(`Applying schema to ${host} (${usingDirect ? 'direct' : 'default'} connection)…`);

const sql = postgres(sanitiseConnectionUrl(url), {
  max: 1,
  connect_timeout: 20,
  // Never prepare during migration; a pooled URL would break on DDL.
  prepare: false,
  ssl: sslOption(),
});

try {
  const schema = await readFile(schemaPath, 'utf8');
  // `sql.unsafe` is required for multi-statement DDL; the input is our own
  // checked-in schema file, not anything a user supplies.
  await sql.unsafe(schema);

  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  console.log(`Schema applied. Tables: ${tables.map((t) => t.table_name).join(', ')}`);
} catch (error) {
  console.error('Migration failed:', error.message ?? error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
