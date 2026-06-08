export const locales = ["pt-PT", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-PT";

export const localePrefix = "always";

export const localizedRoutes = {
  "/": { "pt-PT": "/", en: "/" },
  "/products": { "pt-PT": "/produtos", en: "/products" },
  "/about": { "pt-PT": "/sobre", en: "/about" },
  "/advisor": { "pt-PT": "/consultor", en: "/advisor" },
  "/journal": { "pt-PT": "/diario", en: "/journal" },
  "/contact": { "pt-PT": "/contacto", en: "/contact" },
  "/faq": { "pt-PT": "/faq", en: "/faq" },
  "/privacy": { "pt-PT": "/privacidade", en: "/privacy" },
  "/terms": { "pt-PT": "/termos", en: "/terms" },
  "/cookies": { "pt-PT": "/cookies", en: "/cookies" },
  "/shipping-returns": { "pt-PT": "/envios-devolucoes", en: "/shipping-returns" },
  "/accessibility": { "pt-PT": "/acessibilidade", en: "/accessibility" },
  "/checkout": { "pt-PT": "/checkout", en: "/checkout" },
  "/pricing": { "pt-PT": "/precos", en: "/pricing" },
  "/auth/login": { "pt-PT": "/auth/login", en: "/auth/login" },
  "/auth/register": { "pt-PT": "/auth/register", en: "/auth/register" },
  "/dashboard": { "pt-PT": "/painel", en: "/dashboard" },
  "/account": { "pt-PT": "/conta", en: "/account" },
} as const;

export type InternalRoute = keyof typeof localizedRoutes;

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
