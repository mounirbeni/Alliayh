import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { ClearCartOnMount } from '@/components/checkout/ClearCartOnMount';
import { Button } from '@/components/ui/button';
import { getDictionary, isValidLocale } from '@/i18n';
import { getOrderBySessionId } from '@/lib/orders/lookup';
import { buildMetadata } from '@/lib/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// The order is looked up per request; there is nothing to prerender.
export const dynamic = 'force-dynamic';

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

export default async function CheckoutSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const query = await searchParams;
  const sessionIdParam = query.session_id;
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;

  const t = getDictionary(locale);
  const order = sessionId ? await getOrderBySessionId(sessionId) : null;

  if (!order) {
    return (
      <SiteShell>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-6">
          <h1 className="text-3xl font-headline">{t.checkout.noOrder}</h1>
          <p className="text-muted-foreground italic max-w-md">{t.checkout.noOrderDesc}</p>
          <Button asChild className="rounded-full uppercase tracking-widest text-[10px] font-bold h-12 px-8">
            <Link href={`/${locale}/products`}>{t.checkout.backToShop}</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* The bag is only emptied once a confirmed order has actually rendered. */}
      <ClearCartOnMount />
      <OrderConfirmation order={order} locale={locale} />
    </SiteShell>
  );
}
