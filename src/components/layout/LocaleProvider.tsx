"use client";

import React, { createContext, useMemo } from 'react';
import type { Locale, Dictionary } from '@/i18n';
import { getDictionary } from '@/i18n';

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provides the current locale and dictionary to all Client Components via React Context.
 * The locale is strictly derived from the Next.js URL parameter.
 * This replaces the Zustand implementation to prevent hydration flashes and setState-in-render errors.
 */
export function LocaleProvider({
  locale,
  children
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({
    locale,
    dictionary: getDictionary(locale)
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
