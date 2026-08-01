"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { Reveal, DrawRule } from '@/components/motion/Editorial';

/**
 * Footer.
 *
 * Rebuilt as a closing statement rather than a link dump: an oversized wordmark
 * that fills the measure, columns separated by hairlines instead of whitespace
 * guesswork, and the newsletter as a single underlined field — no boxed input,
 * no pill button.
 */
export function Footer() {
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: t.footer.subscribed, description: t.footer.subscribedDesc });
    setEmail('');
  };

  const columns = [
    {
      title: t.footer.collection,
      links: [
        { href: `/${locale}/products`, label: t.footer.collectionAll },
        { href: `/${locale}/products?category=gummies`, label: t.footer.gummies },
        { href: `/${locale}/products?category=tea`, label: t.footer.teas },
        { href: `/${locale}/products?concern=radiance`, label: t.footer.radiance },
      ],
    },
    {
      title: t.footer.experience,
      links: [
        { href: `/${locale}/advisor`, label: t.footer.consultation },
        { href: `/${locale}/about`, label: t.footer.narrative },
        { href: `/${locale}/journal`, label: t.footer.journal },
        { href: `/${locale}/glossary`, label: t.footer.glossary },
        { href: `/${locale}/faq`, label: t.footer.ritualGuide },
        { href: `/${locale}/contact`, label: t.footer.concierge },
      ],
    },
  ];

  const legal = [
    { href: `/${locale}/legal/shipping`, label: t.footer.legal.shipping },
    { href: `/${locale}/legal/terms`, label: t.footer.legal.terms },
    { href: `/${locale}/legal/privacy`, label: t.footer.legal.privacy },
    { href: `/${locale}/legal/cookies`, label: t.footer.legal.cookies },
    { href: `/${locale}/legal/accessibility`, label: t.footer.legal.accessibility },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-background pt-24 grain">
      <div className="shell relative z-10">
        <DrawRule />

        {/* Newsletter — the one thing this footer actually asks for. */}
        <div className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="label text-foreground/45">{t.footer.circleTitle}</p>
            <h2 className="mt-5 font-display text-display-sm tracking-editorial">
              {t.footer.circleDesc}
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7 lg:pt-10">
            <form onSubmit={handleSubscribe} className="group relative">
              <label htmlFor="newsletter-email" className="sr-only">
                {t.footer.emailPlaceholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                className="w-full border-0 border-b border-rule bg-transparent pb-4 pr-12 font-display text-display-xs tracking-editorial transition-colors placeholder:text-foreground/25 focus:border-primary focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                aria-label={t.footer.subscribe}
                className="absolute bottom-4 right-0 flex h-10 w-10 items-center justify-center text-primary transition-transform duration-400 ease-editorial hover:translate-x-1"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-4 max-w-prose text-body-sm text-foreground/50">{t.footer.tagline}</p>
          </Reveal>
        </div>

        <DrawRule />

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="label font-body text-foreground/45">{column.title}</h3>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-body-sm text-foreground/75 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="label font-body text-foreground/45">{t.nav.account}</h3>
            <ul className="mt-6 space-y-3">
              <li>
                <Link href={`/${locale}/account`} className="link-underline text-body-sm text-foreground/75 hover:text-primary">
                  {t.nav.profile}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/wishlist`} className="link-underline text-body-sm text-foreground/75 hover:text-primary">
                  {t.nav.wishlist}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cart`} className="link-underline text-body-sm text-foreground/75 hover:text-primary">
                  {t.nav.cart}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label font-body text-foreground/45">Social</h3>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="https://instagram.com/lueurskin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-body-sm text-foreground/75 transition-colors hover:text-primary"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  Instagram
                  <ArrowUpRight
                    className="h-3 w-3 opacity-40 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized wordmark — the closing note. */}
      <div className="shell overflow-hidden pb-8" aria-hidden="true">
        <span className="block whitespace-nowrap font-display text-display-xl leading-[0.78] tracking-tightest text-primary/[0.12] dark:text-primary/20">
          Lueur Skin
        </span>
      </div>

      <div className="shell">
        <DrawRule />
        <div className="flex flex-col items-start justify-between gap-6 py-8 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            {/* The house mark, signing off. Decorative here — the copyright
                line beside it already names the brand in text. */}
            <Image
              src="/brand/lueur-mark.png"
              alt=""
              width={640}
              height={587}
              className="h-9 w-auto shrink-0"
            />
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="label-sm text-foreground/45 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="label-sm text-foreground/40">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
