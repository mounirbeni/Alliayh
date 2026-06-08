
"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ShoppingBag, Sparkles, User, LogOut, LayoutDashboard, Crown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { cn } from "@/lib/utils";

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
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const pt = locale === "pt-PT";

  const navItems = useMemo(
    () => [
      { href: localizedPath("/products", locale), label: dictionary.nav.collection },
      { href: localizedPath("/advisor", locale), label: dictionary.nav.advisor },
      { href: localizedPath("/about", locale), label: dictionary.nav.story },
      { href: localizedPath("/journal", locale), label: dictionary.nav.journal },
      { href: localizedPath("/pricing", locale), label: pt ? "Preços" : "Pricing" },
    ],
    [dictionary.nav, locale, pt],
  );

  function handleLogout() {
    logout();
    router.push(localizedPath("/", locale));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Left nav */}
        <div className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">{dictionary.a11y.openMenu}</span>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r-primary/10">
            <div className="mt-12 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-lg hover:bg-primary/5 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-6 border-t border-primary/10 pt-6 space-y-1">
                {mounted && isAuthenticated && user ? (
                  <>
                    <Link
                      href={localizedPath("/account", locale)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base hover:bg-primary/5 hover:text-primary"
                    >
                      <User className="h-4 w-4" />
                      {pt ? "A minha conta" : "My account"}
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href={localizedPath("/dashboard", locale)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base hover:bg-primary/5 hover:text-primary"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-base text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {pt ? "Sair" : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={localizedPath("/auth/login", locale)}
                      className="block rounded-xl px-3 py-2.5 text-base hover:bg-primary/5 hover:text-primary"
                    >
                      {pt ? "Entrar" : "Sign in"}
                    </Link>
                    <Link
                      href={localizedPath("/auth/register", locale)}
                      className="block rounded-xl px-3 py-2.5 text-base font-medium text-primary"
                    >
                      {pt ? "Criar conta" : "Create account"}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Centered brand */}
        <Link
          href={localizedPath("/", locale)}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <div className="text-center">
            <p className="font-headline text-3xl tracking-tight text-primary">
              {dictionary.brand.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              {dictionary.brand.tagline}
            </p>
          </div>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
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

          {/* Auth controls */}
          {mounted && (
            isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden gap-1.5 rounded-full md:flex" size="sm">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                      "bg-primary text-primary-foreground"
                    )}>
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                      {user.plan}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href={localizedPath("/account", locale)} className="flex gap-2">
                      <User className="h-4 w-4" />
                      {pt ? "A minha conta" : "My account"}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href={localizedPath("/dashboard", locale)} className="flex gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href={localizedPath("/pricing", locale)} className="flex gap-2">
                      <Crown className="h-4 w-4" />
                      {pt ? "Planos" : "Plans"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {pt ? "Sair" : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" size="sm" className="rounded-full text-sm" asChild>
                  <Link href={localizedPath("/auth/login", locale)}>
                    {pt ? "Entrar" : "Sign in"}
                  </Link>
                </Button>
                <Button size="sm" className="rounded-full px-4 text-sm" asChild>
                  <Link href={localizedPath("/auth/register", locale)}>
                    {pt ? "Criar conta" : "Get started"}
                  </Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
