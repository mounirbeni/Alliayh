import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { WishlistView } from '@/components/wishlist/WishlistView';
import { getDictionary, isValidLocale } from '@/i18n';
import { getProducts } from '@/lib/catalog';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/wishlist',
    title: t.wishlistPage.metaTitle,
    description: t.wishlistPage.emptyDesc,
    noIndex: true,
  });
}

export default async function WishlistPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <WishlistView products={getProducts(locale)} />
    </SiteShell>
  );
}
