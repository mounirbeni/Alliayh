
"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Sparkles, Menu, Moon, Sun, Globe, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { PRODUCTS } from '@/app/lib/products';
import Image from 'next/image';

/**
 * Navbar — Premium glassmorphic navigation with language switcher.
 * Features: sticky header, mobile drawer, i18n toggle, cart icon with badge.
 */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItemsCount());
  const openCart = useCartDrawerStore((state) => state.open);
  const { dictionary: t, locale } = useLocaleStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleLocale = () => {
    const nextLocale = locale === 'pt' ? 'en' : 'pt';
    const newPath = pathname.replace(new RegExp(`^/${locale}`), `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent background scrolling when overlays are open
  useEffect(() => {
    if (searchOpen || mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [searchOpen, mobileOpen]);

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll position for enhanced glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}/products`, label: t.nav.collection },
    { href: `/${locale}/advisor`, label: t.nav.advisor, accent: true },
    { href: `/${locale}/about`, label: t.nav.story },
    { href: `/${locale}/journal`, label: t.nav.journal, hideOnMd: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-500">
        <div className="container mx-auto px-4 py-3">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn(
              "rounded-full px-5 md:px-6 h-[72px] md:h-20 flex items-center justify-between transition-all duration-500",
              scrolled
                ? "glass shadow-lg shadow-primary/5"
                : "glass shadow-sm"
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
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex flex-col items-center group" aria-label="Lueur Skin Home">
              <span className="font-headline text-xl md:text-2xl tracking-tighter text-primary leading-none group-hover:text-gradient transition-all duration-300">
                Lueur Skin
              </span>
              <span className="font-body text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-foreground/60 dark:text-foreground/40 font-bold -mt-0.5">
                By Alliyah
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[10px] uppercase tracking-[0.25em] font-body font-bold text-foreground/70">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative transition-colors duration-300",
                    "after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-500 hover:after:w-full",
                    link.accent
                      ? "flex items-center gap-2 text-primary hover:opacity-80"
                      : "hover:text-primary",
                    link.hideOnMd && "hidden lg:block"
                  )}
                >
                  {link.accent && <Sparkles className="h-3 w-3" />}
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
                aria-label={`Switch to ${t.nav.languageLabel}`}
                title={t.nav.languageLabel}
              >
                <div className="relative flex items-center justify-center">
                  <Globe className="h-3.5 w-3.5 text-primary/60" />
                  <span className="absolute -bottom-0.5 -right-1 text-[7px] font-body font-black text-primary tracking-tight">
                    {t.nav.languageSwitch}
                  </span>
                </div>
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              )}

              {/* Search */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:flex text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                }}
                aria-label={t.nav.search}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Account */}
              <Link href={`/${locale}/account`} className="hidden md:flex">
                <Button variant="ghost" size="icon" className="text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10">
                  <User className="h-4 w-4" />
                </Button>
              </Link>

              {/* Cart (opens drawer) */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary rounded-full hover:bg-primary/5 min-h-[44px] min-w-[44px] h-10 w-10"
                onClick={openCart}
                aria-label={t.nav.cart}
              >
                <ShoppingBag className="h-4 w-4" />
                {mounted && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[70] w-[300px] bg-background shadow-2xl p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <Link href={`/${locale}`} className="font-headline text-2xl text-primary" onClick={() => setMobileOpen(false)}>
                  Lueur Skin
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full min-h-[44px] min-w-[44px]"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-6">
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
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "font-body uppercase tracking-[0.2em] text-[11px] font-bold transition-colors",
                        link.accent
                          ? "flex items-center gap-2 text-primary"
                          : "hover:text-primary"
                      )}
                    >
                      {link.accent && <Sparkles className="h-3 w-3" />}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Language switcher in mobile */}
              <div className="mt-auto pt-8 border-t border-primary/10">
                <button
                  onClick={() => { handleToggleLocale(); setMobileOpen(false); }}
                  className="flex items-center gap-3 font-body uppercase tracking-[0.2em] text-[11px] font-bold text-foreground/70 hover:text-primary transition-colors w-full"
                >
                  <Globe className="h-4 w-4" />
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center pt-24 md:pt-32 px-4"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 md:top-10 md:right-10 rounded-full h-12 w-12 hover:bg-primary/10 transition-colors"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
            >
              <X className="h-6 w-6 text-primary" />
            </Button>

            <div className="w-full max-w-3xl flex flex-col gap-8">
              {/* Search Input */}
              <div className="relative w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/50" />
                <input
                  id="search-input"
                  type="text"
                  placeholder={t.nav.search + "..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-20 md:h-24 bg-transparent border-b-2 border-primary/20 text-3xl md:text-5xl font-headline focus:outline-none focus:border-primary transition-colors pl-16 pr-8 placeholder:text-primary/30 text-primary"
                  autoComplete="off"
                />
              </div>

              {/* Search Results */}
              {searchQuery.trim() !== '' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-500 max-h-[60vh] overflow-y-auto pb-8 scrollbar-hide">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {searchResults.length} {searchResults.length === 1 ? t.search.results : t.search.resultsPlural}
                    </span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((product) => (
                        <Link 
                          href={`/${locale}/products/${product.id}`} 
                          key={product.id}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex gap-4 items-center p-4 rounded-3xl border border-primary/10 bg-white/5 dark:bg-black/20 hover:bg-white/10 transition-colors cursor-pointer group"
                          >
                            <div className="relative h-20 w-16 rounded-2xl overflow-hidden shrink-0">
                              <Image 
                                src={product.image.startsWith('/') ? product.image : '/products/sea-moss-gummies.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{product.category}</span>
                              <span className="font-headline text-lg truncate group-hover:text-primary transition-colors">{product.name}</span>
                              <span className="text-sm text-muted-foreground">€{product.price.toFixed(2)}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Search className="h-12 w-12 text-primary/20 mb-4" />
                      <p className="text-lg text-muted-foreground">{t.search.noResults} "{searchQuery}"</p>
                    </div>
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
                    {t.search.searchTerms.map(term => (
                      <button
                        key={term}
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
