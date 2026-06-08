/**
 * i18n — Internationalization entry point
 * Provides dictionary access based on the current locale.
 * Supported locales: 'pt' (default, maps to pt-PT), 'en'
 */
import { cache } from 'react';
import { pt, type Dictionary } from './dictionaries/pt';
import { en } from './dictionaries/en';

export type Locale = 'pt' | 'en';

export const LOCALES: Locale[] = ['pt', 'en'];
export const DEFAULT_LOCALE: Locale = 'pt';

/** Maps locale codes to BCP-47 tags for Intl APIs */
export const LOCALE_BCP47: Record<Locale, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
};

const dictionaries: Record<Locale, Dictionary> = { pt, en };

/** Returns the full dictionary for a given locale (cached for RSC) */
export const getDictionary = cache((locale: Locale): Dictionary => {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
});

/** Type guard to check if a string is a valid locale */
export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export type { Dictionary };
