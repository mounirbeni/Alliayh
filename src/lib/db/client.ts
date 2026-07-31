import 'server-only';
import postgres, { type Sql } from 'postgres';

/**
 * Database connection.
 *
 * Deliberately vendor-neutral: a single `DATABASE_URL` runs this on Neon,
 * Supabase, Railway, Render, RDS or a Postgres you host yourself. There is no
 * proprietary SDK in the data layer, so moving provider is a change of
 * connection string rather than a rewrite.
 *
 * The client is lazy — a deployment without a database keeps working against
 * the in-memory adapters instead of failing at boot.
 */

let client: Sql | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Whether the URL points at a transaction-mode connection pooler.
 *
 * Neon (`-pooler`), Supabase (`pgbouncer=true`) and most managed poolers run
 * PgBouncer in transaction mode, where a client is handed a different backend
 * connection per transaction. Server-side prepared statements are bound to a
 * backend, so postgres.js's default of preparing every query breaks against
 * them — typically as an intermittent "prepared statement s1 already exists"
 * under concurrency, which is exactly the kind of fault that only appears in
 * production. Detecting the pooler and disabling preparation avoids it.
 */
function usesTransactionPooler(url: string): boolean {
  return (
    url.includes('-pooler.') ||
    url.includes('pgbouncer=true') ||
    process.env.DATABASE_POOLER === 'transaction'
  );
}

/** TLS mode, from DATABASE_SSL. Defaults to encrypted-without-chain-verification. */
function sslMode(): 'require' | 'verify-full' | false {
  if (process.env.DATABASE_SSL === 'disable') return false;
  if (process.env.DATABASE_SSL === 'verify') return 'verify-full';
  return 'require';
}

/**
 * Query parameters that are instructions to the *client* or to a pooler, not
 * Postgres configuration parameters.
 *
 * postgres.js forwards anything it does not recognise in the query string to
 * the server as a startup parameter, and the server rejects unknown ones
 * outright. A connection string copied verbatim from a provider's dashboard
 * therefore fails with `unrecognized configuration parameter "channel_binding"`
 * — Neon's default URL includes exactly that, as does Supabase's
 * `?pgbouncer=true`. Stripping them lets the documented URL work as pasted.
 *
 * `sslmode` is deliberately not in this list: postgres.js understands it.
 */
const CLIENT_ONLY_PARAMS = new Set([
  'channel_binding',
  'pgbouncer',
  'target_session_attrs',
  'connect_timeout',
  'sslrootcert',
  'sslcert',
  'sslkey',
  'sslnegotiation',
  'gssencmode',
  'schema',
  'pool_timeout',
  'connection_limit',
]);

export function sanitiseConnectionUrl(raw: string): string {
  try {
    const url = new URL(raw);
    let changed = false;

    for (const key of [...url.searchParams.keys()]) {
      if (CLIENT_ONLY_PARAMS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
        changed = true;
      }
    }

    return changed ? url.toString() : raw;
  } catch {
    // Not a parseable URL (e.g. a key=value DSN). Hand it over untouched.
    return raw;
  }
}

export function getDb(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. See .env.example.');
  }

  if (!client) {
    // Detect the pooler from the *original* URL — `pgbouncer=true` is one of
    // the markers, and it is about to be stripped.
    const pooled = usesTransactionPooler(url);

    client = postgres(sanitiseConnectionUrl(url), {
      // A pooler multiplexes for us, so the app should hold few connections.
      // Serverless platforms open a client per invocation and a large pool just
      // exhausts the server's connection limit.
      max: Number(process.env.DATABASE_POOL_MAX ?? (pooled ? 1 : 5)),
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: !pooled,
      ssl: sslMode(),
      transform: { undefined: null },
    });
  }

  return client;
}

/**
 * Connection string for schema changes.
 *
 * DDL is safest on a direct connection: a transaction pooler can route
 * statements of one logical migration to different backends. Providers that
 * offer both endpoints (Neon, Supabase) expose the direct one separately.
 */
export function getMigrationUrl(): string | undefined {
  return process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
}
