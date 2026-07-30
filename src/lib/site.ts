/**
 * Site-wide configuration — the single source of truth for brand identity,
 * canonical URLs and commerce defaults.
 *
 * Everything that used to be duplicated across metadata blocks, the manifest
 * and structured data now reads from here.
 */

import type { Locale } from '@/i18n';

/**
 * Canonical origin of the deployment. Set NEXT_PUBLIC_SITE_URL in the
 * environment; the fallback keeps local development and previews working.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lueurskin.com'
).replace(/\/$/, '');

export const SITE = {
  /** Legal / commercial brand name */
  name: 'Lueur Skin',
  /** Full brand lockup used in titles and structured data */
  legalName: 'Lueur Skin by Alliyah',
  founder: 'Alliyah',
  /** Short name for the PWA launcher */
  shortName: 'Lueur',
  url: SITE_URL,
  /** Brand colours — mirror the CSS custom properties in globals.css */
  themeColor: '#781430',
  backgroundColor: '#fdf2fa',
  /** Commerce defaults */
  currency: 'EUR',
  currencySymbol: '€',
  /** Where orders ship from / to */
  country: 'PT',
  email: 'hello@lueurskin.com',
  social: {
    instagram: 'https://instagram.com/lueurskin',
    tiktok: 'https://tiktok.com/@lueurskin',
  },
} as const;

/** Absolute URL builder — required for OpenGraph, sitemaps and JSON-LD. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Localised path builder. `localePath('pt', '/products')` → `/pt/products` */
export function localePath(locale: Locale, path = ''): string {
  const clean = path === '/' ? '' : path;
  return `/${locale}${clean.startsWith('/') || clean === '' ? clean : `/${clean}`}`;
}
