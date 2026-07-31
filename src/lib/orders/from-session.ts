import 'server-only';
import type Stripe from 'stripe';
import { toLocale } from '@/i18n';
import { getProduct } from '@/lib/catalog';
import { fromMinorUnits } from '@/lib/stripe/server';
import { generateOrderReference } from './store';
import type { Order, OrderLine } from './types';

/**
 * Build an `Order` from a Stripe Checkout Session.
 *
 * Line composition comes from the `lines` metadata we set when creating the
 * session — product ids and quantities only — and the names and images are
 * re-resolved from the catalog in the order's own locale. The money comes from
 * Stripe, which is the authority on what was actually charged.
 */
const LineMetadataShape = /^\[.*\]$/;

interface CompactLine {
  p: string;
  q: number;
  s: 0 | 1;
}

function parseLineMetadata(raw: string | undefined): CompactLine[] {
  if (!raw || !LineMetadataShape.test(raw)) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is CompactLine =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as CompactLine).p === 'string' &&
        typeof (entry as CompactLine).q === 'number',
    );
  } catch {
    return [];
  }
}

export function orderFromSession(session: Stripe.Checkout.Session): Order {
  const locale = toLocale(session.metadata?.locale);
  const compact = parseLineMetadata(session.metadata?.lines);

  const lines: OrderLine[] = compact.flatMap((entry) => {
    const product = getProduct(entry.p, locale);
    if (!product) return [];
    const isSubscription = entry.s === 1;
    return [
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        unitPrice: isSubscription ? product.subscriptionPrice : product.price,
        quantity: entry.q,
        isSubscription,
      },
    ];
  });

  const total = fromMinorUnits(session.amount_total ?? 0);
  const subtotal = fromMinorUnits(session.amount_subtotal ?? 0);
  const shipping = Math.round((total - subtotal) * 100) / 100;

  const address = session.collected_information?.shipping_details?.address ?? null;
  const recipient = session.collected_information?.shipping_details?.name ?? null;

  return {
    reference: session.metadata?.reference ?? generateOrderReference(),
    sessionId: session.id,
    // `paid` is the only status we record here; refunds and fulfilment arrive
    // through their own events.
    status: session.payment_status === 'paid' ? 'paid' : 'pending',
    email: session.customer_details?.email ?? null,
    locale,
    currency: (session.currency ?? 'eur').toUpperCase(),
    lines,
    subtotal,
    shipping: shipping > 0 ? shipping : 0,
    total,
    shippingAddress: address
      ? {
          name: recipient ?? undefined,
          line1: address.line1 ?? undefined,
          line2: address.line2 ?? undefined,
          city: address.city ?? undefined,
          postalCode: address.postal_code ?? undefined,
          country: address.country ?? undefined,
        }
      : null,
    createdAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
    isDemo: false,
  };
}
