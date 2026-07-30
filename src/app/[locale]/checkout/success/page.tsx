import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { getDictionary, isValidLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/checkout/success',
    title: t.checkout.successMetaTitle,
    description: t.checkout.thankYouDesc,
    noIndex: true,
  });
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <OrderConfirmation />
    </SiteShell>
  );
}
