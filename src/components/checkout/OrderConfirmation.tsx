"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, type CartItem } from '@/lib/store/useCartStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { calculateTotals, type OrderTotals } from '@/lib/pricing';
import { formatCurrency } from '@/i18n/format';

/**
 * Post-checkout receipt.
 *
 * The previous version listed `[items, clearCart, cartTotal]` as effect
 * dependencies while clearing the cart inside the effect — the write changed
 * `items`, which re-ran the effect. It only settled because the second pass saw
 * an empty array. It also recomputed totals with its own 8%-tax-plus-$10
 * formula, so the receipt could disagree with what the customer saw at
 * checkout. Now the order is captured exactly once and priced by the shared
 * module.
 */
export function OrderConfirmation() {
  const { dictionary: t, locale } = useLocaleStore();
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);

  const [order, setOrder] = useState<{
    id: string;
    items: CartItem[];
    totals: OrderTotals;
  } | null>(null);
  const captured = useRef(false);

  useEffect(() => {
    if (!hasHydrated || captured.current || items.length === 0) return;

    captured.current = true;
    setOrder({
      id: `LUEUR-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      totals: calculateTotals(items),
    });
    clearCart();
  }, [hasHydrated, items, clearCart]);

  const price = (value: number) => formatCurrency(value, locale);

  if (!hasHydrated) {
    return (
      <div className="py-24 text-center" aria-busy="true">
        <span className="sr-only">{t.common.loading}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-6">
        <h1 className="text-3xl font-headline">{t.checkout.noOrder}</h1>
        <p className="text-muted-foreground italic max-w-md">{t.checkout.noOrderDesc}</p>
        <Button asChild className="rounded-full uppercase tracking-widest text-[10px] font-bold h-12 px-8">
          <Link href={`/${locale}/products`}>{t.checkout.backToShop}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="flex justify-center mb-8">
          <span className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
            <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse" aria-hidden="true" />
          </span>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl mb-4 italic">{t.checkout.thankYou}</h1>
        <p className="text-muted-foreground text-lg mb-8">{t.checkout.thankYouDesc}</p>

        <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 text-left mb-12">
          <div className="flex justify-between items-center border-b border-primary/10 pb-6 mb-6 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                {t.checkout.orderNumber}
              </span>
              <span className="font-headline text-xl text-primary">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                {t.checkout.totalPaid}
              </span>
              <span className="font-headline text-xl">{price(order.totals.total)}</span>
            </div>
          </div>

          <h2 className="font-headline text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" /> {t.checkout.orderSummary}
          </h2>

          <ul className="space-y-6 list-none">
            {order.items.map((item) => (
              <li key={item.cartItemId} className="flex gap-6 items-center">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-lg truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {t.cart.quantity}: {item.quantity}
                  </p>
                </div>
                <div className="font-headline text-lg shrink-0">
                  {price(item.price * item.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-8 pt-6 border-t border-primary/10 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.cart.subtotal}</dt>
              <dd>{price(order.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.cart.shipping}</dt>
              <dd>{order.totals.shipping === 0 ? t.cart.shippingFree : price(order.totals.shipping)}</dd>
            </div>
            <div className="flex justify-between font-bold pt-2">
              <dt>{t.cart.total}</dt>
              <dd>{price(order.totals.total)}</dd>
            </div>
          </dl>
        </div>

        <Button
          asChild
          size="lg"
          className="h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-sm font-bold px-12"
        >
          <Link href={`/${locale}/products`}>{t.checkout.continueShopping}</Link>
        </Button>
      </div>
    </div>
  );
}
