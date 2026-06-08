import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cookie Consent Store — GDPR-compliant cookie preference management.
 * Blocks non-essential trackers until the user explicitly accepts.
 */
export interface CookiePreferences {
  necessary: boolean;   // Always true — cannot be disabled
  analytics: boolean;
  marketing: boolean;
}

interface CookieStore {
  hasConsented: boolean;
  showBanner: boolean;
  preferences: CookiePreferences;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Partial<CookiePreferences>) => void;
  resetConsent: () => void;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const useCookieStore = create<CookieStore>()(
  persist(
    (set) => ({
      hasConsented: false,
      showBanner: true,
      preferences: { ...DEFAULT_PREFERENCES },

      acceptAll: () =>
        set({
          hasConsented: true,
          showBanner: false,
          preferences: { necessary: true, analytics: true, marketing: true },
        }),

      rejectNonEssential: () =>
        set({
          hasConsented: true,
          showBanner: false,
          preferences: { necessary: true, analytics: false, marketing: false },
        }),

      savePreferences: (prefs) =>
        set((state) => ({
          hasConsented: true,
          showBanner: false,
          preferences: {
            ...state.preferences,
            ...prefs,
            necessary: true, // Necessary cookies cannot be disabled
          },
        })),

      resetConsent: () =>
        set({
          hasConsented: false,
          showBanner: true,
          preferences: { ...DEFAULT_PREFERENCES },
        }),
    }),
    {
      name: 'lueur-skin-cookies',
    }
  )
);
