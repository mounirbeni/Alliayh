import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary, type Locale } from '@/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQPage({ params }: Props) {
  const resolvedParams = await params;
  const t = await getDictionary(resolvedParams.locale as Locale);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16 space-y-4">
            <h1 className="font-headline text-5xl tracking-tight">{t.faq.title}</h1>
            <p className="text-muted-foreground font-body italic text-lg">{t.faq.subtitle}</p>
          </div>

          <div className="bg-white dark:bg-black/20 p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {t.faq.items.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary/10 last:border-0 py-2">
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
      </main>

      <Footer />
    </div>
  );
}
