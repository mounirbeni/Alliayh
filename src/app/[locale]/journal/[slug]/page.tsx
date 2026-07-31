import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale, LOCALES } from '@/i18n';
import { formatDate } from '@/i18n/format';
import { getArticle, getArticleSlugs } from '@/lib/journal';
import { getProduct } from '@/lib/catalog';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getArticleSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const article = getArticle(slug);
  if (!article) return {};
  const content = article.content[locale];

  return buildMetadata({
    locale,
    path: `/journal/${slug}`,
    title: content.title,
    description: content.excerpt,
    image: article.image,
    type: 'article',
  });
}

/**
 * A journal article.
 *
 * The article body renders paragraph by paragraph from a blank-line-separated
 * string. The previous version fed that string through a `prose` wrapper while
 * typing it as `React.ReactNode`, so the compiler could not tell the two cases
 * apart and the runtime branch existed for a shape that never occurred.
 */
export default async function JournalArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const article = getArticle(slug);
  if (!article) notFound();

  const t = getDictionary(locale);
  const content = article.content[locale];

  // Related products are catalog slugs — the previous code compared slugs
  // against numeric ids, so this block never rendered anything.
  const related = article.relatedProducts
    .map((productSlug) => getProduct(productSlug, locale))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.journal.title, path: `/${locale}/journal` },
    { name: content.title, path: `/${locale}/journal/${slug}` },
  ];

  return (
    <SiteShell mainClassName="pb-24">
      <JsonLd
        data={[
          articleJsonLd({
            title: content.title,
            description: content.excerpt,
            path: `/${locale}/journal/${slug}`,
            image: article.image,
            datePublished: article.date,
            author: article.author,
            locale,
          }),
          breadcrumbJsonLd(crumbs),
        ]}
      />

      <div className="shell pt-6">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
      </div>

      <article>
        <header className="pt-16 pb-12 text-center shell space-y-8">
          <Link
            href={`/${locale}/journal`}
            className="inline-flex items-center gap-2 text-[10px] font-headline uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            {t.journal.title}
          </Link>

          <p className="flex items-center justify-center gap-4 text-xs font-headline uppercase tracking-widest text-primary font-bold">
            <span>{content.category}</span>
            <span className="w-1 h-1 rounded-full bg-primary/50" aria-hidden="true" />
            <span>{content.readTime}</span>
          </p>

          <h1 className="font-headline text-4xl md:text-6xl tracking-tight leading-tight">
            {content.title}
          </h1>

          <p className="text-lg text-muted-foreground italic leading-relaxed max-w-2xl mx-auto">
            {content.excerpt}
          </p>

          <p className="flex items-center justify-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
            <span className="font-bold text-foreground">{article.author}</span>
            <span className="w-1 h-1 rounded-full bg-primary/30" aria-hidden="true" />
            <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
          </p>
        </header>

        <div className="shell">
          <div className="relative aspect-[16/9] w-full overflow-hidden mb-16">
            <Image
              src={article.image}
              alt={article.imageAlt[locale]}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg dark:prose-invert prose-headings:font-headline prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-a:text-primary prose-a:font-bold prose-p:font-body prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:italic w-full max-w-none">
            {content.body.split('\n\n').map((block, index) =>
              block.startsWith('### ') ? (
                <h2 key={index}>{block.replace('### ', '')}</h2>
              ) : (
                <p key={index}>{block}</p>
              ),
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-32 pt-24 rule-t bg-primary/5">
          <div className="shell">
            <div className="text-center mb-16 space-y-4">
              <span className="text-primary label text-sm">{t.journal.curatedFor}</span>
              <h2 className="font-headline text-display-sm tracking-tightest tracking-tighter uppercase">
                {t.journal.shopTheRitual}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
