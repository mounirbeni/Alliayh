import 'server-only';
import postgres, { type Sql } from 'postgres';

/**
 * Database connection.
 *
 * Deliberately vendor-neutral: a single `DATABASE_URL` runs this on Neon,
 * Supabase, Railway, Render, RDS or a Postgres you host yourself. There is no
 * proprietary SDK anywhere in the data layer, so moving provider is a change of
 * connection string rather than a rewrite.
 *
 * The client is lazy — a deployment without a database keeps working against
 * the in-memory adapters instead of failing at boot.
 */

let client: Sql | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. See .env.example.');
  }

  if (!client) {
    client = postgres(url, {
      // Serverless platforms open a connection per invocation; a large pool
      // just exhausts the server's connection limit.
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      idle_timeout: 20,
      connect_timeout: 10,
      // Most managed Postgres requires TLS but presents a certificate signed by
      // an internal CA. `require` still encrypts; set DATABASE_SSL=verify when
      // the provider's chain is publicly verifiable.
      ssl:
        process.env.DATABASE_SSL === 'disable'
          ? false
          : process.env.DATABASE_SSL === 'verify'
            ? 'verify-full'
            : 'require',
      // Postgres returns NUMERIC as a string to avoid precision loss. Money is
      // stored in minor units (integers), so this only affects aggregates.
      transform: { undefined: null },
    });
  }

  return client;
}
