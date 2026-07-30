import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { LoginView } from '@/components/auth/LoginView';
import { getDictionary, isValidLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/login',
    title: t.login.title,
    description: t.login.subtitle,
    // Personal or transactional — nothing to index.
    noIndex: true,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <LoginView />
    </SiteShell>
  );
}
