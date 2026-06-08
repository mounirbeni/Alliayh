"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS } from '@/app/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Crown, Droplets, Zap, Star } from 'lucide-react';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

// Reusable animated section wrapper
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { dictionary: t, locale } = useLocaleStore();
  const featuredProducts = PRODUCTS.slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 overflow-x-hidden w-full">
        {/* === HERO SECTION === */}
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
          <div className="w-full px-4 py-6 relative z-10" style={{ maxWidth: '100vw' }}>
            <motion.div 
              style={{ y: heroY, opacity: heroOpacity, minHeight: 'clamp(600px, 85vh, 1000px)' }}
              className="relative w-full rounded-[3rem] sm:rounded-[5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(120,20,48,0.2)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              
              <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src="/products/glow-tea.jpg"
                  alt={t.hero.heroImageAlt}
                  fill
                  className="object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-[15s] ease-out"
                  priority
                />
              </motion.div>
              
              {/* Dynamic Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-primary/60" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-black/30 mix-blend-overlay" />
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
              
              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-8">
                <div className="w-full max-w-4xl flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md px-6 py-2 uppercase tracking-[0.4em] font-body text-[10px] font-bold rounded-full mb-8 shadow-2xl">
                      {t.hero.badge}
                    </Badge>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                    className="font-headline text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter text-glow drop-shadow-2xl"
                  >
                    {t.hero.headline1} <br />
                    <span className="italic font-light text-secondary mix-blend-luminosity">{t.hero.headline2}</span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-xs sm:text-sm md:text-base font-body max-w-lg mx-auto opacity-90 leading-relaxed font-bold uppercase tracking-[0.3em] break-words mt-8 drop-shadow-md"
                  >
                    {t.hero.subtitle}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-10 w-full"
                  >
                    <Link href={`/${locale}/products`} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2 bg-white text-primary hover:text-white hover:scale-105 transition-all duration-500 text-[11px] uppercase tracking-[0.35em] px-10 rounded-full h-14 min-h-[44px] font-black shadow-2xl shadow-white/10 whitespace-normal border-0"
                      >
                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></span>
                        <span className="relative z-10 flex items-center gap-2">{t.hero.ctaShop}</span>
                      </Button>
                    </Link>
                    <Link href={`/${locale}/advisor`} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 glass bg-white/5 border-white/20 text-white hover:bg-white/20 text-[11px] uppercase tracking-[0.35em] px-10 rounded-full h-14 min-h-[44px] font-bold whitespace-normal transition-all duration-500"
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                        {t.hero.ctaStory}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Scroll hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/70 animate-bounce hidden sm:flex"
              >
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold">{t.hero.scroll}</span>
                <div className="h-12 w-[1px] bg-gradient-to-b from-white/70 to-transparent" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* === VALUE PROPOSITION BANNER === */}
        <section className="py-12 border-y border-primary/10 bg-primary/[0.02] overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: Leaf, label: t.values.crueltyFree },
                { icon: ShieldCheck, label: t.values.labTested },
                { icon: Droplets, label: t.values.freeShipping },
                { icon: Zap, label: t.values.authentic },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left py-4 min-w-0 rounded-3xl hover:bg-primary/5 transition-colors duration-500 cursor-default">
                    <div className="h-12 w-12 min-w-[48px] rounded-full bg-background border border-primary/10 shadow-lg shadow-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                      <item.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-body font-bold uppercase tracking-[0.15em] text-foreground/80 break-words leading-snug">
                      {item.label}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* === BRAND PHILOSOPHY === */}
        <section className="py-24 md:py-40 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="space-y-12 min-w-0">
                <FadeIn className="space-y-6">
                  <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2.5 rounded-full uppercase tracking-[0.4em] text-[10px] font-bold shadow-sm">
                    {t.philosophy.badge}
                  </Badge>
                  <h2 className="font-headline text-[3.5rem] md:text-[5rem] tracking-tighter leading-[0.9] break-words">
                    {t.philosophy.headline1} <br /><span className="italic font-light text-primary/50">{t.philosophy.headline2}</span>
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-body font-medium italic max-w-xl break-words border-l-2 border-primary/20 pl-6">
                    {t.philosophy.quote}
                  </p>
                </FadeIn>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { icon: Leaf, title: t.philosophy.botanical, desc: t.philosophy.botanicalDesc },
                    { icon: ShieldCheck, title: t.philosophy.clinical, desc: t.philosophy.clinicalDesc },
                    { icon: Zap, title: t.philosophy.luminous, desc: t.philosophy.luminousDesc },
                    { icon: Droplets, title: t.philosophy.barrier, desc: t.philosophy.barrierDesc }
                  ].map((item, i) => (
                    <FadeIn key={i} delay={0.2 + i * 0.1} className="flex gap-5 items-start min-w-0 group cursor-default">
                      <div className="h-14 w-14 min-w-[56px] bg-white dark:bg-white/5 border border-primary/10 shadow-xl shadow-primary/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-500">
                        <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-500" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-headline text-lg group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed italic break-words">{item.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Image — Premium reveal effect */}
              <FadeIn delay={0.3} className="relative w-full h-full min-h-[500px]">
                <div className="relative aspect-[4/5] w-full rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(120,20,48,0.3)] group">
                  <Image
                    src="/products/sea-moss-gummies.jpg"
                    alt={t.philosophy.philosophyImageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-[10s] ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                  
                  {/* Floating Elements on Image */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute bottom-10 left-10 glass p-5 rounded-3xl max-w-[200px]"
                  >
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />)}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-white font-bold leading-relaxed">
                      {t.philosophy.testimonialQuote}
                    </p>
                  </motion.div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* === FEATURED PRODUCTS GRID === */}
        <section className="py-24 md:py-40 bg-gradient-to-b from-primary/[0.02] to-background border-y border-primary/10 relative">
          <div className="container mx-auto px-4">
            <FadeIn className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6 min-w-0">
              <div className="space-y-4 min-w-0 max-w-2xl">
                <div className="inline-flex items-center gap-3 border border-primary/20 px-4 py-1.5 rounded-full bg-white dark:bg-black/20">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary">{t.bestSellers.badge}</span>
                </div>
                <h2 className="font-headline text-[3rem] md:text-[4.5rem] tracking-tighter leading-none break-words">
                  {t.bestSellers.headline1} <span className="italic font-light text-primary/60">{t.bestSellers.headline2}</span>
                </h2>
                <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.3em] font-bold leading-relaxed opacity-60 break-words">
                  {t.bestSellers.subtitle}
                </p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="group flex items-center gap-4 text-[11px] font-body font-bold uppercase tracking-[0.4em] hover:text-primary transition-all shrink-0 bg-white dark:bg-white/5 border border-primary/10 pl-6 pr-2 py-2 rounded-full shadow-lg"
              >
                {t.bestSellers.viewAll}
                <div className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white transition-all duration-500">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </FadeIn>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.15} className="min-w-0">
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section className="py-24 md:py-40 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <FadeIn className="text-center mb-20 space-y-4">
              <span className="text-primary font-luxury text-sm md:text-lg">{t.testimonials.badge}</span>
              <h2 className="font-headline text-[3rem] md:text-[4.5rem] tracking-tighter break-words leading-none">
                {t.testimonials.headline1} <span className="italic font-light text-primary/60">{t.testimonials.headline2}</span>
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.testimonials.reviews.map((review, i) => (
                <FadeIn key={i} delay={i * 0.2}>
                  <div className="group h-full bg-white dark:bg-black/20 border border-primary/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col gap-6 min-w-0 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="h-4 w-4 fill-primary text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${s * 50}ms` }} />
                      ))}
                    </div>
                    <p className="text-base text-foreground/80 italic leading-loose font-body break-words flex-1">"{review.text}"</p>
                    <div className="flex items-center gap-4 min-w-0 pt-4 border-t border-primary/10">
                      <div className="h-12 w-12 min-w-[48px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        {review.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-headline text-base truncate group-hover:text-primary transition-colors">{review.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold truncate mt-0.5">{review.location}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* === AI ADVISOR CTA === */}
        <section className="py-24 md:py-32 container mx-auto px-4 mb-20">
          <FadeIn className="relative overflow-hidden rounded-[3rem] sm:rounded-[5rem] bg-primary text-white shadow-[0_40px_100px_-20px_rgba(120,20,48,0.4)]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[200%] bg-secondary/30 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite] opacity-50" />
              <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-30" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-20 items-center">
              <div className="space-y-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full shadow-2xl">
                  <Crown className="h-4 w-4 text-secondary shrink-0" />
                  <span className="font-body text-white uppercase tracking-[0.4em] font-bold text-[10px]">{t.advisorCta.badge}</span>
                </div>
                
                <h2 className="font-headline text-[3.5rem] md:text-[5rem] tracking-tighter leading-[0.9] text-glow break-words drop-shadow-2xl">
                  {t.advisorCta.headline1}<br />
                  <span className="italic font-light text-secondary mix-blend-luminosity">{t.advisorCta.headline2}</span>
                </h2>
                <p className="text-white/80 leading-relaxed font-body text-lg max-w-md mx-auto lg:mx-0 break-words drop-shadow-md">
                  {t.advisorCta.description}
                </p>

                <div className="pt-4">
                  <Link href={`/${locale}/advisor`} className="inline-block w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden w-full sm:w-auto flex items-center justify-center bg-white text-primary hover:text-white transition-all duration-500 rounded-full h-16 min-h-[44px] px-12 uppercase tracking-[0.4em] text-[11px] font-black shadow-2xl border-0"
                    >
                      <span className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></span>
                      <span className="relative z-10 flex items-center gap-3">
                        {t.advisorCta.cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] group shadow-2xl">
                <Image
                  src="/products/sea-moss-facts.jpg"
                  alt={t.advisorCta.advisorImageAlt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-[10s] ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12">
                  <div className="flex items-center gap-4 text-white">
                    <div className="relative flex items-center justify-center">
                      <div className="h-3 w-3 bg-secondary rounded-full absolute animate-ping opacity-75" />
                      <div className="h-2 w-2 bg-secondary rounded-full relative" />
                    </div>
                    <span className="font-body uppercase tracking-[0.3em] font-bold text-[10px]">{t.advisorCta.analyzingLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
