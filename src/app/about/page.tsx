import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Our Story | Lueur Skin',
  description: 'The narrative and botanical alchemy behind Lueur Skin by Alliyah.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24 overflow-x-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-12 mb-20 text-center">
            <h1 className="font-headline text-fluid-hero tracking-tighter leading-tight text-glow">
              Our <span className="italic font-light text-primary/80">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed italic opacity-90">
              "To harmonize the profound depth of nature with the exactness of science."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
              <Image 
                src="/products/sea-moss-facts.jpg"
                alt="Alliyah formulating skincare"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[10s]"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            
            <div className="space-y-8">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold">The Founder</Badge>
              <h2 className="font-headline text-4xl tracking-tight">Meet Alliyah</h2>
              <div className="space-y-6 text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                <p>
                  Lueur Skin began as a personal quest to heal compromised skin without resorting to harsh, barrier-stripping chemicals. Alliyah traveled globally, studying ancient botanical remedies and modern dermal science.
                </p>
                <p>
                  By isolating the pure actives within sea moss, burdock root, and rare botanicals, she developed formulas that didn't just mask imperfections, but fundamentally rebuilt the skin's functional health.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
             <div className="space-y-8 lg:order-1 order-2">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold">The Standard</Badge>
              <h2 className="font-headline text-4xl tracking-tight">Zero Compromise</h2>
              <div className="space-y-6 text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                <p>
                  Every Lueur Skin product is meticulously crafted in small batches. We source our Sea Moss directly from protected waters and utilize cold-press extraction to ensure the living enzymes remain intact.
                </p>
                <p>
                  Our commitment to purity means zero artificial fragrances, parabens, or synthetic dyes. Just the absolute pinnacle of natural efficacy.
                </p>
              </div>
            </div>

            <div className="relative aspect-square rounded-[4rem] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] lg:order-2 order-1">
              <Image 
                src="/products/glow-tea.jpg"
                alt="Ingredients macro shot"
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
