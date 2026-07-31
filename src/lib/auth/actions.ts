'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  createSession,
  destroySession,
  getSessionUser,
  isAuthConfigured,
  type SessionUser,
} from './session';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  fakeVerify,
  hashPassword,
  needsRehash,
  verifyPassword,
} from './password';
import {
  createUser,
  findUserByEmail,
  updatePasswordHash,
  updateShippingAddress,
} from './users';

/**
 * Authentication actions.
 *
 * Everything runs on the server. The password is read, hashed and discarded
 * within one request; it is never stored, logged or returned.
 */

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-in-use'
  | 'weak-password'
  | 'too-many-requests'
  | 'not-configured'
  | 'unknown';

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; code: AuthErrorCode };

const CredentialsSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

const RegistrationSchema = CredentialsSchema.extend({
  name: z.string().trim().min(1).max(120),
});

/* ------------------------------------------------------------------ *
 * Rate limiting
 *
 * Per-process and therefore per-instance. It is a guardrail against
 * credential stuffing from a single source, not a distributed defence —
 * move it to a shared store before running on more than one instance.
 * ------------------------------------------------------------------ */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return false;
  }

  recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 10_000) {
    for (const [entry, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(entry);
    }
  }

  return true;
}

async function clientKey(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'anonymous'
  );
}

async function userAgent(): Promise<string | undefined> {
  return (await headers()).get('user-agent')?.slice(0, 400) ?? undefined;
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

export async function signInAction(input: unknown): Promise<AuthResult> {
  if (!isAuthConfigured()) return { ok: false, code: 'not-configured' };

  const parsed = CredentialsSchema.safeParse(input);
  // A malformed submission is reported as bad credentials, not as a validation
  // error, so probing the endpoint reveals nothing about which part was wrong.
  if (!parsed.success) return { ok: false, code: 'invalid-credentials' };

  if (!rateLimit(`signin:${await clientKey()}`)) {
    return { ok: false, code: 'too-many-requests' };
  }

  try {
    const user = await findUserByEmail(parsed.data.email);

    if (!user) {
      // Spend the same time as a real verification. Returning early here would
      // make unknown addresses measurably faster than known ones.
      await fakeVerify();
      return { ok: false, code: 'invalid-credentials' };
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) return { ok: false, code: 'invalid-credentials' };

    // Opportunistically upgrade hashes made with older cost parameters.
    if (needsRehash(user.passwordHash)) {
      await updatePasswordHash(user.id, await hashPassword(parsed.data.password));
    }

    await createSession(user.id, await userAgent());

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        shippingAddress: user.shippingAddress,
      },
    };
  } catch (error) {
    console.error('[auth] sign-in failed:', error);
    return { ok: false, code: 'unknown' };
  }
}

export async function registerAction(input: unknown): Promise<AuthResult> {
  if (!isAuthConfigured()) return { ok: false, code: 'not-configured' };

  const parsed = RegistrationSchema.safeParse(input);
  if (!parsed.success) {
    const tooShort = parsed.error.issues.some((issue) => issue.path[0] === 'password');
    return { ok: false, code: tooShort ? 'weak-password' : 'invalid-credentials' };
  }

  if (!rateLimit(`register:${await clientKey()}`)) {
    return { ok: false, code: 'too-many-requests' };
  }

  try {
    const user = await createUser(parsed.data.email, parsed.data.password, parsed.data.name);

    // `createUser` returns null on a unique-index conflict. Registration is the
    // one place where "this address is taken" has to be said out loud, because
    // the alternative is an account the customer can never use.
    if (!user) return { ok: false, code: 'email-in-use' };

    await createSession(user.id, await userAgent());

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        shippingAddress: user.shippingAddress,
      },
    };
  } catch (error) {
    console.error('[auth] registration failed:', error);
    return { ok: false, code: 'unknown' };
  }
}

export async function signOutAction(): Promise<{ ok: true }> {
  await destroySession();
  return { ok: true };
}

/** The signed-in user, for client components that need it after hydration. */
export async function currentUserAction(): Promise<SessionUser | null> {
  return getSessionUser();
}

export async function saveShippingAddressAction(address: string): Promise<{ ok: boolean }> {
  const user = await getSessionUser();
  if (!user) return { ok: false };

  const trimmed = address.trim().slice(0, 500);
  await updateShippingAddress(user.id, trimmed);
  return { ok: true };
}
