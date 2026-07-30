import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { AccountView } from '@/components/account/AccountView';
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
    path: '/account',
    title: t.account.title,
    description: t.account.welcomeBack,
    noIndex: true,
  });
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <AccountView products={getProducts(locale)} />
    </SiteShell>
  );
}
