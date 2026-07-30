/**
 * Human-readable labels for the catalog taxonomy.
 *
 * These live with the catalog rather than in the UI dictionary because they
 * describe data, not chrome. Keeping them in one typed record guarantees every
 * taxonomy key has a label in every locale — the compiler rejects a partial map.
 */
import type { Locale } from '@/i18n';
import type { Active, Concern, ProductCategory } from './types';

export const CATEGORY_LABELS: Record<ProductCategory, Record<Locale, string>> = {
  gummies: { pt: 'Gomas', en: 'Gummies' },
  tea: { pt: 'Chás', en: 'Tea' },
};

export const ACTIVE_LABELS: Record<Active, Record<Locale, string>> = {
  'sea-moss': { pt: 'Musgo marinho', en: 'Sea moss' },
  bladderwrack: { pt: 'Bodelha', en: 'Bladderwrack' },
  'burdock-root': { pt: 'Raiz de bardana', en: 'Burdock root' },
  'vitamin-c': { pt: 'Vitamina C', en: 'Vitamin C' },
  'vitamin-d': { pt: 'Vitamina D', en: 'Vitamin D' },
  zinc: { pt: 'Zinco', en: 'Zinc' },
  goji: { pt: 'Goji', en: 'Goji' },
  rose: { pt: 'Rosa', en: 'Rose' },
  mulberry: { pt: 'Amoreira', en: 'Mulberry' },
  cassia: { pt: 'Cássia', en: 'Cassia' },
  coix: { pt: 'Coix', en: 'Coix' },
  'white-grass-root': { pt: 'Raiz de imperata', en: 'White grass root' },
};

export const CONCERN_LABELS: Record<Concern, Record<Locale, string>> = {
  hydration: { pt: 'Hidratação', en: 'Hydration' },
  radiance: { pt: 'Luminosidade', en: 'Radiance' },
  clarity: { pt: 'Pele limpa', en: 'Clarity' },
  vitality: { pt: 'Vitalidade', en: 'Vitality' },
  barrier: { pt: 'Barreira cutânea', en: 'Skin barrier' },
  fatigue: { pt: 'Cansaço', en: 'Fatigue' },
};

export function categoryLabel(category: ProductCategory, locale: Locale): string {
  return CATEGORY_LABELS[category][locale];
}

export function activeLabel(active: Active, locale: Locale): string {
  return ACTIVE_LABELS[active][locale];
}

export function concernLabel(concern: Concern, locale: Locale): string {
  return CONCERN_LABELS[concern][locale];
}
