
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";

export function Navbar({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const itemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  const navItems = useMemo(
    () => [
      { href: localizedPath("/products", locale), label: dictionary.nav.collection },
      { href: localizedPath("/advisor", locale), label: dictionary.nav.advisor },
      { href: localizedPath("/about", locale), label: dictionary.nav.story },
      { href: localizedPath("/journal", locale), label: dictionary.nav.journal },
    ],
    [dictionary.nav, locale],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-foreground/80 hover:text-primary">
              {item.label}
            </Link>
          ))}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">{dictionary.a11y.openMenu}</span>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r-primary/10">
            <div className="mt-12 space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block py-2 text-lg">
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link href={localizedPath("/", locale)} className="absolute left-1/2 -translate-x-1/2">
          <div className="text-center">
            <p className="font-headline text-3xl tracking-tight text-primary">{dictionary.brand.name}</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{dictionary.brand.tagline}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} dictionary={dictionary} />
          <Button variant="ghost" className="rounded-full" onClick={openCart}>
            <span className="sr-only">{dictionary.a11y.openCart}</span>
            <ShoppingBag className="mr-1 h-4 w-4" />
            <span>{itemsCount}</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={localizedPath("/advisor", locale)}>
              <span className="sr-only">{dictionary.nav.advisor}</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
