
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Sparkles, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItemsCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="glass rounded-full px-6 h-20 flex items-center justify-between shadow-sm">
          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-none bg-background">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col gap-8 mt-12 px-4">
                  <Link href="/" className="font-headline text-3xl text-primary">Lueur Skin</Link>
                  <div className="space-y-4 flex flex-col font-body uppercase tracking-[0.2em] text-[10px] font-bold">
                    <Link href="/products" className="hover:text-primary transition-colors">Shop Collection</Link>
                    <Link href="/advisor" className="flex items-center gap-2 hover:text-primary transition-colors text-primary">
                      <Sparkles className="h-3 w-3" /> AI Advisor
                    </Link>
                    <Link href="/about" className="hover:text-primary transition-colors">Our Narrative</Link>
                    <Link href="/journal" className="hover:text-primary transition-colors">The Journal</Link>
                    <Link href="/glossary" className="hover:text-primary transition-colors">Botanical Glossary</Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <span className="font-headline text-2xl tracking-tighter text-primary leading-none">
              Lueur Skin
            </span>
            <span className="font-body text-[8px] uppercase tracking-[0.4em] text-foreground/60 dark:text-foreground/40 font-bold -mt-0.5">
              By Alliyah
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-[10px] uppercase tracking-[0.25em] font-body font-bold text-foreground/70">
            <Link href="/products" className="hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              Collection
            </Link>
            <Link href="/advisor" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <Sparkles className="h-3 w-3" />
              Advisor
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              Narrative
            </Link>
            <Link href="/journal" className="hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full hidden lg:block">
              Journal
            </Link>
            <Link href="/glossary" className="hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full hidden lg:block">
              Glossary
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary rounded-full hover:bg-primary/5"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="hidden sm:flex text-primary rounded-full hover:bg-primary/5">
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/account" className="hidden md:flex">
              <Button variant="ghost" size="icon" className="text-primary rounded-full hover:bg-primary/5">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart" className="hidden md:flex">
              <Button variant="ghost" size="icon" className="relative text-primary rounded-full hover:bg-primary/5">
                <ShoppingBag className="h-4 w-4" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
