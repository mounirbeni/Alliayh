"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/useCartStore";
import { useCartDrawerStore } from "@/lib/store/useCartDrawerStore";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { cn } from "@/lib/utils";

/**
 * The mobile tab bar.
 *
 * Redrawn as a full-width ruled bar sitting flush to the bottom edge rather
 * than a floating rounded pill: it matches the rest of the system, and its
 * height is exactly `--mobile-nav-height`, which is what every `.pb-mobile-nav`
 * clearance on the site is calculated from. The floating version was 64px tall
 * plus a 20px offset and overlapped page content.
 *
 * Labels are visible rather than `sr-only`. Five unlabelled glyphs asked
 * sighted users to guess; the design has a small-caps label style, so use it.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItemsCount());
  const cartHydrated = useCartStore((state) => state.hasHydrated);
  const openCart = useCartDrawerStore((state) => state.open);
  const { dictionary: t, locale } = useLocaleStore();

  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: t.nav.home, href: `/${locale}`, icon: Home },
    { name: t.nav.categories, href: `/${locale}/products`, icon: LayoutGrid },
    { name: t.nav.cart, href: "#cart", icon: ShoppingBag, badge: cartItemsCount, isCart: true },
    { name: t.nav.wishlist, href: `/${locale}/wishlist`, icon: Heart },
    { name: t.nav.profile, href: `/${locale}/account`, icon: User },
  ];

  return (
    <nav
      aria-label={t.a11y.mainNavigation}
      className="fixed inset-x-0 bottom-0 z-50 rule-t bg-background/[0.97] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid h-[var(--mobile-nav-height)] grid-cols-5">
        {navItems.map((item) => {
          const isActive = item.isCart ? false : pathname === item.href;
          const showBadge = mounted && cartHydrated && (item.badge ?? 0) > 0;

          const handleClick = (event: React.MouseEvent) => {
            if (item.isCart) {
              event.preventDefault();
              openCart();
            }
          };

          return (
            <Link
              key={item.name}
              href={item.isCart ? "#" : item.href}
              onClick={handleClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 transition-colors",
                isActive ? "text-primary" : "text-foreground/45",
              )}
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-x-0 top-0 h-px bg-primary"
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                />
              )}

              <span className="relative">
                <item.icon aria-hidden="true" className="h-[18px] w-[18px]" />
                {showBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    aria-hidden="true"
                    className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-semibold tabular text-primary-foreground"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </span>

              {/*
                Tighter than the site's `.label-sm`: at 390px each cell is only
                78px wide and the Portuguese labels ("Categorias", "Favoritos")
                overflow at the 0.22em tracking that style uses.
              */}
              <span className="px-1 text-center text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.08em]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
