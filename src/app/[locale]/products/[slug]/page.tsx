import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale, LOCALES } from '@/i18n';
import { CATALOG, getProduct, getRelatedProducts } from '@/lib/catalog';
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

/**
 * Pre-render every product in every language at build time. The route was
 * previously rendered on demand *and* fetched its data in a `useEffect`, so the
 * first paint was a spinner and crawlers saw an empty page.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CATALOG.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const product = getProduct(slug, locale);
  if (!product) return { title: getDictionary(locale).productDetail.productNotFound };

  return buildMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${product.name} — ${product.tagline}`,
    description: product.description,
    image: product.image,
    keywords: [product.name, product.categoryLabel, ...product.ingredients],
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const product = getProduct(slug, locale);
  if (!product) notFound();

  // Legacy numeric URLs (/products/1) resolve, then redirect to the slug so a
  // single canonical URL accumulates ranking.
  if (product.slug !== slug) {
    permanentRedirect(`/${locale}/products/${product.slug}`);
  }

  const t = getDictionary(locale);
  const related = getRelatedProducts(product, locale, 3);

  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.productsPage.title, path: `/${locale}/products` },
    { name: product.name, path: `/${locale}/products/${product.slug}` },
  ];

  return (
    <SiteShell>
      <JsonLd data={[productJsonLd(product, locale), breadcrumbJsonLd(crumbs)]} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
      </div>
      <ProductDetailView product={product} related={related} />
    </SiteShell>
  );
}
