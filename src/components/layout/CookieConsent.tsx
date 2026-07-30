"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieStore } from '@/lib/store/useCookieStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * CookieConsent — GDPR-compliant cookie consent banner.
 * Blocks non-essential trackers (analytics, marketing) until explicitly accepted.
 * Features a customizable preferences panel with toggles per category.
 */
export function CookieConsent() {
  const { hasConsented, showBanner, acceptAll, rejectNonEssential, savePreferences, preferences } = useCookieStore();
  const { dictionary: t } = useLocaleStore();
  const [showCustomize, setShowCustomize] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted || hasConsented || !showBanner) return null;

  const togglePref = (key: 'analytics' | 'marketing') => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 1 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white/95 dark:bg-black/90 backdrop-blur-2xl border border-primary/10 rounded-3xl shadow-[0_-20px_60px_-10px_rgba(120,20,48,0.1)] p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-base md:text-lg mb-1">{t.cookies.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-body leading-relaxed">
                  {t.cookies.description}
                </p>
              </div>
            </div>

            {/* Customize Panel */}
            <AnimatePresence>
              {showCustomize && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 pt-5 border-t border-primary/10 space-y-3">
                    {/* Necessary — always enabled */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
                      <div>
                        <p className="text-sm font-body font-bold">{t.cookies.necessary}</p>
                        <p className="text-[11px] text-muted-foreground font-body">{t.cookies.necessaryDesc}</p>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-primary flex items-center justify-end pr-0.5 cursor-not-allowed opacity-70">
                        <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <button
                      onClick={() => togglePref('analytics')}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 w-full text-left hover:bg-muted/70 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-body font-bold">{t.cookies.analytics}</p>
                        <p className="text-[11px] text-muted-foreground font-body">{t.cookies.analyticsDesc}</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full flex items-center transition-colors duration-300 ${localPrefs.analytics ? 'bg-primary justify-end pr-0.5' : 'bg-muted-foreground/20 justify-start pl-0.5'}`}>
                        <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm" />
                      </div>
                    </button>

                    {/* Marketing */}
                    <button
                      onClick={() => togglePref('marketing')}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 w-full text-left hover:bg-muted/70 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-body font-bold">{t.cookies.marketing}</p>
                        <p className="text-[11px] text-muted-foreground font-body">{t.cookies.marketingDesc}</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full flex items-center transition-colors duration-300 ${localPrefs.marketing ? 'bg-primary justify-end pr-0.5' : 'bg-muted-foreground/20 justify-start pl-0.5'}`}>
                        <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm" />
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <Button
                onClick={acceptAll}
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-[10px] font-bold h-11 min-h-[44px] shadow-md"
              >
                {t.cookies.acceptAll}
              </Button>
              <Button
                onClick={rejectNonEssential}
                variant="outline"
                className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 uppercase tracking-[0.15em] text-[10px] font-bold h-11 min-h-[44px]"
              >
                {t.cookies.rejectAll}
              </Button>
              {showCustomize ? (
                <Button
                  onClick={() => { savePreferences(localPrefs); setShowCustomize(false); }}
                  variant="outline"
                  className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 uppercase tracking-[0.15em] text-[10px] font-bold h-11 min-h-[44px] gap-1"
                >
                  {t.cookies.savePreferences}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowCustomize(true)}
                  variant="ghost"
                  className="flex-1 rounded-full hover:bg-primary/5 uppercase tracking-[0.15em] text-[10px] font-bold h-11 min-h-[44px] gap-1 text-muted-foreground"
                >
                  {t.cookies.customize}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
