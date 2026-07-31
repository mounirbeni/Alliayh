import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AdvisorView } from '@/components/advisor/AdvisorView';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import { getProducts } from '@/lib/catalog';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/advisor',
    title: t.advisor.metaTitle,
    description: t.advisor.metaDescription,
    image: '/products/sea-moss-front.jpg',
  });
}

export default async function AdvisorPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.nav.advisor, path: `/${locale}/advisor` },
  ];

  return (
    <SiteShell className="selection:bg-primary/10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
      </div>
      {/* The catalog is passed in so "add to bag" from a recommendation uses the
          same stock-checked product record as the rest of the shop. */}
      <AdvisorView products={getProducts(locale)} />
    </SiteShell>
  );
}
