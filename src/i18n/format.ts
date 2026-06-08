/**
 * Localized formatting utilities.
 * Currency (€), numbers, and dates formatted per-locale conventions.
 *
 * PT-PT: 29,90 € | 1.234,56 | 30 de abril de 2026
 * EN:    €29.90  | 1,234.56 | 30 April 2026
 */
import { type Locale, LOCALE_BCP47 } from './index';

/** Format a price in Euros according to the active locale */
export function formatCurrency(amount: number, locale: Locale): string {
  const bcp = LOCALE_BCP47[locale];
  return new Intl.NumberFormat(bcp, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a number with locale-appropriate grouping and decimals */
export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const bcp = LOCALE_BCP47[locale];
  return new Intl.NumberFormat(bcp, options).format(value);
}

/** Format a date according to the active locale */
export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const bcp = LOCALE_BCP47[locale];
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(bcp, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d);
}
