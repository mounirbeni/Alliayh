import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_BCP47, type Locale } from '@/i18n';
import { CATALOG } from '@/lib/catalog';
import { JOURNAL_ARTICLES } from '@/lib/journal';
import { LEGAL_SLUGS } from '@/lib/legal';
import { absoluteUrl } from '@/lib/site';

/**
 * XML sitemap with hreflang alternates.
 *
 * The site previously shipped none, so every route depended on being crawled
 * from a link. Each entry lists its counterpart in the other locale, which is
 * what stops Google treating `/pt/products` and `/en/products` as duplicates.
 */

/** Routes that exist in both locales and are worth indexing. */
const STATIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/advisor', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/journal', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/glossary', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
];

/** Transactional and personal routes must never be indexed. */
function alternatesFor(path: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [LOCALE_BCP47[locale], absoluteUrl(`/${locale}${path}`)]),
    ),
  };
}

function entriesFor(
  path: string,
  options: { priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; lastModified?: Date },
): MetadataRoute.Sitemap {
  return LOCALES.map((locale: Locale) => ({
    url: absoluteUrl(`/${locale}${path}`),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: alternatesFor(path),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.flatMap(({ path, priority, changeFrequency }) =>
    entriesFor(path, { priority, changeFrequency }),
  );

  const productEntries = CATALOG.flatMap((product) =>
    entriesFor(`/products/${product.slug}`, {
      priority: 0.9,
      changeFrequency: 'weekly',
    }),
  );

  const journalEntries = JOURNAL_ARTICLES.flatMap((article) =>
    entriesFor(`/journal/${article.slug}`, {
      priority: 0.6,
      changeFrequency: 'yearly',
      lastModified: new Date(article.date),
    }),
  );

  const legalEntries = LEGAL_SLUGS.flatMap((slug) =>
    entriesFor(`/legal/${slug}`, { priority: 0.3, changeFrequency: 'yearly' }),
  );

  return [...staticEntries, ...productEntries, ...journalEntries, ...legalEntries];
}
