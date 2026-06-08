"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/useCartStore";
import { useCartDrawerStore } from "@/lib/store/useCartDrawerStore";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * MobileNav — Bottom navigation bar for mobile devices.
 * Features: cart icon opens drawer, i18n labels, active state animations.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItemsCount());
  const openCart = useCartDrawerStore((state) => state.open);
  const { dictionary: t, locale } = useLocaleStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: t.nav.home, href: `/${locale}`, icon: Home },
    { name: t.nav.categories, href: `/${locale}/products`, icon: LayoutGrid },
    { name: t.nav.cart, href: "#cart", icon: ShoppingBag, badge: cartItemsCount, isCart: true },
    { name: t.nav.wishlist, href: `/${locale}/wishlist`, icon: Heart },
    { name: t.nav.profile, href: `/${locale}/account`, icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px]">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.5 }}
        className="glass shadow-[0_8px_32px_0_rgba(120,20,48,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[2rem] px-4 h-16 flex items-center justify-between backdrop-blur-2xl bg-white/70 dark:bg-black/50"
      >
        {navItems.map((item) => {
          const isActive = item.isCart ? false : pathname === item.href;
          
          const handleClick = (e: React.MouseEvent) => {
            if (item.isCart) {
              e.preventDefault();
              openCart();
            }
          };

          return (
            <Link
              key={item.name}
              href={item.isCart ? "#" : item.href}
              onClick={handleClick}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-12 h-12 transition-colors",
                isActive ? "text-primary dark:text-primary-foreground" : "text-foreground/50 hover:text-foreground/80"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-all duration-300", isActive && "scale-110 drop-shadow-md")} />
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {mounted && item.badge !== undefined && item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm ring-2 ring-background"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
