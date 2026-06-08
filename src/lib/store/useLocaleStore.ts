"use client";

import { useContext } from 'react';
import { LocaleContext } from '@/components/layout/LocaleProvider';
import { type Locale, DEFAULT_LOCALE, getDictionary, type Dictionary } from '@/i18n';

interface LocaleStore {
  locale: Locale;
  dictionary: Dictionary;
}

/**
 * Hook to access the current locale and dictionary.
 * Previously implemented with Zustand, now uses React Context to guarantee
 * synchronous resolution and eliminate hydration errors.
 */
export function useLocaleStore(): LocaleStore {
  const context = useContext(LocaleContext);
  
  if (!context) {
    // Fallback if used outside of LocaleProvider
    return {
      locale: DEFAULT_LOCALE,
      dictionary: getDictionary(DEFAULT_LOCALE)
    };
  }
  
  return context;
}
