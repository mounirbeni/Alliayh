import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Crown, Droplets, Zap } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-skin');
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 overflow-x-hidden w-full">
        {/* Cinematic Hero Section */}
        <section className="relative h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">
          <div className="container mx-auto px-4 h-[90%] py-8">
            <div className="relative h-full w-full rounded-[5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/skin-aura/1600/1000"}
                alt="Lueur Skin Radiant Aura"
                fill
                className="object-cover brightness-[0.75] scale-105 group-hover:scale-100 transition-transform duration-[20s] ease-out"
                priority
                data-ai-hint="luxury skincare glow"
              />
              
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-primary/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-xl px-10 py-3 uppercase tracking-[0.6em] font-body text-[10px] font-bold rounded-full animate-pulse">
                    The Aura Collection v3.0
                  </Badge>
                  
                  <div className="space-y-4">
                    <h1 className="font-headline text-fluid-hero leading-[0.8] tracking-tighter text-glow">
                      Ethereal <br />
                      <span className="italic font-light text-secondary">Glow</span>
                    </h1>
                  </div>

                  <p className="text-sm md:text-2xl font-body max-w-3xl mx-auto opacity-90 leading-relaxed font-medium uppercase tracking-[0.3em]">
                    Clinical precision meets <br className="hidden md:block" /> botanical alchemy.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
                    <Link href="/products">
                      <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:scale-105 transition-all text-[12px] uppercase tracking-[0.5em] px-20 rounded-full h-24 font-bold shadow-3xl shadow-black/40">
                        Enter The Ritual
                      </Button>
                    </Link>
                    <Link href="/advisor">
                      <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-2xl border-white/20 text-white hover:bg-white/20 text-[12px] uppercase tracking-[0.5em] px-20 rounded-full h-24 flex gap-4 font-bold">
                        <Sparkles className="h-6 w-6" /> Calibrate Aura
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative Scroll Hint */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60 animate-bounce">
                <span className="text-[10px] font-luxury">Descend</span>
                <div className="h-12 w-[1px] bg-gradient-to-b from-white/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Philosophy - The Four Pillars */}
        <section className="py-60 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-16">
                <div className="space-y-8">
                  <Badge className="bg-primary/5 text-primary border-primary/20 px-8 py-3 rounded-full uppercase tracking-[0.5em] text-[10px] font-bold">Our Philosophy</Badge>
                  <h2 className="font-headline text-fluid-h1 tracking-tighter leading-tight">Alchemy of <br /><span className="italic font-light text-primary/60">Light</span></h2>
                  <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed font-body font-medium italic max-w-xl">
                    "We do not merely treat the skin; we restore the radiant resonance of your natural aura."
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  {[
                    { icon: Leaf, title: "Botanical Pure", desc: "Rare earth actives sourced from zero-impact estates." },
                    { icon: ShieldCheck, title: "Clinical Grade", desc: "Molecularly optimized for deep cellular permeability." },
                    { icon: Zap, title: "Luminous Tech", desc: "Proprietary bio-actives that amplify natural reflectance." },
                    { icon: Droplets, title: "Barrier Guard", desc: "Stabilizing the acid mantle with refined lipid complexes." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-6 group">
                      <div className="h-20 w-20 glass-card rounded-[2rem] flex items-center justify-center group-hover:bg-primary transition-all duration-700">
                        <item.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="font-headline text-2xl">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-[5rem] overflow-hidden aura-glow group">
                <Image
                  src="https://picsum.photos/seed/philosophy/900/1200"
                  alt="Ritual detail"
                  fill
                  className="object-cover transition-transform duration-[15s] group-hover:scale-110"
                  data-ai-hint="luxury beauty detail"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                <div className="absolute inset-0 glass opacity-0 group-hover:opacity-10 transition-opacity" />
              </div>
            </div>
          </div>
        </section>

        {/* Curated Rituals - Boutique Grid */}
        <section className="py-60 bg-primary/[0.03] border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
              <div className="space-y-8 max-w-3xl">
                <span className="text-primary font-luxury">Seasonal Edit</span>
                <h2 className="font-headline text-fluid-h1 tracking-tighter">Essential <br /><span className="italic font-light">Layers</span></h2>
                <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.4em] font-bold leading-relaxed opacity-60">
                  Curated sequences for deep hydration and cellular renewal.
                </p>
              </div>
              <Link href="/products" className="group flex items-center gap-8 text-[12px] font-body font-bold uppercase tracking-[0.5em] hover:text-primary transition-all">
                The Full Archive 
                <div className="h-20 w-20 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-700">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Premium AI Advisor CTA - The Lab */}
        <section className="py-60 container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[6rem] bg-primary text-white shadow-3xl aura-glow">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[200%] bg-secondary/30 rounded-full blur-[180px] animate-pulse opacity-40" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-secondary/10 rounded-full blur-[140px]" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-32 p-16 md:p-40 items-center">
              <div className="space-y-16 text-center lg:text-left">
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-2xl border-white/20 px-8 py-3 rounded-full">
                  <Crown className="h-4 w-4 text-secondary" />
                  <span className="font-luxury text-white">Neural Calibration Engine</span>
                </div>
                
                <div className="space-y-6">
                  <h2 className="font-headline text-fluid-h1 tracking-tighter leading-[0.85] text-glow">
                    Digital <br />
                    <span className="italic font-light text-secondary">Concierge</span>
                  </h2>
                  <p className="text-white/80 leading-relaxed font-body text-2xl font-light max-w-xl mx-auto lg:mx-0">
                    Our proprietary AI engine evaluates your unique typology to architect your optimal ritual sequence.
                  </p>
                </div>

                <Link href="/advisor" className="inline-block pt-8">
                  <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:scale-110 transition-all rounded-full h-24 px-24 uppercase tracking-[0.6em] text-[12px] font-bold shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    Begin Calibration
                  </Button>
                </Link>
              </div>

              <div className="relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden rounded-[5rem] shadow-4xl group animate-float">
                <Image
                  src="https://picsum.photos/seed/ai-lab/1000/1250"
                  alt="AI advisor analysis"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[8s]"
                  data-ai-hint="beauty tech luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex flex-col justify-end p-16">
                   <div className="flex items-center gap-6 text-secondary">
                     <div className="h-4 w-4 bg-secondary rounded-full animate-ping" />
                     <span className="font-luxury text-xs">Architecting Glow...</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
