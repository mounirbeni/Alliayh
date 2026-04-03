import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS } from '@/app/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Crown, Droplets, Zap } from 'lucide-react';

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 overflow-x-hidden w-full">
        {/* === HERO SECTION === */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Hero uses padding to avoid the fixed NavBar overlapping content */}
          <div className="w-full px-4 py-6" style={{ maxWidth: '100vw' }}>
            <div className="relative w-full rounded-[3rem] sm:rounded-[5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]"
                 style={{ minHeight: 'clamp(500px, 80vh, 900px)' }}>
              <Image
                src="/products/glow-tea.jpg"
                alt="Lueur Skin Radiant Aura"
                fill
                className="object-cover brightness-[0.72] scale-105 group-hover:scale-100 transition-transform duration-[20s] ease-out"
                priority
              />
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-primary/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
              
              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-8">
                <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-xl px-6 py-2 uppercase tracking-[0.4em] font-body text-[10px] font-bold rounded-full">
                    Lueur Skin by Alliyah
                  </Badge>
                  
                  <h1 className="font-headline text-fluid-hero leading-[0.85] tracking-tighter text-glow">
                    Glow From <br />
                    <span className="italic font-light text-secondary">Within</span>
                  </h1>

                  <p className="text-sm sm:text-lg font-body max-w-lg mx-auto opacity-90 leading-relaxed font-medium uppercase tracking-[0.2em] break-words">
                    Sea Moss · Glow Tea · Botanical Wellness
                  </p>

                  {/* CTA Buttons — w-full on mobile, auto on sm+ to prevent overflow */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 w-full">
                    <Link href="/products" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary hover:bg-secondary hover:scale-105 transition-all text-[11px] uppercase tracking-[0.35em] px-8 rounded-full h-14 min-h-[44px] font-bold shadow-2xl shadow-black/30 whitespace-normal"
                      >
                        Shop the Collection
                      </Button>
                    </Link>
                    <Link href="/about" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-2xl border-white/25 text-white hover:bg-white/20 text-[11px] uppercase tracking-[0.35em] px-8 rounded-full h-14 min-h-[44px] font-bold whitespace-normal"
                      >
                        <Sparkles className="h-4 w-4 shrink-0" />
                        Our Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Scroll hint */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/50 animate-bounce hidden sm:flex">
                <span className="text-[10px] font-luxury">Scroll</span>
                <div className="h-10 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* === VALUE PROPOSITION BANNER === */}
        <section className="py-8 border-y border-primary/10 bg-primary/[0.02] overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Leaf, label: "100% Cruelty-Free" },
                { icon: ShieldCheck, label: "Lab Tested" },
                { icon: Droplets, label: "Free Shipping 500Dhs+" },
                { icon: Zap, label: "100% Authentic" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left py-3 min-w-0">
                  <div className="h-10 w-10 min-w-[40px] rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-body font-bold uppercase tracking-[0.15em] text-foreground/70 break-words leading-snug">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === BRAND PHILOSOPHY === */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="space-y-8 min-w-0">
                <div className="space-y-5">
                  <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 rounded-full uppercase tracking-[0.4em] text-[10px] font-bold">Our Philosophy</Badge>
                  <h2 className="font-headline text-fluid-h1 tracking-tighter leading-tight break-words">
                    Alchemy of <br /><span className="italic font-light text-primary/60">Light</span>
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-body font-medium italic max-w-xl break-words">
                    "We do not merely treat the skin; we restore the radiant resonance of your natural aura."
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Leaf, title: "Botanical Pure", desc: "Rare earth actives sourced from zero-impact estates." },
                    { icon: ShieldCheck, title: "Clinical Grade", desc: "Molecularly optimized for deep cellular permeability." },
                    { icon: Zap, title: "Luminous Tech", desc: "Proprietary bio-actives that amplify natural reflectance." },
                    { icon: Droplets, title: "Barrier Guard", desc: "Stabilizing the acid mantle with refined lipid complexes." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start min-w-0">
                      <div className="h-12 w-12 min-w-[48px] glass-card rounded-[1.5rem] flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-headline text-base truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed italic break-words">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image — strict aspect-ratio container */}
              <div className="relative aspect-[3/4] w-full rounded-[3rem] sm:rounded-[4rem] overflow-hidden aura-glow">
                <Image
                  src="/products/sea-moss-gummies.jpg"
                  alt="Sea Moss Gummies"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              </div>
            </div>
          </div>
        </section>

        {/* === FEATURED PRODUCTS GRID === */}
        <section className="py-20 md:py-32 bg-primary/[0.03] border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6 min-w-0">
              <div className="space-y-3 min-w-0 max-w-2xl">
                <span className="text-primary font-luxury">Seasonal Edit</span>
                <h2 className="font-headline text-fluid-h1 tracking-tighter break-words">
                  Best <span className="italic font-light">Sellers</span>
                </h2>
                <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.3em] font-bold leading-relaxed opacity-60 break-words">
                  Our most-loved wellness rituals.
                </p>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-3 text-[11px] font-body font-bold uppercase tracking-[0.4em] hover:text-primary transition-all shrink-0"
              >
                View All
                <div className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>

            {/* Products grid — min-w-0 on grid cells prevents overflow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-3">
              <span className="text-primary font-luxury">Glow Reviews</span>
              <h2 className="font-headline text-fluid-h2 tracking-tighter break-words">
                Real <span className="italic font-light">Results</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Amira K.", location: "Dubai", text: "The Sea Moss Gummies completely transformed my skin in 3 weeks. I get compliments everywhere I go now!", rating: 5 },
                { name: "Sofia M.", location: "Casablanca", text: "The Glow Tea is part of my morning ritual now. My complexion is visibly brighter and more even.", rating: 5 },
                { name: "Nadia R.", location: "Paris", text: "Finally, a wellness brand that actually delivers on its promises. Lueur Skin has a customer for life.", rating: 5 },
              ].map((review, i) => (
                <div key={i} className="bg-white dark:bg-black/20 border border-primary/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col gap-4 min-w-0">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="h-4 w-4 fill-primary text-primary shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed font-body break-words flex-1">"{review.text}"</p>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 min-w-[36px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-sm shrink-0">
                      {review.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline text-sm truncate">{review.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === AI ADVISOR CTA === */}
        <section className="py-12 md:py-20 container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[3rem] sm:rounded-[4rem] bg-primary text-white aura-glow">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[200%] bg-secondary/20 rounded-full blur-[120px] animate-pulse opacity-40" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 px-5 py-2 rounded-full">
                  <Crown className="h-4 w-4 text-secondary shrink-0" />
                  <span className="font-luxury text-white text-[10px]">Personalized Advisor</span>
                </div>
                
                <h2 className="font-headline text-fluid-h1 tracking-tighter leading-[0.9] text-glow break-words">
                  Your Skin,<br />
                  <span className="italic font-light text-secondary">Your Ritual</span>
                </h2>
                <p className="text-white/75 leading-relaxed font-body text-base font-light max-w-md mx-auto lg:mx-0 break-words">
                  Our skin advisor matches you with the perfect Lueur products for your unique needs.
                </p>

                <Link href="/advisor" className="inline-block w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center bg-white text-primary hover:bg-secondary hover:scale-105 transition-all rounded-full h-14 min-h-[44px] px-10 uppercase tracking-[0.4em] text-[11px] font-bold shadow-xl"
                  >
                    Begin Consultation
                  </Button>
                </Link>
              </div>

              {/* Image — strict aspect-ratio wrapper prevents any skew */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] sm:rounded-[3rem]">
                <Image
                  src="/products/sea-moss-facts.jpg"
                  alt="Lueur Skin product detail"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <div className="flex items-center gap-3 text-secondary">
                    <div className="h-3 w-3 bg-secondary rounded-full animate-ping shrink-0" />
                    <span className="font-luxury text-[10px]">Crafted for Your Aura</span>
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
