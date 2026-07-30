import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RegisterView } from '@/components/auth/RegisterView';
import { getDictionary, isValidLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/register',
    title: t.register.title,
    description: t.register.subtitle,
    // Personal or transactional — nothing to index.
    noIndex: true,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <SiteShell>
      <RegisterView />
    </SiteShell>
  );
}
