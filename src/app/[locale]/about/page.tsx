import { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { getDictionary, type Locale } from '@/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getDictionary(resolvedParams.locale as Locale);
  
  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
  };
}

export default async function AboutPage({ params }: Props) {
  const resolvedParams = await params;
  const t = await getDictionary(resolvedParams.locale as Locale);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24 overflow-x-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-12 mb-20 text-center">
            <h1 className="font-headline text-fluid-hero tracking-tighter leading-tight text-glow">
              {t.about.headline} <span className="italic font-light text-primary/80">{t.about.headlineAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed italic opacity-90">
              {t.about.quote}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
              <Image 
                src="/products/sea-moss-facts.jpg"
                alt={t.about.founderImageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[10s]"
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

            <div className="relative aspect-square rounded-[4rem] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] lg:order-2 order-1">
              <Image 
                src="/products/glow-tea.jpg"
                alt={t.about.ingredientsImageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[10s]"
              />
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
