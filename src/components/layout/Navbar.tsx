"use client";

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ArrowUpRight, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useOverlay } from '@/hooks/use-overlay';
import { useProductSearch } from '@/hooks/use-product-search';
import { formatCurrency } from '@/i18n/format';
import { LOCALE_COOKIE } from '@/i18n/config';

/**
 * Header.
 *
 * Redesigned from a floating glassmorphic pill — a shape that reads as a 2021
 * template and fights the page underneath it — to an editorial masthead: a
 * hairline rule, a centred wordmark, and navigation that behaves like a printed
 * contents page. It hides on scroll down and returns on scroll up, so the
 * viewport belongs to the product.
 */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemsCount = useCartStore((state) => state.cartItemsCount());
  const cartHydrated = useCartStore((state) => state.hasHydrated);
  const openCart = useCartDrawerStore((state) => state.open);
  const { dictionary: t, locale } = useLocaleStore();
  const router = useRouter();
  const pathname = usePathname();

  const { results: searchResults, isSearching } = useProductSearch(searchQuery, locale);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const mobilePanelRef = useOverlay<HTMLDivElement>(mobileOpen, closeMobile);
  const searchPanelRef = useOverlay<HTMLDivElement>(searchOpen, closeSearch);

  useEffect(() => setMounted(true), []);

  // Hide on scroll down, reveal on scroll up. Skipped while an overlay is open,
  // otherwise the masthead slides away underneath the panel.
  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (!mobileOpen && !searchOpen) {
        setHidden(y > 160 && y > last);
      }
      last = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen, searchOpen]);

  const switchLocale = () => {
    const next = locale === 'pt' ? 'en' : 'pt';
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    router.push(pathname.replace(new RegExp(`^/${locale}`), `/${next}`) || `/${next}`);
  };

  // The primary bar, in the order the design sets it. `Home` is included
  // because the design marks the current section, and without it the home page
  // is the one page whose nav shows nothing active.
  const links = [
    { href: `/${locale}`, label: t.nav.home, exact: true },
    { href: `/${locale}/products`, label: t.nav.shop },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/glossary`, label: t.nav.ingredients },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  // `/pt` is a prefix of every other route, so the home link needs an exact
  // match or it would report itself as current on every page.
  const isCurrent = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        /*
         * Sticky rather than fixed. The announcement strip above it should
         * scroll away while the masthead pins, which a fixed element cannot do
         * without JavaScript juggling its `top`. Sticky also removes the spacer
         * div the fixed version needed, and every `top-[var(--header-height)]`
         * offset elsewhere stays correct because the masthead pins at exactly
         * that height.
         */
        className={cn(
          'sticky top-0 z-50 bg-background transition-shadow duration-500',
          scrolled && 'rule-b shadow-[0_1px_24px_-12px_hsl(343_71%_12%/0.35)]',
        )}
        style={{ height: 'var(--header-height)' }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          {/* Left — menu on mobile, mark + wordmark */}
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              className="label -ml-1 flex min-h-[44px] items-center gap-2 px-1 lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={`/${locale}`}
              aria-label={t.nav.goToHome}
              className="group flex shrink-0 items-center gap-2.5 transition-opacity duration-400 hover:opacity-70 md:gap-3.5"
            >
              {/*
                `alt=""` on purpose: the mark and the wordmark say the same
                thing, and the link already carries an accessible name.
                Announcing the brand twice is noise on a screen reader.
              */}
              <Image
                src="/brand/lueur-mark.png"
                alt=""
                width={640}
                height={587}
                priority
                className="h-9 w-auto md:h-11"
              />
              <span className="hidden text-left sm:block">
                <span className="block font-display text-[1.25rem] leading-none tracking-editorial text-primary md:text-[1.4rem]">
                  Lueur&nbsp;Skin
                </span>
                <span className="label-sm mt-1 block text-foreground/45">By Alliyah</span>
              </span>
            </Link>
          </div>

          {/* Centre — primary navigation */}
          <nav aria-label={t.a11y.mainNavigation} className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-10">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href, link.exact) ? 'page' : undefined}
                    data-active={isCurrent(link.href, link.exact)}
                    className={cn(
                      'label link-underline whitespace-nowrap py-2 transition-opacity duration-400',
                      isCurrent(link.href, link.exact) ? 'text-primary' : 'hover:opacity-60',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — utilities */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3">
            <button
              type="button"
              onClick={switchLocale}
              lang={locale === 'pt' ? 'en' : 'pt'}
              title={t.nav.languageLabel}
              aria-label={t.nav.languageLabel}
              className="label hidden min-h-[44px] items-center px-2 transition-opacity hover:opacity-60 sm:flex"
            >
              {t.nav.languageSwitch}
            </button>

            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={t.nav.toggleTheme}
                className="hidden min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-60 sm:flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.openSearch}
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-60"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={`/${locale}/account`}
              aria-label={t.nav.goToAccount}
              className="hidden min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-60 md:flex"
            >
              <User className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-haspopup="dialog"
              aria-label={
                cartHydrated && cartItemsCount > 0 ? `${t.nav.cart} (${cartItemsCount})` : t.nav.cart
              }
              className="relative flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-60"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {/*
                Rendered only once the cart store has rehydrated. Showing a
                count before then makes the server-rendered zero flash to the
                real number on first paint.
              */}
              {cartHydrated && (
                <span
                  aria-hidden="true"
                  className="tabular absolute right-1 top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground"
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            tabIndex={-1}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[80] flex flex-col bg-background md:hidden"
          >
            <div className="shell flex items-center justify-between" style={{ height: 'var(--header-height)' }}>
              <span className="label text-foreground/45">{t.nav.menu}</span>
              <button
                type="button"
                onClick={closeMobile}
                aria-label={t.nav.closeMenu}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label={t.a11y.mainNavigation} className="shell flex-1 overflow-y-auto pt-6">
              <ul>
                {[
                  ...links,
                  { href: `/${locale}/glossary`, label: t.nav.glossary },
                  { href: `/${locale}/account`, label: t.nav.account },
                ].map((link, i) => (
                  <li key={link.href} className="rule-b">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        aria-current={isCurrent(link.href) ? 'page' : undefined}
                        className="flex items-baseline justify-between gap-4 py-5"
                      >
                        <span className="font-display text-display-xs">{link.label}</span>
                        <span className="numeral text-label text-foreground/35">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shell flex items-center justify-between gap-4 py-6 rule-t">
              <button type="button" onClick={() => { switchLocale(); closeMobile(); }} className="label">
                {t.nav.languageLabel}
              </button>
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="label flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {t.nav.toggleTheme}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SEARCH ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.search}
            tabIndex={-1}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-background"
          >
            <div className="shell flex items-center justify-between" style={{ height: 'var(--header-height)' }}>
              <span className="label text-foreground/45">{t.nav.search}</span>
              <button
                type="button"
                onClick={closeSearch}
                aria-label={t.nav.closeSearch}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="shell flex-1 overflow-y-auto pb-16">
              <div className="relative rule-b py-6">
                <label htmlFor="search-input" className="sr-only">
                  {t.nav.search}
                </label>
                <input
                  id="search-input"
                  type="search"
                  role="combobox"
                  aria-expanded={searchResults.length > 0}
                  aria-controls="search-results"
                  aria-autocomplete="list"
                  autoComplete="off"
                  placeholder="…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-display text-display-sm tracking-editorial text-primary placeholder:text-primary/25 focus:outline-none"
                />
                {isSearching && (
                  <Loader2
                    className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary/40"
                    aria-hidden="true"
                  />
                )}
              </div>

              {searchQuery.trim() === '' ? (
                <div className="pt-8">
                  <p className="label text-foreground/45">{t.search.popularSearches}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    {t.search.searchTerms.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setSearchQuery(term)}
                          className="link-underline font-display text-display-xs text-foreground/70 transition-colors hover:text-primary"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div id="search-results" role="listbox" aria-label={t.nav.search} className="pt-6">
                  <p className="label text-foreground/45" aria-live="polite">
                    {searchResults.length}{' '}
                    {searchResults.length === 1 ? t.search.results : t.search.resultsPlural}
                  </p>

                  {searchResults.length > 0 ? (
                    <ul className="mt-4">
                      {searchResults.map((product, i) => (
                        <li key={product.id} role="option" aria-selected="false" className="rule-b">
                          <Link
                            href={product.href}
                            onClick={closeSearch}
                            className="group flex items-center gap-5 py-4"
                          >
                            <span className="numeral w-6 shrink-0 text-label text-foreground/30">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="relative h-16 w-14 shrink-0 overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.imageAlt}
                                fill
                                sizes="56px"
                                className="object-cover duotone transition-transform duration-900 ease-editorial group-hover:scale-105"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="label-sm block text-foreground/45">
                                {product.categoryLabel}
                              </span>
                              <span className="mt-1 block truncate font-display text-display-xs transition-colors group-hover:text-primary">
                                {product.name}
                              </span>
                            </span>
                            <span className="tabular hidden shrink-0 text-body-sm text-foreground/60 sm:block">
                              {formatCurrency(product.price, locale)}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 shrink-0 opacity-40 transition-all duration-400 group-hover:translate-x-1 group-hover:opacity-100"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    !isSearching && (
                      <p className="py-16 text-center font-display text-display-xs text-foreground/40">
                        {t.search.noResults} &ldquo;{searchQuery}&rdquo;
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
