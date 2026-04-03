import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Do you ship internationally?",
    answer: "Yes, Lueur Skin ships globally. International shipping times vary between 7-14 business days, depending on customs processing in your specific country."
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Absolutely. We are leaping-bunny certified and strictly refuse to test on animals at any stage of our formulation or production process."
  },
  {
    question: "How long does a bottle typically last?",
    answer: "When following the recommended ritual dosaging (1-2 pumps for serums/cleansers, a dime-size for creams), a single full-size product is designed to last 60 to 90 days."
  },
  {
    question: "Is Sea Moss safe for sensitive skin?",
    answer: "Yes. Our wildcrafted Sea Moss formulas are intensely hydrating and naturally anti-inflammatory, making them exceptional for soothing sensitive or compromised skin barriers."
  },
  {
    question: "Can I use the Celestrial Mask every night?",
    answer: "We recommend using the overnight mask 2-3 times per week to allow your skin to naturally respire on the off-nights, maintaining optimal cellular turnover."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16 space-y-4">
            <h1 className="font-headline text-5xl tracking-tight">Ritual Guide</h1>
            <p className="text-muted-foreground font-body italic text-lg">Common inquiries regarding our alchemy and shipments.</p>
          </div>

          <div className="bg-white dark:bg-black/20 p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
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
