import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
// Route modules may only export route handlers and a fixed set of config
// options, so the cookie name lives with the session helpers instead.
import { SESSION_COOKIE } from '@/lib/auth/session';

/**
 * Session cookie exchange.
 *
 * The browser signs in with Firebase and gets an ID token. That token is only
 * useful client-side; Server Components cannot read it. This route trades a
 * *verified* ID token for an HttpOnly session cookie, so the server can
 * establish who the visitor is without JavaScript, and without the token being
 * readable by scripts on the page.
 *
 * The token is verified with the Admin SDK before anything is issued — the
 * client asserting "I am user X" is never taken at face value.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Five days, the maximum Firebase allows for a session cookie. */
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Authentication is not configured' }, { status: 503 });
  }

  let idToken: unknown;
  try {
    ({ idToken } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (typeof idToken !== 'string' || idToken.length < 10 || idToken.length > 4096) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  try {
    const auth = getAdminAuth();

    // `checkRevoked` catches a token issued before the account was disabled or
    // its refresh tokens were revoked.
    const decoded = await auth.verifyIdToken(idToken, true);

    // Only mint a session from a freshly-signed-in token. This is Firebase's
    // recommended guard against a stolen long-lived ID token being upgraded
    // into a five-day session.
    const ageMs = Date.now() - decoded.auth_time * 1000;
    if (ageMs > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'Recent sign-in required' }, { status: 401 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const store = await cookies();
    store.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[auth] session creation failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/** Sign out: clear the cookie and revoke the refresh tokens behind it. */
export async function DELETE() {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;

  if (existing && isFirebaseAdminConfigured()) {
    try {
      const decoded = await getAdminAuth().verifySessionCookie(existing);
      await getAdminAuth().revokeRefreshTokens(decoded.sub);
    } catch {
      // An expired or already-invalid cookie is fine — we are deleting it anyway.
    }
  }

  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
