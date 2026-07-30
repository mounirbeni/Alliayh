/**
 * Catalog domain types.
 *
 * The catalog is the single source of truth for everything commerce-facing:
 * pricing, stock, taxonomy, imagery and per-locale copy. Facets (categories,
 * actives, concerns) are *derived* from this data rather than hand-written, so
 * a filter can never again offer an option that matches nothing.
 */
import type { Locale } from '@/i18n';

/** Stable taxonomy keys. Never localise these — they are used in URLs and filters. */
export const PRODUCT_CATEGORIES = ['gummies', 'tea'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Skin/wellness concerns a product addresses. Powers the advisor and filters. */
export const CONCERNS = [
  'hydration',
  'radiance',
  'clarity',
  'vitality',
  'barrier',
  'fatigue',
] as const;
export type Concern = (typeof CONCERNS)[number];

/** Key active ingredients, keyed so they can be translated and filtered on. */
export const ACTIVES = [
  'sea-moss',
  'bladderwrack',
  'burdock-root',
  'vitamin-c',
  'vitamin-d',
  'zinc',
  'goji',
  'rose',
  'mulberry',
  'cassia',
  'coix',
  'white-grass-root',
] as const;
export type Active = (typeof ACTIVES)[number];

/** One image in a product gallery. */
export interface ProductImage {
  src: string;
  /** Per-locale alternative text — never reuse the product name as alt. */
  alt: Record<Locale, string>;
}

/** Copy that differs per language. */
export interface ProductContent {
  name: string;
  tagline: string;
  description: string;
  usage: string;
  benefits: string[];
  /** Full declarative ingredient list, in the order printed on the pack. */
  ingredients: string[];
}

/** A product as stored in the catalog, before locale resolution. */
export interface CatalogProduct {
  /** Stable numeric id — preserved so existing /products/1 links keep working. */
  id: string;
  /** Human-readable, SEO-friendly identifier. */
  slug: string;
  sku: string;
  category: ProductCategory;
  /** Price in euros, tax inclusive. */
  price: number;
  /** Optional strike-through reference price for bundles. */
  compareAtPrice?: number;
  /** Fractional discount applied to subscription orders (0.15 → 15% off). */
  subscriptionDiscount: number;
  /** Units on hand. 0 means the buy button must be disabled. */
  stock: number;
  /** Net weight / unit count, shown next to the price. */
  unit: Record<Locale, string>;
  featured: boolean;
  concerns: readonly Concern[];
  actives: readonly Active[];
  images: readonly ProductImage[];
  rating: number;
  reviewsCount: number;
  /** ids of products merchandised alongside this one. */
  related: readonly string[];
  content: Record<Locale, ProductContent>;
}

/**
 * A product resolved for one locale — the flat shape components consume.
 * `category` stays the stable key; `categoryLabel` is what gets rendered.
 */
export interface Product {
  id: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  categoryLabel: string;
  name: string;
  tagline: string;
  description: string;
  usage: string;
  benefits: string[];
  ingredients: string[];
  price: number;
  compareAtPrice?: number;
  subscriptionPrice: number;
  subscriptionDiscount: number;
  stock: number;
  inStock: boolean;
  unit: string;
  featured: boolean;
  concerns: readonly Concern[];
  actives: readonly Active[];
  /** Primary image — kept as `image` for backwards compatibility. */
  image: string;
  imageAlt: string;
  images: { src: string; alt: string }[];
  rating: number;
  reviewsCount: number;
  related: readonly string[];
  /** Canonical, locale-aware path to the product page. */
  href: string;
}

/** Available sort orders on the collection page. */
export const SORT_OPTIONS = [
  'featured',
  'price-low',
  'price-high',
  'rating',
  'name',
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** Query accepted by `queryProducts` — mirrors the collection page URL params. */
export interface ProductQuery {
  search?: string;
  category?: ProductCategory | 'all';
  actives?: readonly Active[];
  concerns?: readonly Concern[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  inStockOnly?: boolean;
}
