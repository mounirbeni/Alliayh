/**
 * Locale configuration — dependency-free on purpose.
 *
 * The middleware runs on the Edge runtime and only needs the locale list. It
 * used to import `@/i18n`, which pulls both full translation dictionaries into
 * the edge bundle. Keeping the constants in their own module means the
 * middleware ships kilobytes instead of the entire copy deck.
 */

export type Locale = 'pt' | 'en';

export const LOCALES = ['pt', 'en'] as const satisfies readonly Locale[];

export const DEFAULT_LOCALE: Locale = 'pt';

/** Maps locale codes to BCP-47 tags for Intl APIs and `hreflang`. */
export const LOCALE_BCP47: Record<Locale, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
};

/** OpenGraph wants underscores. */
export const LOCALE_OG: Record<Locale, string> = {
  pt: 'pt_PT',
  en: 'en_GB',
};

/** Cookie used to remember an explicit language choice across visits. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** Type guard for values coming out of the URL. */
export function isValidLocale(value: string | undefined | null): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Coerce anything into a supported locale. */
export function toLocale(value: string | undefined | null): Locale {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Pick the best locale from an `Accept-Language` header.
 *
 * Implements q-value ordering and falls back to the base language, so
 * `en-US,en;q=0.9,pt;q=0.8` resolves to `en` rather than silently defaulting to
 * Portuguese the way the old middleware did for every visitor.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((param) => param.trim().startsWith('q='));
      const quality = qParam ? Number.parseFloat(qParam.split('=')[1] ?? '1') : 1;
      return { tag: (tag ?? '').trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isValidLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

/** Split a pathname into its locale prefix and the remaining path. */
export function splitLocalePath(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  const [first, ...others] = segments;
  if (isValidLocale(first)) {
    return { locale: first, rest: others.length ? `/${others.join('/')}` : '' };
  }
  return { locale: null, rest: pathname === '/' ? '' : pathname };
}
