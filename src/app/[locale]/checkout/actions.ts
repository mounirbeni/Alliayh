'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import type Stripe from 'stripe';
import { LOCALES, type Locale } from '@/i18n';
import { getProduct } from '@/lib/catalog';
import { getAvailability } from '@/lib/orders/availability';
import { generateOrderReference, orderStore } from '@/lib/orders/store';
import type { Order, OrderLine } from '@/lib/orders/types';
import { getStripe, isStripeConfigured, toMinorUnits } from '@/lib/stripe/server';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from '@/lib/pricing';
import { SITE, absoluteUrl } from '@/lib/site';

/**
 * Checkout.
 *
 * The security property that matters here: **the client never states a price.**
 * It sends product ids and quantities; the server rebuilds every line from the
 * catalog, re-checks stock, and hands Stripe the amounts it computed itself.
 * The previous implementation rendered a totals block from client state and a
 * fake card form — a customer could have edited either.
 */

/** The only thing the browser is trusted to send. */
const CheckoutRequestSchema = z.object({
  locale: z.enum(LOCALES),
  email: z.string().email().max(320).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(99),
        isSubscription: z.boolean().default(false),
      }),
    )
    .min(1)
    .max(50),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; reason: 'empty' | 'out_of_stock' | 'error'; unavailable?: string[] };

interface PricedLine extends OrderLine {
  /** Units the customer may still buy — used to report partial shortfalls. */
  available: number;
}

/** Rebuild every line from the catalog. Returns lines and anything unavailable. */
async function priceLines(
  request: CheckoutRequest,
): Promise<{ lines: PricedLine[]; unavailable: string[] }> {
  const availability = await getAvailability();
  const lines: PricedLine[] = [];
  const unavailable: string[] = [];

  for (const item of request.items) {
    const product = getProduct(item.productId, request.locale);
    if (!product) {
      unavailable.push(item.productId);
      continue;
    }

    const available = availability[product.id] ?? product.stock;
    if (available < item.quantity) {
      unavailable.push(product.name);
      continue;
    }

    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      // Price comes from the catalog, never from the request body.
      unitPrice: item.isSubscription ? product.subscriptionPrice : product.price,
      quantity: item.quantity,
      isSubscription: item.isSubscription,
      available,
    });
  }

  return { lines, unavailable };
}

function subtotalOf(lines: OrderLine[]): number {
  return Math.round(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) * 100) / 100;
}

function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

/** Countries we ship to, per the shipping policy. */
const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'LU', 'IE', 'AT', 'GB'];

/** Stripe expects its own locale codes. */
const STRIPE_LOCALE: Record<Locale, Stripe.Checkout.SessionCreateParams.Locale> = {
  pt: 'pt',
  en: 'en-GB',
};

export async function createCheckoutSession(input: unknown): Promise<CheckoutResult> {
  let request: CheckoutRequest;
  try {
    request = CheckoutRequestSchema.parse(input);
  } catch {
    return { ok: false, reason: 'error' };
  }

  const { lines, unavailable } = await priceLines(request);

  if (unavailable.length > 0) {
    return { ok: false, reason: 'out_of_stock', unavailable };
  }
  if (lines.length === 0) {
    return { ok: false, reason: 'empty' };
  }

  const subtotal = subtotalOf(lines);
  const shipping = shippingFor(subtotal);

  // No payment provider configured — record a clearly-flagged demo order so the
  // storefront remains walkable end to end instead of dead-ending.
  if (!isStripeConfigured()) {
    return createDemoOrder(request, lines, subtotal, shipping);
  }

  try {
    const stripe = getStripe();
    const origin = await resolveOrigin();

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        locale: STRIPE_LOCALE[request.locale],
        currency: SITE.currency.toLowerCase(),
        customer_email: request.email,
        // Stripe collects and validates the shipping address, which also gives
        // us address autocomplete and per-country formatting for free.
        shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
        billing_address_collection: 'auto',
        phone_number_collection: { enabled: false },
        line_items: lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: SITE.currency.toLowerCase(),
            unit_amount: toMinorUnits(line.unitPrice),
            product_data: {
              name: line.name,
              images: [absoluteUrl(line.image)],
              metadata: { productId: line.productId, slug: line.slug },
            },
          },
        })),
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              display_name:
                shipping === 0
                  ? `Standard — free over ${FREE_SHIPPING_THRESHOLD} ${SITE.currencySymbol}`
                  : 'Standard',
              fixed_amount: {
                amount: toMinorUnits(shipping),
                currency: SITE.currency.toLowerCase(),
              },
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 1 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
        ],
        // Everything the webhook needs to rebuild the order without trusting
        // the browser again.
        metadata: {
          locale: request.locale,
          reference: generateOrderReference(),
          lines: JSON.stringify(
            lines.map((line) => ({
              p: line.productId,
              q: line.quantity,
              s: line.isSubscription ? 1 : 0,
            })),
          ),
        },
        success_url: `${origin}/${request.locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${request.locale}/cart`,
        // Abandoned sessions stop holding a reference after 30 minutes.
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      // Guards against a double-click creating two sessions for one bag.
      { idempotencyKey: idempotencyKeyFor(request, subtotal) },
    );

    if (!session.url) return { ok: false, reason: 'error' };
    return { ok: true, redirectUrl: session.url };
  } catch (error) {
    console.error('[checkout] Stripe session creation failed:', error);
    return { ok: false, reason: 'error' };
  }
}

/** Stable per bag+customer within a short window, so retries collapse. */
function idempotencyKeyFor(request: CheckoutRequest, subtotal: number): string {
  const signature = request.items
    .map((item) => `${item.productId}x${item.quantity}${item.isSubscription ? 's' : ''}`)
    .sort()
    .join('|');
  const window = Math.floor(Date.now() / 60_000);
  return `checkout:${request.locale}:${request.email ?? 'guest'}:${signature}:${subtotal}:${window}`;
}

/** Prefer the configured canonical origin; fall back to the request host. */
async function resolveOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return SITE.url;

  const headerList = await headers();
  const host = headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : SITE.url;
}

/** Demo path: a real order record, explicitly marked as unpaid. */
async function createDemoOrder(
  request: CheckoutRequest,
  lines: PricedLine[],
  subtotal: number,
  shipping: number,
): Promise<CheckoutResult> {
  const sessionId = `demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  const order: Order = {
    reference: generateOrderReference(),
    sessionId,
    status: 'paid',
    email: request.email ?? null,
    locale: request.locale,
    currency: SITE.currency,
    lines: lines.map(({ available: _available, ...line }) => line),
    subtotal,
    shipping,
    total: Math.round((subtotal + shipping) * 100) / 100,
    shippingAddress: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };

  await orderStore.recordPaid(order);

  return {
    ok: true,
    redirectUrl: `/${request.locale}/checkout/success?session_id=${sessionId}`,
  };
}
