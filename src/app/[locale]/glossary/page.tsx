import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Leaf, Droplets, Sparkles, ShieldCheck } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';

// We map icons here because we cannot store React components inside JSON/TS dictionaries safely or cleanly
const ICONS = {
  0: Droplets,
  1: Leaf,
  2: Sparkles,
  3: ShieldCheck,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GlossaryPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const t = await getDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="py-24 bg-primary text-white text-center px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
           <div className="container mx-auto max-w-4xl space-y-6 relative z-10">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-5 py-2 rounded-full mb-4">
               <Leaf className="h-4 w-4" />
               <span className="font-luxury text-[10px] uppercase tracking-widest">{t.glossary.badge}</span>
             </div>
             
             <h1 className="font-headline text-5xl md:text-7xl tracking-tighter uppercase text-glow">{t.glossary.title}<br /><span className="italic font-light text-secondary">{t.glossary.titleAccent}</span></h1>
             <p className="text-white/80 font-body text-lg italic leading-relaxed max-w-2xl mx-auto pt-4">
               {t.glossary.subtitle}
             </p>
           </div>
        </section>

        {/* Glossary Grid */}
        <section className="py-24 container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
             {t.glossary.items.map((item, index) => {
               const Icon = ICONS[index as keyof typeof ICONS] || Leaf;
               return (
                 <div key={index} className="flex flex-col gap-6 p-8 md:p-12 rounded-[3rem] border border-primary/10 bg-white dark:bg-black/20 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                   
                   <div className="flex items-start justify-between">
                     <div className="space-y-2">
                       <span className="text-[10px] font-headline uppercase tracking-[0.2em] text-primary/70 font-bold bg-primary/5 px-3 py-1 rounded-full">{t.glossary.sourcedFrom} {item.origin}</span>
                       <h2 className="font-headline text-3xl md:text-4xl">{item.name}</h2>
                     </div>
                     <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:scale-110 transition-transform">
                       <Icon className="h-6 w-6 text-primary" />
                     </div>
                   </div>

                   <p className="text-muted-foreground italic leading-relaxed text-lg">
                     {item.description}
                   </p>

                   <div className="pt-6 border-t border-primary/10 mt-auto">
                     <span className="text-xs font-bold uppercase tracking-widest block mb-4">{t.glossary.benefitsTitle}</span>
                     <ul className="space-y-3">
                       {item.benefits.map((benefit, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
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
      </main>

      <Footer />
    </div>
  );
}
