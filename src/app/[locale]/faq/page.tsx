import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const t = dictionary.faq;

  return (
    <section className="container mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.kicker}</p>
      <h1 className="mt-2 font-headline text-5xl">{t.title}</h1>
      <p className="mt-5 text-muted-foreground">{t.subtitle}</p>

      <Accordion type="single" collapsible className="mt-10 space-y-2">
        {t.items.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="rounded-2xl border border-primary/10 bg-white/70 px-5"
          >
            <AccordionTrigger className="py-4 text-left font-medium hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
