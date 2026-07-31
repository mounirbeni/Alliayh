/**
 * Catalog query layer.
 *
 * Pure, synchronous and side-effect free, so it runs identically in Server
 * Components, Route Handlers, the sitemap generator and the AI advisor. The
 * previous `api.products` module simulated 800 ms of network latency against a
 * local array, which forced every product surface into a client-side loading
 * state for no reason; that is gone.
 */
import type { Locale } from '@/i18n';
import { CATALOG } from './data';
import { activeLabel, categoryLabel, concernLabel } from './taxonomy';
import {
  PRODUCT_CATEGORIES,
  type Active,
  type CatalogProduct,
  type Concern,
  type Product,
  type ProductCategory,
  type ProductQuery,
  type SortOption,
} from './types';

export * from './types';
export {
  CATEGORY_LABELS,
  ACTIVE_LABELS,
  CONCERN_LABELS,
  activeLabel,
  categoryLabel,
  concernLabel,
} from './taxonomy';

/** Round to cents so subscription pricing never produces 38.249999999. */
function toCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Resolve a stored product into the flat, locale-specific shape the UI uses. */
export function resolveProduct(product: CatalogProduct, locale: Locale): Product {
  const content = product.content[locale];
  const primary = product.images[0];

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    category: product.category,
    categoryLabel: categoryLabel(product.category, locale),
    name: content.name,
    tagline: content.tagline,
    description: content.description,
    usage: content.usage,
    benefits: content.benefits,
    ingredients: content.ingredients,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    subscriptionPrice: toCents(product.price * (1 - product.subscriptionDiscount)),
    subscriptionDiscount: product.subscriptionDiscount,
    stock: product.stock,
    inStock: product.stock > 0,
    unit: product.unit[locale],
    featured: product.featured,
    concerns: product.concerns,
    actives: product.actives,
    image: primary?.src ?? '/products/sea-moss-front.jpg',
    imageAlt: primary?.alt[locale] ?? content.name,
    images: product.images.map((image) => ({
      src: image.src,
      alt: image.alt[locale],
    })),
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    related: product.related,
    href: `/${locale}/products/${product.slug}`,
  };
}

/** Every product, resolved for the given locale. */
export function getProducts(locale: Locale): Product[] {
  return CATALOG.map((product) => resolveProduct(product, locale));
}

/** Products flagged for the home page, capped at `limit`. */
export function getFeaturedProducts(locale: Locale, limit = 4): Product[] {
  return getProducts(locale)
    .filter((product) => product.featured)
    .slice(0, limit);
}

/**
 * Look a product up by slug *or* legacy numeric id, so links published before
 * slugs existed keep resolving instead of 404ing.
 */
export function getProduct(idOrSlug: string, locale: Locale): Product | undefined {
  const match = CATALOG.find(
    (product) => product.slug === idOrSlug || product.id === idOrSlug,
  );
  return match ? resolveProduct(match, locale) : undefined;
}

/** Merchandised companions for a product, falling back to other featured items. */
export function getRelatedProducts(product: Product, locale: Locale, limit = 3): Product[] {
  const explicit = product.related
    .map((id) => getProduct(id, locale))
    .filter((item): item is Product => Boolean(item));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const filler = getProducts(locale).filter(
    (candidate) =>
      candidate.id !== product.id && !explicit.some((item) => item.id === candidate.id),
  );

  return [...explicit, ...filler].slice(0, limit);
}

/** Normalise text for accent-insensitive matching (`chá` matches `cha`). */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Free-text search across name, tagline, description and ingredients. */
export function searchProducts(term: string, locale: Locale, limit?: number): Product[] {
  const query = normalise(term);
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean);

  const results = getProducts(locale).filter((product) => {
    const haystack = normalise(
      [
        product.name,
        product.tagline,
        product.description,
        product.categoryLabel,
        ...product.ingredients,
        ...product.actives.map((active) => activeLabel(active, locale)),
        ...product.concerns.map((concern) => concernLabel(concern, locale)),
      ].join(' '),
    );
    return tokens.every((token) => haystack.includes(token));
  });

  return typeof limit === 'number' ? results.slice(0, limit) : results;
}

const SORTERS: Record<SortOption, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id),
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
};

/** Filter + sort the catalog. Used by the collection page and the search page. */
export function queryProducts(query: ProductQuery, locale: Locale): Product[] {
  const {
    search,
    category = 'all',
    actives = [],
    concerns = [],
    minPrice,
    maxPrice,
    sort = 'featured',
    inStockOnly = false,
  } = query;

  let results = search ? searchProducts(search, locale) : getProducts(locale);

  if (category !== 'all') {
    results = results.filter((product) => product.category === category);
  }
  if (actives.length > 0) {
    results = results.filter((product) =>
      actives.every((active) => product.actives.includes(active)),
    );
  }
  if (concerns.length > 0) {
    results = results.filter((product) =>
      concerns.some((concern) => product.concerns.includes(concern)),
    );
  }
  if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) {
    results = results.filter((product) => product.price >= minPrice);
  }
  if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) {
    results = results.filter((product) => product.price <= maxPrice);
  }
  if (inStockOnly) {
    results = results.filter((product) => product.inStock);
  }

  return [...results].sort(SORTERS[sort]);
}

/** A selectable filter value with the count of products behind it. */
export interface Facet<T extends string> {
  value: T;
  label: string;
  count: number;
}

export interface CatalogFacets {
  categories: Facet<ProductCategory>[];
  actives: Facet<Active>[];
  concerns: Facet<Concern>[];
  priceRange: { min: number; max: number };
}

/**
 * Facets derived from the live catalog.
 *
 * This replaces the hand-maintained arrays on the collection page, which listed
 * categories (`Cleansers`, `Moisturizers`, `Masks`, `Toners`) and actives
 * (`Hyaluronic Acid`, `Peptides`, `Squalane`, `Niacinamide`) that no product
 * has ever had — every one of those filters returned an empty grid.
 */
export function getFacets(locale: Locale): CatalogFacets {
  const products = getProducts(locale);

  const countBy = <T extends string>(
    keys: readonly T[],
    pick: (product: Product) => readonly T[],
    label: (key: T) => string,
  ): Facet<T>[] =>
    keys
      .map((value) => ({
        value,
        label: label(value),
        count: products.filter((product) => pick(product).includes(value)).length,
      }))
      .filter((facet) => facet.count > 0)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const prices = products.map((product) => product.price);

  return {
    categories: countBy(
      PRODUCT_CATEGORIES,
      (product) => [product.category],
      (value) => categoryLabel(value, locale),
    ),
    actives: countBy(
      // Only surface actives that at least one product actually contains.
      [...new Set(products.flatMap((product) => product.actives))],
      (product) => product.actives,
      (value) => activeLabel(value, locale),
    ),
    concerns: countBy(
      [...new Set(products.flatMap((product) => product.concerns))],
      (product) => product.concerns,
      (value) => concernLabel(value, locale),
    ),
    priceRange: {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    },
  };
}

/** Every product slug — used by `generateStaticParams` and the sitemap. */
export function getProductSlugs(): string[] {
  return CATALOG.map((product) => product.slug);
}

export { CATALOG };
