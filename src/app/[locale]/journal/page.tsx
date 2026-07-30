import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import { getArticles } from '@/lib/journal';
import { formatDate } from '@/i18n/format';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/journal',
    title: t.journal.title,
    description: t.journal.subtitle,
    image: '/products/sea-moss-facts.jpg',
  });
}

export default async function JournalPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const articles = getArticles(locale);
  const [featured, ...rest] = articles;

  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.journal.title, path: `/${locale}/journal` },
  ];

  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section className="py-20 md:py-32 bg-primary/5 text-center px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="flex justify-center mb-6">
            <span className="h-16 w-16 rounded-full bg-background flex items-center justify-center text-primary shadow-lg border border-primary/10">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <h1 className="font-headline text-fluid-h1 tracking-tighter uppercase">{t.journal.title}</h1>
          <p className="text-muted-foreground font-body text-lg italic leading-relaxed max-w-2xl mx-auto">
            {t.journal.subtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
      </div>

      <section className="py-20 container mx-auto px-4">
        {featured && (
          <article className="mb-24 relative rounded-[3rem] overflow-hidden bg-white dark:bg-black/20 border border-primary/10 shadow-sm flex flex-col lg:flex-row group transition-all hover:shadow-xl">
            <div className="relative w-full lg:w-3/5 aspect-[4/3] lg:aspect-auto h-auto lg:min-h-[500px]">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform [transition-duration:10000ms] ease-out"
                priority
              />
            </div>
            <div className="w-full lg:w-2/5 p-8 md:p-16 flex flex-col justify-center space-y-6">
              <p className="flex items-center gap-4 text-xs font-headline uppercase tracking-widest text-primary font-bold">
                <span>{featured.category}</span>
                <span className="w-1 h-1 rounded-full bg-primary/50" aria-hidden="true" />
                <span>{featured.readTime}</span>
              </p>
              <h2 className="font-headline text-4xl md:text-5xl leading-tight group-hover:text-primary transition-colors">
                <Link
                  href={`/${locale}/journal/${featured.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="text-muted-foreground italic leading-relaxed text-lg">{featured.excerpt}</p>
              <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
                <span className="text-sm font-headline uppercase tracking-widest font-bold">
                  {featured.author}
                </span>
                <time dateTime={featured.date} className="text-xs text-muted-foreground">
                  {formatDate(featured.date, locale)}
                </time>
              </div>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {rest.map((article) => (
            <article key={article.slug} className="group relative">
              <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-6 bg-primary/5">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-[10px] font-headline uppercase tracking-widest text-primary font-bold">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/50" aria-hidden="true" />
                  <span>{article.readTime}</span>
                </p>
                <h2 className="font-headline text-3xl leading-tight group-hover:text-primary transition-colors">
                  <Link
                    href={`/${locale}/journal/${article.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground italic line-clamp-2">{article.excerpt}</p>
                <time dateTime={article.date} className="block text-xs text-muted-foreground">
                  {formatDate(article.date, locale)}
                </time>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
