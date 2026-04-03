"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItemsCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/products", icon: LayoutGrid },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: cartItemsCount },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Profile", href: "/account", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <div className="glass shadow-[0_8px_32px_0_rgba(120,20,48,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[2rem] px-6 h-16 flex items-center justify-between backdrop-blur-2xl bg-white/60 dark:bg-black/40">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-12 h-12 transition-colors",
                isActive ? "text-primary dark:text-primary-foreground" : "text-foreground/50 hover:text-foreground/80"
              )}
            >
              <item.icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110 drop-shadow-md")} />
              {mounted && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
