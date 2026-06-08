"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { Home, Grid2x2, Sparkles, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function MobileBottomNav({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const pathname = usePathname();
  const itemsCount = useCartStore((s) =>
    s.items.reduce((t, i) => t + i.quantity, 0),
  );
  const openCart = useCartStore((s) => s.openCart);
  const pt = locale === "pt-PT";

  const tabs = [
    {
      key: "home",
      icon: Home,
      label: pt ? "Início" : "Home",
      href: localizedPath("/", locale),
      isActive: pathname === `/${locale}` || pathname === `/${locale}/`,
    },
    {
      key: "products",
      icon: Grid2x2,
      label: pt ? "Loja" : "Shop",
      href: localizedPath("/products", locale),
      isActive: pathname.includes("/products"),
    },
    {
      key: "advisor",
      icon: Sparkles,
      label: pt ? "Consultor" : "Advisor",
      href: localizedPath("/advisor", locale),
      isActive: pathname.includes("/advisor"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label={pt ? "Navegação principal" : "Main navigation"}
    >
      {/* frosted glass bar */}
      <div
        className="border-t border-primary/10 bg-background/80 backdrop-blur-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <LayoutGroup id="bottom-nav">
          <div className="flex items-stretch">
            {/* Page tabs */}
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className="relative flex flex-1 flex-col items-center justify-center py-2.5 gap-1 tap-highlight-none"
                aria-current={tab.isActive ? "page" : undefined}
              >
                {/* active top line */}
                {tab.isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}

                {/* icon */}
                <motion.div
                  animate={{
                    scale: tab.isActive ? 1.18 : 1,
                    y: tab.isActive ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                >
                  <tab.icon
                    className={cn(
                      "h-[22px] w-[22px] transition-colors duration-150",
                      tab.isActive ? "text-primary" : "text-muted-foreground/55",
                    )}
                    strokeWidth={tab.isActive ? 2 : 1.6}
                  />
                </motion.div>

                {/* label */}
                <span
                  className={cn(
                    "text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
                    tab.isActive ? "text-primary" : "text-muted-foreground/50",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            ))}

            {/* Cart button (opens drawer) */}
            <button
              onClick={openCart}
              className="relative flex flex-1 flex-col items-center justify-center py-2.5 gap-1"
              aria-label={dictionary.a11y.openCart}
            >
              <div className="relative">
                <ShoppingBag
                  className="h-[22px] w-[22px] text-muted-foreground/55"
                  strokeWidth={1.6}
                />
                {itemsCount > 0 && (
                  <motion.span
                    key={itemsCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 18 }}
                    className="absolute -right-1.5 -top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground"
                  >
                    {itemsCount > 9 ? "9+" : itemsCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                {pt ? "Saco" : "Bag"}
              </span>
            </button>
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
}
