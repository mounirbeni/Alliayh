"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/useCartStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { calculateTotals } from '@/lib/pricing';
import { formatCurrency } from '@/i18n/format';
import { createCheckoutSession } from '@/app/[locale]/checkout/actions';

/**
 * Checkout — review and pay.
 *
 * The previous version rendered a full card form: `cardNumber`, `expiry` and
 * `cvc` collected into React state by a form whose submit handler was a 1.5s
 * `setTimeout`. It took no money, and had it ever been wired to a processor it
 * would have put raw PAN data through our own application — the exact thing PCI
 * DSS exists to prevent.
 *
 * Payment now happens on Stripe's hosted checkout. Card details never touch our
 * origin, and the customer gets Apple Pay, Google Pay and local European
 * methods without us implementing any of them.
 */
export function CheckoutView() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const { dictionary: t, locale } = useLocaleStore();

  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const totals = calculateTotals(items);
  const price = (value: number) => formatCurrency(value, locale);

  const handlePay = async () => {
    setIsRedirecting(true);
    setError(null);

    try {
      // Only ids and quantities cross the wire. The server re-prices every line
      // from the catalog, so a tampered payload cannot change what is charged.
      const result = await createCheckoutSession({
        locale,
        email: email.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          isSubscription: item.isSubscription,
        })),
      });

      if (result.ok) {
        // Full navigation, not a client transition — the destination is Stripe.
        window.location.href = result.redirectUrl;
        return;
      }

      setError(
        result.reason === 'out_of_stock'
          ? { title: t.checkout.outOfStockTitle, description: t.checkout.outOfStockDesc }
          : { title: t.checkout.checkoutFailed, description: t.checkout.checkoutFailedDesc },
      );
    } catch (cause) {
      console.error('[checkout] failed to start payment:', cause);
      setError({ title: t.checkout.checkoutFailed, description: t.checkout.checkoutFailedDesc });
    } finally {
      setIsRedirecting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="py-24 text-center" aria-busy="true">
        <span className="sr-only">{t.common.loading}</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-6">
        <h1 className="font-headline text-3xl">{t.checkout.emptyBag}</h1>
        <p className="text-muted-foreground italic max-w-md">{t.cart.emptyDesc}</p>
        <Button asChild className="rounded-full uppercase tracking-widest text-[10px] font-bold h-12 px-8">
          <Link href={`/${locale}/products`}>{t.cart.exploreCta}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="font-headline text-4xl mb-4 uppercase tracking-widest text-center">
          {t.checkout.title}
        </h1>
        <p className="text-center text-muted-foreground italic mb-12">
          {t.checkout.reviewSubtitle}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Review + contact */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <h2 className="font-headline text-2xl uppercase tracking-widest border-b border-primary/10 pb-4">
                {t.checkout.reviewTitle}
              </h2>

              <ul className="space-y-6 list-none">
                {items.map((item) => (
                  <li key={item.cartItemId} className="flex gap-6 items-center">
                    <Link href={item.href} className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline text-lg truncate">
                        <Link href={item.href} className="hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                        {item.quantity} × {price(item.price)}
                        {item.isSubscription && ` · ${t.cart.subscription}`}
                      </p>
                    </div>
                    <span className="font-headline text-lg shrink-0">
                      {price(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="ghost"
                className="rounded-full uppercase tracking-widest text-[10px] font-bold gap-2 px-0 hover:bg-transparent hover:text-primary"
              >
                <Link href={`/${locale}/cart`}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {t.checkout.backToBag}
                </Link>
              </Button>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl uppercase tracking-widest border-b border-primary/10 pb-4">
                {t.checkout.contactTitle}
              </h2>
              <div className="space-y-2">
                <label
                  htmlFor="checkout-email"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {t.checkout.email}
                </label>
                <Input
                  id="checkout-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.checkout.placeholderEmail}
                  className="h-12 rounded-xl border-primary/20 bg-white/50 dark:bg-black/20"
                />
                <p className="text-[11px] text-muted-foreground italic">{t.checkout.emailHint}</p>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-4 p-6 rounded-[2rem] border border-destructive/30 bg-destructive/5"
              >
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-headline text-sm uppercase tracking-widest">{error.title}</p>
                  <p className="text-xs text-muted-foreground">{error.description}</p>
                  {error.title === t.checkout.outOfStockTitle && (
                    <Button
                      variant="link"
                      className="px-0 h-auto text-xs"
                      onClick={() => router.push(`/${locale}/cart`)}
                    >
                      {t.checkout.backToBag}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summary + pay */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 sticky top-28">
              <h2 className="font-headline text-xl uppercase tracking-widest mb-6">
                {t.checkout.orderSummary}
              </h2>

              <dl className="space-y-4 border-t border-primary/10 pt-6 text-sm font-headline uppercase tracking-wider text-muted-foreground">
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
                  <dt className="font-bold text-lg">{t.cart.total}</dt>
                  <dd className="text-2xl">{price(totals.total)}</dd>
                </div>
              </dl>

              <p className="text-[10px] text-muted-foreground italic mt-3">
                {t.cart.vatIncluded}
                {!totals.qualifiesForFreeShipping &&
                  ` · ${t.cart.addForFreeShipping.replace('{amount}', price(totals.amountToFreeShipping))}`}
              </p>

              <Button
                onClick={handlePay}
                disabled={isRedirecting}
                className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2 mt-8"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t.checkout.redirectingToPayment}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    {t.checkout.payWithStripe}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5 opacity-70">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" /> {t.checkout.poweredByStripe}
              </p>
              <p className="text-center text-[10px] text-muted-foreground italic mt-2">
                {t.checkout.acceptedMethods}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
