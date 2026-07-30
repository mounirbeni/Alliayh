import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SiteShell } from '@/components/layout/SiteShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/faq',
    title: t.faq.title,
    description: t.faq.subtitle,
  });
}

export default async function FAQPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getDictionary(locale);
  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.faq.title, path: `/${locale}/faq` },
  ];

  return (
    <SiteShell mainClassName="py-12 lg:py-32">
      {/* FAQPage structured data makes these answers eligible for rich results. */}
      <JsonLd data={[faqJsonLd([...t.faq.items]), breadcrumbJsonLd(crumbs)]} />

      <div className="container mx-auto px-4 max-w-3xl">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />

        <div className="text-center my-16 space-y-4">
          <h1 className="font-headline text-5xl tracking-tight">{t.faq.title}</h1>
          <p className="text-muted-foreground font-body italic text-lg">{t.faq.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-black/20 p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-lg">
          <Accordion type="single" collapsible className="w-full">
            {t.faq.items.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-b border-primary/10 last:border-0 py-2"
              >
                <AccordionTrigger className="font-headline text-lg hover:text-primary hover:no-underline text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SiteShell>
  );
}
