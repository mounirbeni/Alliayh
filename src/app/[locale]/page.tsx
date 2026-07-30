import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { HomeView } from '@/components/home/HomeView';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import { getFeaturedProducts } from '@/lib/catalog';
import { buildMetadata, itemListJsonLd } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '',
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords.split(',').map((keyword) => keyword.trim()),
  });
}

/**
 * Home — a Server Component shell around the animated client view.
 *
 * The whole page used to be `"use client"`, which meant it could not export
 * metadata or structured data, and the catalog was bundled into the browser
 * payload. Now the catalog is read on the server and only the presentation
 * hydrates.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const products = getFeaturedProducts(locale, 4);

  return (
    <SiteShell mainClassName="overflow-x-hidden">
      <JsonLd data={itemListJsonLd(products, t.bestSellers.headline1)} />
      <HomeView products={products} />
    </SiteShell>
  );
}
