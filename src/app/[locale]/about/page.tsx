import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Badge } from '@/components/ui/badge';
import { getDictionary, isValidLocale } from '@/i18n';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/about',
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    image: '/products/sea-moss-facts.jpg',
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.nav.story, path: `/${locale}/about` },
  ];

  return (
    <SiteShell className="selection:bg-primary/10" mainClassName="py-12 lg:py-24 overflow-x-hidden">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <div className="shell max-w-editorial">
          <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
          <div className="space-y-12 mb-20 text-center">
            <h1 className="font-headline text-display-lg tracking-tightest tracking-tighter leading-tight">
              {t.about.headline} <span className="italic font-light text-primary/80">{t.about.headlineAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed italic opacity-90">
              {t.about.quote}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative aspect-[4/5] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
              <Image 
                src="/products/sea-moss-facts.jpg"
                alt={t.about.founderImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform [transition-duration:10000ms]"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            
            <div className="space-y-8">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold">{t.about.founderBadge}</Badge>
              <h2 className="font-headline text-4xl tracking-tight">{t.about.founderTitle}</h2>
              <div className="space-y-6 text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                <p>{t.about.founderP1}</p>
                <p>{t.about.founderP2}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
             <div className="space-y-8 lg:order-1 order-2">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold">{t.about.standardBadge}</Badge>
              <h2 className="font-headline text-4xl tracking-tight">{t.about.standardTitle}</h2>
              <div className="space-y-6 text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                <p>{t.about.standardP1}</p>
                <p>{t.about.standardP2}</p>
              </div>
            </div>

            <div className="relative aspect-square overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] lg:order-2 order-1">
              <Image 
                src="/products/glow-tea.jpg"
                alt={t.about.ingredientsImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform [transition-duration:10000ms]"
              />
            </div>
          </div>

        </div>
    </SiteShell>
  );
}
