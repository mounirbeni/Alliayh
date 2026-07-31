"use client";

import { create } from 'zustand';
import {
  currentUserAction,
  registerAction,
  saveShippingAddressAction,
  signInAction,
  signOutAction,
  type AuthErrorCode,
  type AuthResult,
} from '@/lib/auth/actions';

/**
 * Authentication state for the browser.
 *
 * This holds a *reflection* of the server session, never the source of truth.
 * The session cookie is HttpOnly, so this store cannot read or forge it; every
 * protected read re-verifies on the server. Clearing localStorage or editing
 * this store signs nobody in.
 *
 * That is the whole point of the rewrite: the original store persisted a user
 * object to localStorage and treated its presence as proof of authentication.
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  shippingAddress: string | null;
}

export type { AuthErrorCode, AuthResult };

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** False until the first server check completes. */
  isReady: boolean;
  defaultShippingAddress: string;

  initialise: () => () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateAddress: (address: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isReady: false,
  defaultShippingAddress: '',

  initialise: () => {
    let cancelled = false;

    void currentUserAction()
      .then((user) => {
        if (cancelled) return;
        set({
          user,
          isAuthenticated: Boolean(user),
          isReady: true,
          defaultShippingAddress: user?.shippingAddress ?? '',
        });
      })
      .catch(() => {
        if (!cancelled) set({ isReady: true });
      });

    return () => {
      cancelled = true;
    };
  },

  signIn: async (email, password) => {
    const result = await signInAction({ email, password });
    if (result.ok) {
      set({
        user: result.user,
        isAuthenticated: true,
        isReady: true,
        defaultShippingAddress: result.user.shippingAddress ?? '',
      });
    }
    return result;
  },

  register: async (name, email, password) => {
    const result = await registerAction({ name, email, password });
    if (result.ok) {
      set({
        user: result.user,
        isAuthenticated: true,
        isReady: true,
        defaultShippingAddress: result.user.shippingAddress ?? '',
      });
    }
    return result;
  },

  logout: async () => {
    await signOutAction().catch(() => undefined);
    set({ user: null, isAuthenticated: false, defaultShippingAddress: '' });
  },

  updateAddress: async (address) => {
    set({ defaultShippingAddress: address });
    await saveShippingAddressAction(address).catch(() => undefined);
  },
}));
