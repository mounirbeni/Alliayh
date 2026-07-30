import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale, LOCALES } from '@/i18n';
import { formatDate } from '@/i18n/format';
import { LEGAL_SLUGS, LEGAL_UPDATED, getLegalDocument, getLegalDocuments } from '@/lib/legal';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

/**
 * Legal documents are now an explicit set. The route previously accepted any
 * slug and title-cased it into a heading over generic English boilerplate, so
 * `/legal/anything-at-all` returned HTTP 200 with fabricated terms.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => LEGAL_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const document = getLegalDocument(slug, locale);
  if (!document) return {};

  return buildMetadata({
    locale,
    path: `/legal/${slug}`,
    title: document.title,
    description: document.summary,
  });
}

export default async function LegalPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const document = getLegalDocument(slug, locale);
  if (!document) notFound();

  const t = getDictionary(locale);
  const siblings = getLegalDocuments(locale).filter((entry) => entry.slug !== document.slug);

  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: document.title, path: `/${locale}/legal/${slug}` },
  ];

  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <div className="py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />

          <article className="mt-6 bg-white dark:bg-black/20 p-8 md:p-16 rounded-[4rem] border border-primary/10 shadow-lg">
            <header className="mb-12 space-y-4">
              <h1 className="font-headline text-4xl md:text-5xl tracking-tight uppercase">
                {document.title}
              </h1>
              <p className="text-muted-foreground italic">{document.summary}</p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {formatDate(LEGAL_UPDATED, locale)}
              </p>
            </header>

            <div className="space-y-10 text-muted-foreground font-body leading-relaxed text-sm">
              {document.sections.map((section, index) => (
                <section key={section.heading} className="space-y-4">
                  <h2 className="font-headline text-xl text-foreground">
                    {index + 1}. {section.heading}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            <nav className="pt-12 mt-12 border-t border-primary/10 flex flex-wrap gap-x-6 gap-y-3">
              {siblings.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/${locale}/legal/${entry.slug}`}
                  className="text-primary hover:underline font-bold text-[11px] uppercase tracking-widest"
                >
                  {entry.title}
                </Link>
              ))}
              <Link
                href={`/${locale}`}
                className="text-muted-foreground hover:text-primary font-bold text-[11px] uppercase tracking-widest"
              >
                {t.common.backToHome}
              </Link>
            </nav>
          </article>
        </div>
      </div>
    </SiteShell>
  );
}
