#!/usr/bin/env node
/**
 * Verifies the database layer against the configured DATABASE_URL.
 *
 * Exercises the properties the persistence and auth code actually rely on,
 * rather than merely proving a connection opens:
 *
 *   - the schema is present
 *   - the pooler and prepared-statement settings work under concurrency
 *   - a replayed webhook cannot record an order twice
 *   - concurrent sales of one product all land
 *   - money survives a round-trip exactly
 *   - email uniqueness is case-insensitive
 *   - sessions store only a hash, and expire
 *
 * Everything it writes is removed afterwards. Run with: npm run db:check
 */
import { randomBytes, createHash } from 'node:crypto';
import postgres from 'postgres';
import { sanitiseConnectionUrl, isPooled, sslOption, describeHost } from './db-url.mjs';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. See .env.example.');
  process.exit(1);
}

const pooled = isPooled(url);
const host = describeHost(url);

const sql = postgres(sanitiseConnectionUrl(url), {
  max: pooled ? 1 : 5,
  connect_timeout: 20,
  prepare: !pooled,
  ssl: sslOption(),
});

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? ` — ${detail}` : ''}`);
};

// Namespaced so a failed run cannot collide with real data.
const RUN = randomBytes(4).toString('hex');
const testEmail = `db-check-${RUN}@example.invalid`;
const testSession = `cs_dbcheck_${RUN}`;
const testProduct = `__dbcheck_${RUN}`;

console.log(`\nChecking ${host}  (${pooled ? 'pooled — prepared statements off' : 'direct'})\n`);

try {
  await sql`SELECT 1`;
  check('connection', true);

  const tables = (
    await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  ).map((r) => r.table_name);
  for (const table of ['orders', 'inventory', 'users', 'sessions']) {
    check(`table ${table}`, tables.includes(table), tables.includes(table) ? '' : 'run npm run db:migrate');
  }

  if (!['orders', 'inventory', 'users', 'sessions'].every((t) => tables.includes(t))) {
    throw new Error('Schema incomplete — run `npm run db:migrate` first.');
  }

  // Concurrency: the check that actually catches a pooler misconfiguration.
  await Promise.all(Array.from({ length: 15 }, (_, i) => sql`SELECT ${i}::int AS n`));
  check('15 concurrent queries', true);

  // Webhook replay must not double-record.
  const insertOrder = () => sql`
    INSERT INTO orders (session_id, reference, status, email, locale, currency,
      subtotal_cents, shipping_cents, total_cents, lines, created_at)
    VALUES (${testSession}, ${'LUEUR-CHECK'}, 'paid', ${testEmail}, 'pt', 'EUR',
      4500, 495, 4995, ${sql.json([{ productId: testProduct, quantity: 2 }])}, NOW())
    ON CONFLICT (session_id) DO NOTHING RETURNING session_id`;

  check('order recorded', (await insertOrder()).length === 1);
  check('replayed webhook records nothing', (await insertOrder()).length === 0);

  const [order] = await sql`SELECT * FROM orders WHERE session_id = ${testSession}`;
  check('money round-trips exactly', order.total_cents === 4995, `${order.total_cents} cents`);
  check('order found by lowercased email', (
    await sql`SELECT 1 FROM orders WHERE LOWER(email) = ${testEmail.toLowerCase()}`
  ).length === 1);

  // Concurrent inventory increments must all land.
  const bump = () => sql`
    INSERT INTO inventory (product_id, sold, updated_at) VALUES (${testProduct}, 3, NOW())
    ON CONFLICT (product_id) DO UPDATE SET sold = inventory.sold + 3, updated_at = NOW()`;
  await Promise.all(Array.from({ length: 20 }, bump));
  const [inv] = await sql`SELECT sold FROM inventory WHERE product_id = ${testProduct}`;
  check('20 concurrent sales all land', inv.sold === 60, `got ${inv.sold}, want 60`);

  // Users: case-insensitive uniqueness.
  const [user] = await sql`
    INSERT INTO users (email, password_hash, name) VALUES (${testEmail}, 'scrypt$1$1$1$x$y', 'Check')
    ON CONFLICT (LOWER(email)) DO NOTHING RETURNING *`;
  check('user created', Boolean(user?.id));
  check('duplicate email rejected case-insensitively', (
    await sql`INSERT INTO users (email, password_hash) VALUES (${testEmail.toUpperCase()}, 'x')
              ON CONFLICT (LOWER(email)) DO NOTHING RETURNING id`
  ).length === 0);

  // Sessions: hash-only storage and expiry.
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await sql`INSERT INTO sessions (token_hash, user_id, expires_at)
            VALUES (${tokenHash}, ${user.id}, NOW() + INTERVAL '1 hour')`;
  const [stored] = await sql`SELECT token_hash FROM sessions WHERE user_id = ${user.id}`;
  check('raw token never stored', stored.token_hash !== token);
  check('valid session resolves', (
    await sql`SELECT 1 FROM sessions WHERE token_hash = ${tokenHash} AND expires_at > NOW()`
  ).length === 1);

  await sql`INSERT INTO sessions (token_hash, user_id, expires_at)
            VALUES (${`expired-${RUN}`}, ${user.id}, NOW() - INTERVAL '1 day')`;
  check('expired session rejected', (
    await sql`SELECT 1 FROM sessions WHERE token_hash = ${`expired-${RUN}`} AND expires_at > NOW()`
  ).length === 0);

  await sql`DELETE FROM users WHERE id = ${user.id}`;
  check('sessions cascade-delete with user', (
    await sql`SELECT 1 FROM sessions WHERE user_id = ${user.id}`
  ).length === 0);
} catch (error) {
  fail++;
  console.error(`\n  FAIL  ${error.message ?? error}`);
} finally {
  // Always clean up, even after a failure part-way through.
  await sql`DELETE FROM orders WHERE session_id = ${testSession}`.catch(() => {});
  await sql`DELETE FROM inventory WHERE product_id = ${testProduct}`.catch(() => {});
  await sql`DELETE FROM users WHERE email = ${testEmail}`.catch(() => {});
  await sql.end();
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
