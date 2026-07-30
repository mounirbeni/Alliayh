import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { CartView } from '@/components/cart/CartView';
import { getDictionary, isValidLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/cart',
    title: t.cart.metaTitle,
    description: t.cart.emptyDesc,
    // A personal, transactional page has nothing to offer an index.
    noIndex: true,
  });
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <CartView />
    </SiteShell>
  );
}
