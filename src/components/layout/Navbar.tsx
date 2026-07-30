"use client";

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Sparkles, Menu, Moon, Sun, Globe, X, ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useOverlay } from '@/hooks/use-overlay';
import { useProductSearch } from '@/hooks/use-product-search';
import { formatCurrency } from '@/i18n/format';
import { LOCALE_COOKIE } from '@/i18n/config';

/**
 * Navbar — premium glassmorphic navigation, visually unchanged.
 *
 * Behavioural rework:
 *   - search queries hit `/api/search` instead of filtering a catalog copy that
 *     was bundled into every page's JavaScript;
 *   - the search overlay and mobile drawer are proper modals (labelled,
 *     focus-trapped, Escape-dismissible) rather than div soup on top of the page;
 *   - switching language writes the preference cookie, so the choice survives a
 *     later visit to an unprefixed URL;
 *   - the cart badge only renders after the persisted bag has rehydrated, which
 *     removes a server/client markup mismatch.
 */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleToggleLocale = () => {
    const nextLocale = locale === 'pt' ? 'en' : 'pt';
    // Persist the choice so an unprefixed visit later lands in the right tree.
    document.cookie = `${LOCALE_COOKIE}=${nextLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    const newPath = pathname.replace(new RegExp(`^/${locale}`), `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll position for enhanced glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}/products`, label: t.nav.collection },
    { href: `/${locale}/advisor`, label: t.nav.advisor, accent: true },
    { href: `/${locale}/about`, label: t.nav.story },
    { href: `/${locale}/journal`, label: t.nav.journal, hideOnMd: true },
  ];

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-500">
        <div className="container mx-auto px-4 py-3">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn(
              'rounded-full px-5 md:px-6 h-[72px] md:h-20 flex items-center justify-between transition-all duration-500',
              scrolled ? 'glass shadow-lg shadow-primary/5' : 'glass shadow-sm',
            )}
          >
            {/* Mobile Menu Trigger */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full min-h-[44px] min-w-[44px]"
                onClick={() => setMobileOpen(true)}
                aria-label={t.nav.menu}
                aria-expanded={mobileOpen}
                aria-haspopup="dialog"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex flex-col items-center group" aria-label={t.nav.goToHome}>
              <span className="font-headline text-xl md:text-2xl tracking-tighter text-primary leading-none group-hover:text-gradient transition-all duration-300">
                Lueur Skin
              </span>
              <span className="font-body text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-foreground/60 dark:text-foreground/40 font-bold -mt-0.5">
                By Alliyah
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              aria-label={t.a11y.mainNavigation}
              className="hidden md:flex items-center gap-6 lg:gap-10 text-[10px] uppercase tracking-[0.25em] font-body font-bold text-foreground/70"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  className={cn(
                    'relative transition-colors duration-300',
                    'after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-500 hover:after:w-full',
                    link.accent ? 'flex items-center gap-2 text-primary hover:opacity-80' : 'hover:text-primary',
                    isCurrent(link.href) && 'text-primary after:w-full',
                    link.hideOnMd && 'hidden lg:block',
                  )}
                >
                  {link.accent && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                onClick={handleToggleLocale}
                aria-label={`${t.nav.languageLabel}`}
                title={t.nav.languageLabel}
                lang={locale === 'pt' ? 'en' : 'pt'}
              >
                <span className="relative flex items-center justify-center">
                  <Globe className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-1 text-[7px] font-body font-black text-primary tracking-tight"
                  >
                    {t.nav.languageSwitch}
                  </span>
                </span>
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label={t.nav.toggleTheme}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Moon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              )}

              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                onClick={() => setSearchOpen(true)}
                aria-label={t.nav.openSearch}
                aria-expanded={searchOpen}
                aria-haspopup="dialog"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* Account */}
              <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10">
                <Link href={`/${locale}/account`} aria-label={t.nav.goToAccount}>
                  <User className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              {/* Cart (opens drawer) */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                onClick={openCart}
                aria-label={
                  cartHydrated && cartItemsCount > 0
                    ? `${t.nav.cart} (${cartItemsCount})`
                    : t.nav.cart
                }
                aria-haspopup="dialog"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {cartHydrated && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    aria-hidden="true"
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-sm"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ====== MOBILE NAV DRAWER ====== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />
            <motion.div
              ref={mobilePanelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.menu}
              tabIndex={-1}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[70] w-[300px] bg-background shadow-2xl p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <Link href={`/${locale}`} className="font-headline text-2xl text-primary" onClick={closeMobile}>
                  Lueur Skin
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full min-h-[44px] min-w-[44px]"
                  onClick={closeMobile}
                  aria-label={t.nav.closeMenu}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <nav aria-label={t.a11y.mainNavigation} className="flex flex-col gap-6">
                {[
                  { href: `/${locale}/products`, label: t.nav.collection },
                  { href: `/${locale}/advisor`, label: t.nav.advisor, accent: true },
                  { href: `/${locale}/about`, label: t.nav.story },
                  { href: `/${locale}/journal`, label: t.nav.journal },
                  { href: `/${locale}/glossary`, label: t.nav.glossary },
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                      className={cn(
                        'font-body uppercase tracking-[0.2em] text-[11px] font-bold transition-colors',
                        link.accent ? 'flex items-center gap-2 text-primary' : 'hover:text-primary',
                      )}
                    >
                      {link.accent && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Language switcher in mobile */}
              <div className="mt-auto pt-8 border-t border-primary/10">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleLocale();
                    closeMobile();
                  }}
                  className="flex items-center gap-3 font-body uppercase tracking-[0.2em] text-[11px] font-bold text-foreground/70 hover:text-primary transition-colors w-full"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  {t.nav.languageLabel}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====== SEARCH OVERLAY ====== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.search}
            tabIndex={-1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center pt-24 md:pt-32 px-4"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 md:top-10 md:right-10 rounded-full h-12 w-12 hover:bg-primary/10 transition-colors"
              onClick={closeSearch}
              aria-label={t.nav.closeSearch}
            >
              <X className="h-6 w-6 text-primary" aria-hidden="true" />
            </Button>

            <div className="w-full max-w-3xl flex flex-col gap-8">
              {/* Search Input */}
              <div className="relative w-full">
                <label htmlFor="search-input" className="sr-only">
                  {t.nav.search}
                </label>
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/50"
                  aria-hidden="true"
                />
                <input
                  id="search-input"
                  type="search"
                  role="combobox"
                  aria-expanded={searchResults.length > 0}
                  aria-controls="search-results"
                  aria-autocomplete="list"
                  placeholder={`${t.nav.search}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-20 md:h-24 bg-transparent border-b-2 border-primary/20 text-3xl md:text-5xl font-headline focus:outline-none focus:border-primary transition-colors pl-16 pr-8 placeholder:text-primary/30 text-primary"
                  autoComplete="off"
                />
                {isSearching && (
                  <Loader2
                    className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary/50"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Search Results */}
              {searchQuery.trim() !== '' && (
                <div
                  id="search-results"
                  role="listbox"
                  aria-label={t.nav.search}
                  className="flex flex-col gap-4 animate-in fade-in duration-500 max-h-[60vh] overflow-y-auto pb-8 scrollbar-hide"
                >
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold" aria-live="polite">
                      {searchResults.length}{' '}
                      {searchResults.length === 1 ? t.search.results : t.search.resultsPlural}
                    </span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((product) => (
                        <Link href={product.href} key={product.id} role="option" aria-selected="false" onClick={closeSearch}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex gap-4 items-center p-4 rounded-3xl border border-primary/10 bg-white/5 dark:bg-black/20 hover:bg-white/10 transition-colors cursor-pointer group"
                          >
                            <div className="relative h-20 w-16 rounded-2xl overflow-hidden shrink-0">
                              <Image
                                src={product.image}
                                alt={product.imageAlt}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                                {product.categoryLabel}
                              </span>
                              <span className="font-headline text-lg truncate group-hover:text-primary transition-colors">
                                {product.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatCurrency(product.price, locale)}
                              </span>
                            </div>
                            <span className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !isSearching && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-primary/20 mb-4" aria-hidden="true" />
                        <p className="text-lg text-muted-foreground">
                          {t.search.noResults} &ldquo;{searchQuery}&rdquo;
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Popular Searches */}
              {searchQuery.trim() === '' && (
                <div className="flex flex-col gap-4 px-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    {t.search.popularSearches}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t.search.searchTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 rounded-full border border-primary/20 text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
