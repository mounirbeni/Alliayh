"use client";

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCookieStore } from '@/lib/store/useCookieStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * Consent bar.
 *
 * Non-essential trackers stay blocked until the visitor says otherwise. It is
 * deliberately *not* a modal: it never traps focus and never blocks the page,
 * so it is announced as a labelled region rather than a dialog.
 *
 * Visually it belongs to the same system as everything else — a full-bleed bar
 * ruled off from the page, sharp corners, label type — instead of the floating
 * rounded card it used to be.
 */
export function CookieConsent() {
  const { hasConsented, showBanner, acceptAll, rejectNonEssential, savePreferences, preferences } =
    useCookieStore();
  const { dictionary: t } = useLocaleStore();
  const [showCustomize, setShowCustomize] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);
  useEffect(() => setLocalPrefs(preferences), [preferences]);

  const togglePref = (key: 'analytics' | 'marketing') =>
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const open = mounted && !hasConsented && showBanner;

  /*
   * The conditional lives inside AnimatePresence. Returning null above it — as
   * this component used to — unmounts the child before AnimatePresence can see
   * it leave, so the exit transition never ran.
   */
  return (
    <AnimatePresence>
      {open && (
        <motion.section
          aria-labelledby={titleId}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="fixed inset-x-0 bottom-0 z-[100] rule-t bg-background/[0.98] backdrop-blur-xl"
        >
          <div className="shell py-6">
            <div className="grid grid-cols-1 items-start gap-x-12 gap-y-6 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="label text-foreground/45">{t.cookies.title}</p>
                <h2 id={titleId} className="mt-3 font-display text-body-lg leading-snug">
                  {t.cookies.description}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-6 lg:justify-end">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="label min-h-[44px] bg-primary px-8 text-primary-foreground transition-opacity hover:opacity-85"
                >
                  {t.cookies.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="label link-underline min-h-[44px] text-foreground/70 transition-colors hover:text-foreground"
                >
                  {t.cookies.rejectAll}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showCustomize
                      ? (savePreferences(localPrefs), setShowCustomize(false))
                      : setShowCustomize(true)
                  }
                  aria-expanded={showCustomize}
                  className="label inline-flex min-h-[44px] items-center gap-2 text-foreground/45 transition-colors hover:text-foreground"
                >
                  {showCustomize ? t.cookies.savePreferences : t.cookies.customize}
                  <ChevronDown
                    className={cn('h-3 w-3 transition-transform duration-500', showCustomize && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showCustomize && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <dl className="mt-8 grid grid-cols-1 rule-t sm:grid-cols-3">
                    <ConsentRow
                      title={t.cookies.necessary}
                      description={t.cookies.necessaryDesc}
                      checked
                      locked
                    />
                    <ConsentRow
                      title={t.cookies.analytics}
                      description={t.cookies.analyticsDesc}
                      checked={localPrefs.analytics}
                      onToggle={() => togglePref('analytics')}
                    />
                    <ConsentRow
                      title={t.cookies.marketing}
                      description={t.cookies.marketingDesc}
                      checked={localPrefs.marketing}
                      onToggle={() => togglePref('marketing')}
                    />
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/**
 * One consent category.
 *
 * `role="switch"` with `aria-checked` is what makes the state audible. The old
 * pill toggles were plain buttons containing a coloured div — sighted users
 * could see on/off, screen reader users heard only the label.
 */
function ConsentRow({
  title,
  description,
  checked,
  locked = false,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'h-3 w-3 shrink-0 border transition-colors duration-300',
            checked ? 'border-primary bg-primary' : 'border-rule bg-transparent',
          )}
        />
        <dt className="label">{title}</dt>
      </div>
      <dd className="mt-3 pl-6 text-body-sm text-foreground/50">{description}</dd>
    </>
  );

  const frame =
    'border-b border-rule py-5 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-8 sm:first:pl-0';

  if (locked) {
    return <div className={frame}>{content}</div>;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(frame, 'text-left transition-opacity hover:opacity-70')}
    >
      {content}
    </button>
  );
}
