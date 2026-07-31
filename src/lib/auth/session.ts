import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';

/**
 * Sessions.
 *
 * Opaque random tokens, not JWTs. A JWT cannot be revoked before it expires
 * without a server-side denylist — at which point the statelessness that
 * justified it is gone. A row in `sessions` can simply be deleted, which is
 * what "sign out everywhere" actually requires.
 *
 * Only the SHA-256 of the token is stored. Someone who reads the sessions table
 * therefore cannot impersonate anyone: the raw token exists only in the
 * customer's HttpOnly cookie. SHA-256 (not scrypt) is correct here because the
 * token is 256 bits of entropy — there is no dictionary to attack.
 */

export const SESSION_COOKIE = 'lueur_session';

/** Thirty days, refreshed on use. */
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  shippingAddress: string | null;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Issue a session and set the cookie. Returns the raw token for tests. */
export async function createSession(userId: string, userAgent?: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await getDb()`
    INSERT INTO sessions (token_hash, user_id, expires_at, user_agent)
    VALUES (${hashToken(token)}, ${userId}, ${expiresAt}, ${userAgent ?? null})
  `;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  return token;
}

interface SessionRow {
  id: string;
  email: string;
  name: string | null;
  shipping_address: string | null;
}

/**
 * Who the request belongs to, resolved from the cookie on every call.
 *
 * The expiry is checked in SQL rather than in JavaScript, so a clock difference
 * between app instances cannot extend a session past its end.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isDatabaseConfigured()) return null;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const rows = await getDb()<SessionRow[]>`
      SELECT u.id, u.email, u.name, u.shipping_address
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > NOW()
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      shippingAddress: row.shipping_address,
    };
  } catch (error) {
    console.error('[auth] session lookup failed:', error);
    return null;
  }
}

/** Sign out of this device. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token && isDatabaseConfigured()) {
    try {
      await getDb()`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
    } catch (error) {
      console.error('[auth] session deletion failed:', error);
    }
  }

  store.delete(SESSION_COOKIE);
}

/** Sign out everywhere — used after a password change or a suspected leak. */
export async function destroyAllSessions(userId: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await getDb()`DELETE FROM sessions WHERE user_id = ${userId}`;
}

/** Housekeeping for expired rows; safe to call from a scheduled job. */
export async function pruneExpiredSessions(): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  const rows = await getDb()`DELETE FROM sessions WHERE expires_at <= NOW() RETURNING token_hash`;
  return rows.length;
}

/** Whether accounts are available at all in this deployment. */
export function isAuthConfigured(): boolean {
  return isDatabaseConfigured();
}
