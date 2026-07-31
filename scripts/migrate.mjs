#!/usr/bin/env node
/**
 * Applies src/lib/db/schema.sql to DATABASE_URL.
 *
 * Every statement in the schema is idempotent (`IF NOT EXISTS`), so this is
 * safe to run repeatedly and on every deploy.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, '..', 'src', 'lib', 'db', 'schema.sql');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. See .env.example.');
  process.exit(1);
}

const sql = postgres(url, {
  max: 1,
  ssl:
    process.env.DATABASE_SSL === 'disable'
      ? false
      : process.env.DATABASE_SSL === 'verify'
        ? 'verify-full'
        : 'require',
});

try {
  const schema = await readFile(schemaPath, 'utf8');
  // `sql.unsafe` is required for multi-statement DDL; the input is our own
  // checked-in schema file, not anything a user supplies.
  await sql.unsafe(schema);
  console.log('Schema applied.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
