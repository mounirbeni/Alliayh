"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';

/**
 * Subscribes the app to Firebase auth state for its lifetime.
 *
 * Mounted once in the root layout so every surface reads the same live session,
 * and so signing out in one tab is reflected in the others.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialise = useAuthStore((state) => state.initialise);

  useEffect(() => initialise(), [initialise]);

  return <>{children}</>;
}
