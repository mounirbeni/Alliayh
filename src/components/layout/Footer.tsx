"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

/**
 * Footer — Premium footer with EU compliance links, newsletter signup, and full i18n.
 * Includes all required legal pages for GDPR / EU e-commerce compliance.
 */
export function Footer() {
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: t.footer.subscribed,
      description: t.footer.subscribedDesc,
    });
    setEmail('');
  };

  return (
    <footer className="bg-primary/5 border-t border-primary/10 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 pt-36 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12">
          {/* Brand Column */}
          <FadeIn direction="up" delay={0}>
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="font-headline text-3xl text-primary">Lueur Skin</span>
                <span className="font-body text-[10px] uppercase tracking-[0.4em] text-foreground/60 font-bold">By Alliyah</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-body font-medium uppercase tracking-wider">
                {t.footer.tagline}
              </p>
              <div className="flex gap-5 text-primary">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-60 transition-opacity hover:scale-110 transform duration-300">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-60 transition-opacity hover:scale-110 transform duration-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-60 transition-opacity hover:scale-110 transform duration-300">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Collection Column */}
          <FadeIn direction="up" delay={0.1}>
            <div className="space-y-6">
              <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t.footer.collection}</h4>
              <ul className="space-y-3 text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">
                <li><Link href={`/${locale}/products?category=Cleansers`} className="hover:text-primary transition-colors duration-300">{t.footer.cleansing}</Link></li>
                <li><Link href={`/${locale}/products?category=Serums`} className="hover:text-primary transition-colors duration-300">{t.footer.concentrates}</Link></li>
                <li><Link href={`/${locale}/products?category=Moisturizers`} className="hover:text-primary transition-colors duration-300">{t.footer.hydration}</Link></li>
                <li><Link href={`/${locale}/products?category=Masks`} className="hover:text-primary transition-colors duration-300">{t.footer.recovery}</Link></li>
              </ul>
            </div>
          </FadeIn>

          {/* Experience Column */}
          <FadeIn direction="up" delay={0.2}>
            <div className="space-y-6">
              <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t.footer.experience}</h4>
              <ul className="space-y-3 text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">
                <li><Link href={`/${locale}/advisor`} className="hover:text-primary transition-colors duration-300">{t.footer.consultation}</Link></li>
                <li><Link href={`/${locale}/about`} className="hover:text-primary transition-colors duration-300">{t.footer.narrative}</Link></li>
                <li><Link href={`/${locale}/journal`} className="hover:text-primary transition-colors duration-300">{t.footer.journal}</Link></li>
                <li><Link href={`/${locale}/glossary`} className="hover:text-primary transition-colors duration-300">{t.footer.glossary}</Link></li>
                <li><Link href={`/${locale}/contact`} className="hover:text-primary transition-colors duration-300">{t.footer.concierge}</Link></li>
                <li><Link href={`/${locale}/faq`} className="hover:text-primary transition-colors duration-300">{t.footer.ritualGuide}</Link></li>
              </ul>
            </div>
          </FadeIn>

          {/* Newsletter Column */}
          <FadeIn direction="up" delay={0.3}>
            <div className="space-y-6">
              <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t.footer.circleTitle}</h4>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{t.footer.circleDesc}</p>
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input 
                  type="email" 
                  placeholder={t.footer.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white dark:bg-black border border-primary/10 px-5 py-3.5 text-[10px] rounded-full focus:ring-1 focus:ring-primary outline-none font-body uppercase tracking-widest font-bold touch-manipulation pr-14"
                />
                <button 
                  type="submit" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 min-h-[36px] min-w-[36px] bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all duration-300 hover:scale-105 touch-manipulation"
                  aria-label={t.footer.subscribe}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </FadeIn>
        </div>

        {/* EU Legal Links Row */}
        <div className="mt-16 pt-8 border-t border-primary/10">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-body font-bold mb-8">
            <Link href={`/${locale}/legal/shipping`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.shipping}</Link>
            <Link href={`/${locale}/legal/terms`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.terms}</Link>
            <Link href={`/${locale}/legal/privacy`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.privacy}</Link>
            <Link href={`/${locale}/legal/cookies`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.cookies}</Link>
            <Link href={`/${locale}/legal/accessibility`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.accessibility}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-primary transition-colors duration-300">{t.footer.legal.contact}</Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] text-muted-foreground uppercase tracking-[0.4em] font-body font-bold">
            <p>{t.footer.copyright}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
              <span className="text-[7px] opacity-50">PT · EU</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}