import 'server-only';
import { cookies } from 'next/headers';
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

/**
 * Server-side view of who the visitor is.
 *
 * Reads the HttpOnly session cookie and verifies it with the Admin SDK on every
 * call. The previous implementation held a `UserProfile` in a persisted zustand
 * store, which meant "signed in" was a value in the visitor's own localStorage —
 * editable, and never checked by anything.
 */

export const SESSION_COOKIE = '__session';

export interface SessionUser {
  uid: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    // `true` re-checks revocation, so signing out on one device invalidates the
    // session everywhere rather than leaving a valid cookie behind.
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: (decoded.name as string | undefined) ?? null,
      emailVerified: Boolean(decoded.email_verified),
    };
  } catch {
    // Expired or revoked. Treated as signed out; the cookie is cleared on the
    // next explicit sign-out or sign-in.
    return null;
  }
}

/** Whether accounts are available at all in this deployment. */
export function isAuthConfigured(): boolean {
  return isFirebaseAdminConfigured();
}
