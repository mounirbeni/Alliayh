import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Leaf, Droplets, Sparkles, ShieldCheck } from 'lucide-react';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

// We map icons here because we cannot store React components inside JSON/TS dictionaries safely or cleanly
const ICONS = {
  0: Droplets,
  1: Leaf,
  2: Sparkles,
  3: ShieldCheck,
};

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/glossary',
    title: `${t.glossary.title} ${t.glossary.titleAccent}`,
    description: t.glossary.subtitle,
    image: '/products/sea-moss-facts.jpg',
  });
}

export default async function GlossaryPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.glossary.title, path: `/${locale}/glossary` },
  ];

  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
        {/* Header */}
        <section className="py-24 bg-primary text-white text-center px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
           <div className="shell space-y-6 relative z-10">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-5 py-2 rounded-full mb-4">
               <Leaf className="h-4 w-4" aria-hidden="true" />
               <span className="label text-[10px] uppercase tracking-widest">{t.glossary.badge}</span>
             </div>
             
             <h1 className="font-headline text-5xl md:text-7xl tracking-tighter uppercase">{t.glossary.title}<br /><span className="italic font-light text-secondary">{t.glossary.titleAccent}</span></h1>
             <p className="text-white/80 font-body text-lg italic leading-relaxed max-w-2xl mx-auto pt-4">
               {t.glossary.subtitle}
             </p>
           </div>
        </section>

        <div className="shell pt-6">
          <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
        </div>

        {/* Glossary Grid */}
        <section className="py-24 shell">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
             {t.glossary.items.map((item, index) => {
               const Icon = ICONS[index as keyof typeof ICONS] || Leaf;
               return (
                 <div key={index} className="flex flex-col gap-6 p-8 md:p-12 rule-t rule-b rule-l rule-r bg-white dark:bg-black/20 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                   
                   <div className="flex items-start justify-between">
                     <div className="space-y-2">
                       <span className="text-[10px] font-headline uppercase tracking-[0.2em] text-primary/70 font-bold bg-primary/5 px-3 py-1 rounded-full">{t.glossary.sourcedFrom} {item.origin}</span>
                       <h2 className="font-headline text-3xl md:text-4xl">{item.name}</h2>
                     </div>
                     <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center shrink-0 rule-t rule-b rule-l rule-r group-hover:scale-110 transition-transform">
                       <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                     </div>
                   </div>

                   <p className="text-muted-foreground italic leading-relaxed text-lg">
                     {item.description}
                   </p>

                   <div className="pt-6 rule-t mt-auto">
                     <span className="text-xs font-bold uppercase tracking-widest block mb-4">{t.glossary.benefitsTitle}</span>
                     <ul className="space-y-3">
                       {item.benefits.map((benefit, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                           <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                           {benefit}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               );
             })}
           </div>
        </section>
    </SiteShell>
  );
}
