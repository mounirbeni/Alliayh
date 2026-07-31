"use client";

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useCookieStore } from '@/lib/store/useCookieStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

const DISMISS_KEY = 'lueur_promo_dismissed';

/**
 * The offer card.
 *
 * Redrawn as a ruled specimen plate rather than a glassy floating pill: solid
 * ground, hairline frame, the code set as an oversized numeral. It sits above
 * the mobile nav so it never covers the tab bar.
 */
export function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { dictionary: t, locale } = useLocaleStore();
  const { hasConsented, showBanner } = useCookieStore();
  const titleId = useId();

  /*
   * Two things used to slide up over the same corner at once. The consent
   * decision comes first — an offer stacked on top of it reads as a dark
   * pattern and, at 1440px, physically covered the "Reject non-essential"
   * control. The offer waits until the bar is gone.
   */
  const consentPending = !hasConsented && showBanner;

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setIsVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && !consentPending && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby={titleId}
          className="fixed bottom-[calc(var(--mobile-nav-height)+1rem)] right-4 z-[60] w-[calc(100vw-2rem)] max-w-[22rem] md:bottom-8 md:right-8"
        >
          <div className="relative border border-rule bg-background p-8 shadow-[0_24px_60px_-32px_hsl(343_71%_12%/0.45)]">
            <button
              type="button"
              onClick={handleClose}
              aria-label={t.promo.closePromo}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-foreground/40 transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="label text-primary">{t.promo.discount}</p>

            <h2 id={titleId} className="mt-4 font-display text-display-xs tracking-tightest">
              {t.promo.title}
            </h2>

            <p className="mt-3 max-w-[30ch] text-body-sm text-foreground/60">
              {t.promo.description} {t.promo.discount} {t.promo.descriptionSuffix}
            </p>

            <div className="mt-7 border-t border-rule pt-5">
              <div className="flex items-end justify-between gap-4">
                <span className="numeral text-display-xs leading-none tracking-tight text-primary">
                  {t.promo.code}
                </span>
                <Link
                  href={`/${locale}/products`}
                  onClick={handleClose}
                  className="link-underline label inline-flex items-center gap-2 pb-1 text-primary"
                >
                  {t.promo.shopCta}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
