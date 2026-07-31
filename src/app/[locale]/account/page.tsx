import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { AccountView } from '@/components/account/AccountView';
import { getDictionary, isValidLocale } from '@/i18n';
import { getProducts } from '@/lib/catalog';
import { getSessionUser } from '@/lib/auth/session';
import { orderStore } from '@/lib/orders/store';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

// The order history belongs to whoever is signed in; never cache it.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/account',
    title: t.account.title,
    description: t.account.welcomeBack,
    noIndex: true,
  });
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  // The session cookie is verified server-side, so the order history is
  // resolved from the identity the server established — not from whatever the
  // browser claims to be.
  const session = await getSessionUser();
  const orders = session?.email ? await orderStore.listByEmail(session.email) : [];

  return (
    <SiteShell>
      <AccountView products={getProducts(locale)} orders={orders} />
    </SiteShell>
  );
}
