import type { Locale } from "@/i18n/config";

export function formatMessage(template: string, variables: Record<string, string | number>): string {
  return Object.entries(variables).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(value: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}
