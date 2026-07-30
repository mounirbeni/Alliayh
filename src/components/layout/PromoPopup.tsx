"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

export function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { dictionary: t, locale } = useLocaleStore();

  useEffect(() => {
    // Check if user already dismissed it in this session
    const isDismissed = sessionStorage.getItem('lueur_promo_dismissed');
    
    if (!isDismissed) {
      // Show popup after 3.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('lueur_promo_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          role="complementary"
          aria-label={t.promo.title}
          className="fixed bottom-[88px] md:bottom-8 right-4 md:right-8 z-[60] w-[calc(100vw-2rem)] md:w-96 max-w-sm"
        >
          <div className="relative glass bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-primary/10 p-6 rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Luminous glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/50 dark:bg-black/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors z-10"
              onClick={handleClose}
              aria-label={t.common.close}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2 w-full pr-4">
                <h3 className="font-headline text-lg text-primary leading-tight">
                  {t.promo.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">
                  {t.promo.description} <strong className="text-primary">{t.promo.discount}</strong> {t.promo.descriptionSuffix}
                </p>
                <div className="mt-2 flex items-center justify-between bg-primary/5 rounded-full pl-4 pr-1 py-1 border border-primary/10">
                  <span className="font-body text-xs font-black tracking-widest text-primary uppercase">
                    {t.promo.code}
                  </span>
                  <Link href={`/${locale}/products`} onClick={handleClose}>
                    <Button size="sm" className="h-8 rounded-full px-4 text-[10px] font-bold uppercase tracking-wider gap-1">
                      {t.promo.shopCta} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
