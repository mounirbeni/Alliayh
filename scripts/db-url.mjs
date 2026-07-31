/**
 * Shared connection-string handling for the standalone scripts.
 *
 * Mirrors `src/lib/db/client.ts`. The scripts run outside Next.js, so they
 * cannot import the TypeScript module — but they must strip the same
 * client-only parameters, or a URL pasted from a provider's dashboard fails
 * with `unrecognized configuration parameter`.
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

export function sanitiseConnectionUrl(raw) {
  try {
    const url = new URL(raw);
    for (const key of [...url.searchParams.keys()]) {
      if (CLIENT_ONLY_PARAMS.has(key.toLowerCase())) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export function isPooled(raw) {
  return raw.includes('-pooler.') || raw.includes('pgbouncer=true');
}

export function sslOption() {
  if (process.env.DATABASE_SSL === 'disable') return false;
  if (process.env.DATABASE_SSL === 'verify') return 'verify-full';
  return 'require';
}

export function describeHost(raw) {
  return raw.replace(/^.*@/, '').replace(/[/?].*$/, '');
}
