/**
 * SEO helpers — canonical URLs, hreflang alternates and JSON-LD builders.
 *
 * Before this module only the root layout emitted metadata, so every route
 * shared one title, no canonical URL and no structured data. Search engines saw
 * a four-product shop as a single untitled page.
 */
import type { Metadata } from 'next';
import { LOCALES, LOCALE_BCP47, LOCALE_OG, type Locale } from '@/i18n';
import { SITE, absoluteUrl } from './site';
import type { Product } from './catalog/types';

interface PageMetaInput {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  /** Absolute or root-relative image used for social cards. */
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}

/** Compose a complete, canonical-aware Metadata object for a route. */
export function buildMetadata({
  locale,
  path = '',
  title,
  description,
  image = '/products/glow-tea.jpg',
  type = 'website',
  keywords,
  noIndex = false,
}: PageMetaInput): Metadata {
  const clean = path === '/' ? '' : path;
  const url = absoluteUrl(`/${locale}${clean}`);

  const languages = Object.fromEntries(
    LOCALES.map((entry) => [LOCALE_BCP47[entry], `/${entry}${clean}`]),
  ) as Record<string, string>;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}${clean}`,
      languages: { ...languages, 'x-default': `/pt${clean}` },
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE.legalName,
      locale: LOCALE_OG[locale],
      alternateLocale: LOCALES.filter((entry) => entry !== locale).map(
        (entry) => LOCALE_OG[entry],
      ),
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD builders
 * ------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE.legalName,
    alternateName: SITE.name,
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl('/icons/icon-512x512.png'),
    email: SITE.email,
    founder: { '@type': 'Person', name: SITE.founder },
    sameAs: [SITE.social.instagram, SITE.social.tiktok],
  };
}

export function webSiteJsonLd(locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE.legalName,
    url: absoluteUrl(`/${locale}`),
    inLanguage: LOCALE_BCP47[locale],
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl(`/${locale}/products?q={search_term_string}`),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productJsonLd(product: Product, locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(product.href) + '#product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.categoryLabel,
    image: product.images.map((image) => absoluteUrl(image.src)),
    brand: { '@type': 'Brand', name: SITE.legalName },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(product.href),
      priceCurrency: SITE.currency,
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': absoluteUrl('/#organization') },
    },
    inLanguage: LOCALE_BCP47[locale],
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  author: string;
  locale: Locale;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.image),
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: absoluteUrl(article.path),
    inLanguage: LOCALE_BCP47[article.locale],
  };
}

export function itemListJsonLd(products: Product[], name: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(product.href),
      name: product.name,
    })),
  };
}
