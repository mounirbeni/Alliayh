"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, formatMessage } from "@/i18n/format";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";

const FREE_SHIPPING_THRESHOLD = 75;

export function CartDrawer({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { isOpen, closeCart, items, updateQuantity, removeItem } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const pt = locale === "pt-PT";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full border-l-primary/10 bg-background sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{dictionary.nav.cart}</SheetTitle>
          <SheetDescription>
            {formatMessage(dictionary.cart.itemsCount, {
              count: items.length,
              label: items.length === 1 ? dictionary.cart.singleItem : dictionary.cart.multipleItems,
            })}
          </SheetDescription>
        </SheetHeader>

        {/* Free shipping progress */}
        <div className="mt-5 rounded-2xl border border-primary/10 bg-secondary/20 px-4 py-3">
          {remaining > 0 ? (
            <p className="text-xs text-muted-foreground">
              {pt
                ? `Faltam ${formatCurrency(remaining, locale)} para envio gratuito`
                : `${formatCurrency(remaining, locale)} away from free shipping`}
            </p>
          ) : (
            <p className="text-xs font-medium text-primary">
              {pt ? "Parabéns! Tem envio gratuito." : "You qualify for free shipping!"}
            </p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex h-[72vh] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-primary/20 p-8 text-center text-sm text-muted-foreground">
                {dictionary.cart.empty}
              </div>
            )}

            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-primary/10 p-3">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price, locale)}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 text-sm transition hover:border-primary/60"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 text-sm transition hover:border-primary/60"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-muted-foreground transition hover:text-destructive"
                      >
                        {dictionary.cart.remove}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t border-primary/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{dictionary.cart.total}</span>
              <span className="text-lg font-semibold">{formatCurrency(total, locale)}</span>
            </div>
            {total >= FREE_SHIPPING_THRESHOLD && (
              <div className="flex items-center justify-between text-xs text-primary">
                <span>{pt ? "Envio" : "Shipping"}</span>
                <span className="font-medium">{pt ? "Gratuito" : "Free"}</span>
              </div>
            )}
            <Button
              asChild
              className="w-full rounded-full"
              disabled={items.length === 0}
            >
              <Link href={localizedPath("/checkout", locale)} onClick={closeCart}>
                {dictionary.nav.checkout}
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
