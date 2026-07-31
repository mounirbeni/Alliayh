import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Package, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDictionary, type Locale } from '@/i18n';
import { formatCurrency } from '@/i18n/format';
import type { Order } from '@/lib/orders/types';

/**
 * Order receipt, rendered on the server from the real order.
 *
 * Because the order is read from Stripe (or the order store) rather than from
 * client state, this page survives a refresh, a shared link and a redeploy —
 * all of which previously produced "No Order Found".
 */
export function OrderConfirmation({ order, locale }: { order: Order; locale: Locale }) {
  const t = getDictionary(locale);
  const price = (value: number) => formatCurrency(value, locale);

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="flex justify-center mb-8">
          <span className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
            <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
            <Sparkles
              className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse"
              aria-hidden="true"
            />
          </span>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl mb-4 italic">{t.checkout.thankYou}</h1>
        <p className="text-muted-foreground text-lg mb-4">{t.checkout.thankYouDesc}</p>

        {order.isDemo && (
          <Badge className="mb-8 bg-foreground/80 text-background border-none uppercase tracking-[0.2em] text-[10px] font-bold px-4 py-1.5 rounded-full">
            {t.checkout.demoOrderBadge}
          </Badge>
        )}

        <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 text-left mb-12 mt-4">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-primary/10 pb-6 mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                {t.checkout.orderNumber}
              </span>
              <span className="font-headline text-xl text-primary">{order.reference}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                {t.checkout.totalPaid}
              </span>
              <span className="font-headline text-xl">{price(order.total)}</span>
              <span className="block text-[10px] uppercase tracking-widest text-primary font-bold mt-1">
                {order.status === 'paid' ? t.checkout.orderStatusPaid : t.checkout.orderStatusPending}
              </span>
            </div>
          </div>

          <h2 className="font-headline text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" /> {t.checkout.orderSummary}
          </h2>

          <ul className="space-y-6 list-none">
            {order.lines.map((line) => (
              <li key={`${line.productId}-${line.isSubscription}`} className="flex gap-6 items-center">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-lg truncate">
                    <Link href={`/${locale}/products/${line.slug}`} className="hover:text-primary transition-colors">
                      {line.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {t.cart.quantity}: {line.quantity}
                    {line.isSubscription && ` · ${t.cart.subscription}`}
                  </p>
                </div>
                <div className="font-headline text-lg shrink-0">
                  {price(line.unitPrice * line.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-8 pt-6 border-t border-primary/10 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.cart.subtotal}</dt>
              <dd>{price(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.cart.shipping}</dt>
              <dd>{order.shipping === 0 ? t.cart.shippingFree : price(order.shipping)}</dd>
            </div>
            <div className="flex justify-between font-bold pt-2">
              <dt>{t.cart.total}</dt>
              <dd>{price(order.total)}</dd>
            </div>
          </dl>

          {order.shippingAddress && (
            <div className="mt-8 pt-6 border-t border-primary/10">
              <h3 className="font-headline text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {t.checkout.shippingTo}
              </h3>
              <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                {order.shippingAddress.name && <>{order.shippingAddress.name}<br /></>}
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                <br />
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
                <br />
                {order.shippingAddress.country}
              </address>
            </div>
          )}

          {order.email && (
            <p className="mt-6 text-xs text-muted-foreground italic">
              {t.checkout.emailHint} — {order.email}
            </p>
          )}
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
