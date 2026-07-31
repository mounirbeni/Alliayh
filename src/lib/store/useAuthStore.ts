"use client";

import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getClientAuth, isFirebaseClientConfigured } from '@/lib/firebase/client';

/**
 * Authentication.
 *
 * What this replaces: a persisted zustand store holding a `UserProfile`, fed by
 * an `api.login()` that returned a hard-coded user for *any* non-empty email and
 * password. "Signed in" was a value in the visitor's own localStorage — anyone
 * could set it, and no server ever checked it.
 *
 * Firebase now owns the credentials, `onAuthStateChanged` owns the state, and
 * every sign-in also mints an HttpOnly session cookie so Server Components can
 * verify the visitor independently of anything the browser claims.
 */

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean;
}

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-in-use'
  | 'weak-password'
  | 'too-many-requests'
  | 'not-configured'
  | 'unknown';

export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode };

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** False until the first `onAuthStateChanged` fires. */
  isReady: boolean;
  /** Local convenience field; the authoritative address lives on the order. */
  defaultShippingAddress: string;

  initialise: () => () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateAddress: (address: string) => void;
}

const ADDRESS_KEY = 'lueur-skin-address';

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    emailVerified: user.emailVerified,
  };
}

/** Map Firebase error codes to something we can translate and show. */
function mapError(error: unknown): AuthErrorCode {
  const code = (error as { code?: string }).code ?? '';

  // Firebase deliberately returns the same code for a wrong password and an
  // unknown address, so account existence is not leaked. Preserve that.
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    code === 'auth/invalid-email'
  ) {
    return 'invalid-credentials';
  }
  if (code === 'auth/email-already-in-use') return 'email-in-use';
  if (code === 'auth/weak-password') return 'weak-password';
  if (code === 'auth/too-many-requests') return 'too-many-requests';
  return 'unknown';
}

/** Exchange the fresh ID token for the server session cookie. */
async function syncServerSession(user: User): Promise<void> {
  const idToken = await user.getIdToken(true);
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    // The client would be signed in while the server is not. Fail loudly rather
    // than leave the two views of "who is this" disagreeing.
    throw new Error(`Session sync failed: ${response.status}`);
  }
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isReady: false,
  defaultShippingAddress: '',

  initialise: () => {
    const savedAddress =
      typeof window !== 'undefined' ? (window.localStorage.getItem(ADDRESS_KEY) ?? '') : '';

    if (!isFirebaseClientConfigured()) {
      // No project configured: settle into a known "signed out, ready" state
      // rather than leaving the UI on a permanent loading skeleton.
      set({ isReady: true, defaultShippingAddress: savedAddress });
      return () => {};
    }

    return onAuthStateChanged(getClientAuth(), (user) => {
      set({
        user: user ? toAuthUser(user) : null,
        isAuthenticated: Boolean(user),
        isReady: true,
        defaultShippingAddress: savedAddress,
      });
    });
  },

  signIn: async (email, password) => {
    if (!isFirebaseClientConfigured()) return { ok: false, code: 'not-configured' };

    try {
      const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
      await syncServerSession(credential.user);
      return { ok: true };
    } catch (error) {
      console.error('[auth] sign-in failed:', error);
      return { ok: false, code: mapError(error) };
    }
  },

  register: async (name, email, password) => {
    if (!isFirebaseClientConfigured()) return { ok: false, code: 'not-configured' };

    try {
      const credential = await createUserWithEmailAndPassword(getClientAuth(), email, password);
      await updateProfile(credential.user, { displayName: name });
      await syncServerSession(credential.user);

      set({ user: { ...toAuthUser(credential.user), name }, isAuthenticated: true });
      return { ok: true };
    } catch (error) {
      console.error('[auth] registration failed:', error);
      return { ok: false, code: mapError(error) };
    }
  },

  logout: async () => {
    // Clear the server session first; if that fails the visitor stays signed in
    // on both sides rather than only on the server.
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined);
    if (isFirebaseClientConfigured()) {
      await signOut(getClientAuth()).catch(() => undefined);
    }
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email) => {
    if (!isFirebaseClientConfigured()) return false;
    try {
      await sendPasswordResetEmail(getClientAuth(), email);
      return true;
    } catch (error) {
      console.error('[auth] password reset failed:', error);
      return false;
    }
  },

  updateAddress: (address) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(ADDRESS_KEY, address);
    set({ defaultShippingAddress: address });
  },
}));
