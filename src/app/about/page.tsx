
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Heart, Leaf, Sun, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const brandImage = PlaceHolderImages.find(img => img.id === 'brand-story');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Story Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-primary/5">
          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <Badge variant="outline" className="border-primary text-primary font-headline uppercase tracking-widest px-6 py-1">Since 2021</Badge>
            <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight max-w-4xl mx-auto">
              Redefining <span className="italic">Luminosity</span> Through Conscious Luxury
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic leading-relaxed">
              Lueur Skin by Alliyah was founded on a simple belief: your skin is your aura. It reflects your health, your emotions, and your inner light.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src={brandImage?.imageUrl || "https://picsum.photos/seed/brand/800/1000"}
                alt="Brand philosophy"
                fill
                className="object-cover"
                data-ai-hint="natural beauty botanicals"
              />
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-headline text-4xl leading-tight">A Modern Alchemy</h2>
                <p className="text-muted-foreground text-lg leading-relaxed font-body">
                  Our journey began in a small atelier, where our founders—a molecular biologist and a master herbalist—sought to merge their worlds. They believed that clinical results shouldn't come at the cost of the sensory experience.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed font-body">
                  Today, Lueur Skin by Alliyah represents that harmony. We take high-performance actives like stabilized Vitamin C and peptides, and suspend them in nutrient-dense botanical oils. The result is skincare that performs like medicine but feels like a vacation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-secondary/30 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-headline uppercase tracking-widest text-sm">Vegan & Pure</h4>
                  <p className="text-sm text-muted-foreground italic font-body">100% plant-derived formulas without compromise on performance.</p>
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-secondary/30 rounded-full flex items-center justify-center">
                    <Sun className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-headline uppercase tracking-widest text-sm">Ethical Glow</h4>
                  <p className="text-sm text-muted-foreground italic font-body">Carbon-neutral shipping and fully recyclable artisanal packaging.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline/Mission */}
        <section className="py-24 bg-white/50 border-y border-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-16">
              <h2 className="font-headline text-4xl uppercase tracking-widest">Our Guiding Light</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4 p-8 bg-white rounded-[2rem] shadow-sm">
                  <Award className="h-10 w-10 text-primary mx-auto" />
                  <h3 className="font-headline text-xl">Quality Above All</h3>
                  <p className="text-sm text-muted-foreground italic font-body">Small batch production ensures that every bottle meets our stringent standards for potency and purity.</p>
                </div>
                <div className="space-y-4 p-8 bg-white rounded-[2rem] shadow-sm">
                  <Heart className="h-10 w-10 text-primary mx-auto" />
                  <h3 className="font-headline text-xl">Self-Care Ritual</h3>
                  <p className="text-sm text-muted-foreground italic font-body">We view skincare as a meditative practice—a few minutes each day dedicated solely to your well-being.</p>
                </div>
                <div className="space-y-4 p-8 bg-white rounded-[2rem] shadow-sm">
                  <Sparkles className="h-10 w-10 text-primary mx-auto" />
                  <h3 className="font-headline text-xl">Radical Clarity</h3>
                  <p className="text-sm text-muted-foreground italic font-body">Complete ingredient transparency. No secrets, no fillers, just honest results for your skin.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] border border-primary/20 text-center space-y-8 shadow-sm">
            <h2 className="font-headline text-4xl">Connect With Alliyah</h2>
            <p className="text-muted-foreground italic font-body">Whether you have questions about your routine or want to discuss the science behind our ingredients, we're here for you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 font-headline">
              <div className="space-y-2">
                <h4 className="uppercase tracking-widest text-[10px] font-bold text-primary">General Inquiry</h4>
                <p className="text-sm">hello@lueuraura.com</p>
              </div>
              <div className="space-y-2">
                <h4 className="uppercase tracking-widest text-[10px] font-bold text-primary">Concierge Support</h4>
                <p className="text-sm">+1 (888) 555-GLOW</p>
              </div>
              <div className="space-y-2">
                <h4 className="uppercase tracking-widest text-[10px] font-bold text-primary">Press & Media</h4>
                <p className="text-sm">press@lueuraura.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
