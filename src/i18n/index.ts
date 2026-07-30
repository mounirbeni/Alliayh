/**
 * i18n — Internationalisation entry point.
 *
 * Locale constants live in `./config` (edge-safe, no dictionary payload);
 * this module layers dictionary access on top for the app runtime.
 */
import { cache } from 'react';
import { pt, type Dictionary } from './dictionaries/pt';
import { en } from './dictionaries/en';
import { toLocale, type Locale } from './config';

export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_BCP47,
  LOCALE_OG,
  LOCALE_COOKIE,
  isValidLocale,
  negotiateLocale,
  splitLocalePath,
  toLocale,
  type Locale,
} from './config';

const dictionaries: Record<Locale, Dictionary> = { pt, en };

/** Returns the full dictionary for a locale (memoised per request in RSC). */
export const getDictionary = cache((locale: Locale | string): Dictionary => {
  return dictionaries[toLocale(locale)];
});

export type { Dictionary };
