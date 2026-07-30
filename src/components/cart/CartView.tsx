"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/useCartStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { calculateTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { formatCurrency } from '@/i18n/format';

/**
 * Full-page bag.
 *
 * Was entirely hard-coded English, priced in dollars, added an invented 8% tax
 * line, and linked to `/products` and `/checkout` without the locale prefix so
 * every click bounced through a redirect. Totals now come from the shared
 * pricing module, so this page, the drawer and checkout always agree.
 */
export function CartView() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { dictionary: t, locale } = useLocaleStore();

  const totals = calculateTotals(items);
  const price = (value: number) => formatCurrency(value, locale);

  // Render the empty state until the persisted bag has rehydrated, so the
  // server markup and the first client paint agree.
  if (!hasHydrated) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-24" aria-busy="true">
        <span className="sr-only">{t.common.loading}</span>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="font-headline text-4xl md:text-5xl mb-12 uppercase tracking-widest text-center">
          {t.cart.pageTitle}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-black/20 rounded-[3rem] border border-primary/10">
            <span className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-10 w-10" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-headline mb-4 uppercase tracking-widest">{t.cart.empty}</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md italic">{t.cart.emptyDesc}</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 px-8 uppercase tracking-widest text-xs font-bold h-14"
            >
              <Link href={`/${locale}/products`}>{t.cart.exploreCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <ul className="lg:col-span-8 space-y-6 list-none">
              {items.map((item) => (
                <li
                  key={item.cartItemId}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 items-center"
                >
                  <Link href={item.href} className="relative w-32 h-40 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="128px"
                      className="object-cover object-center"
                    />
                  </Link>

                  <div className="flex-1 space-y-4 w-full min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">
                            {item.categoryLabel}
                          </span>
                          {item.isSubscription && (
                            <span className="text-[8px] bg-primary/10 text-primary uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                              {t.cart.deliveryEvery} {item.subscriptionInterval}
                            </span>
                          )}
                        </div>
                        <h2 className="font-headline text-2xl tracking-tight mt-1 truncate">
                          <Link href={item.href} className="hover:text-primary transition-colors">
                            {item.name}
                          </Link>
                        </h2>
                      </div>
                      <div className="text-right shrink-0">
                        {item.originalPrice > item.price && (
                          <div className="text-sm line-through text-muted-foreground">
                            {price(item.originalPrice * item.quantity)}
                          </div>
                        )}
                        <div className="font-headline text-xl">{price(item.price * item.quantity)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                      <div className="flex items-center border border-border rounded-full p-1 bg-background">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-40"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`${t.cart.decreaseQuantity}: ${item.name}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-headline text-sm" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-40"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          aria-label={`${t.cart.increaseQuantity}: ${item.name}`}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label={`${t.cart.remove}: ${item.name}`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 sticky top-28">
                <h2 className="font-headline text-2xl uppercase tracking-widest mb-6">
                  {t.cart.orderSummary}
                </h2>

                <dl className="space-y-4 text-sm font-headline uppercase tracking-wider text-muted-foreground">
                  <div className="flex justify-between">
                    <dt>{t.cart.subtotal}</dt>
                    <dd className="text-foreground">{price(totals.subtotal)}</dd>
                  </div>
                  {totals.savings > 0 && (
                    <div className="flex justify-between">
                      <dt>{t.cart.savings}</dt>
                      <dd className="text-primary">−{price(totals.savings)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>{t.cart.shipping}</dt>
                    <dd className="text-foreground">
                      {totals.shipping === 0 ? t.cart.shippingFree : price(totals.shipping)}
                    </dd>
                  </div>
                  <div className="pt-4 mt-4 border-t border-primary/10 flex justify-between items-center text-foreground">
                    <dt className="font-bold">{t.cart.total}</dt>
                    <dd className="text-2xl">{price(totals.total)}</dd>
                  </div>
                </dl>

                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                  {t.cart.vatIncluded}
                </p>

                {!totals.qualifiesForFreeShipping && (
                  <p className="mt-4 text-[11px] text-primary font-bold uppercase tracking-widest leading-relaxed">
                    {t.cart.addForFreeShipping.replace('{amount}', price(totals.amountToFreeShipping))}
                  </p>
                )}
                {totals.qualifiesForFreeShipping && (
                  <p className="mt-4 text-[11px] text-primary font-bold uppercase tracking-widest">
                    {t.cart.freeShippingFrom} {price(FREE_SHIPPING_THRESHOLD)}
                  </p>
                )}

                <Button
                  asChild
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2 mt-8"
                >
                  <Link href={`/${locale}/checkout`}>
                    {t.cart.checkout}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5 opacity-70">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" /> {t.cart.secureCheckout}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
