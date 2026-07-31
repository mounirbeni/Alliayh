"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';

/**
 * Resolves the server session once, on mount.
 *
 * Mounted in the root layout so every surface reads the same answer. The store
 * it fills is only a reflection of the HttpOnly session cookie — the server
 * re-verifies that cookie on every protected read regardless of what this says.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialise = useAuthStore((state) => state.initialise);

  useEffect(() => initialise(), [initialise]);

  return <>{children}</>;
}
