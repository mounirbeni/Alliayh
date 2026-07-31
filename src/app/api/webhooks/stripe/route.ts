import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getWebhookSecret, isStripeConfigured } from '@/lib/stripe/server';
import { orderFromSession } from '@/lib/orders/from-session';
import { inventoryStore, orderStore } from '@/lib/orders/store';

/**
 * Stripe webhook.
 *
 * This is where an order becomes real. The browser is never trusted to report a
 * successful payment — the customer's return to `/checkout/success` is a
 * convenience, while *this* signed, server-to-server event is what records the
 * order and decrements stock.
 *
 * Requirements Stripe imposes and this handler honours:
 *  - the raw request body must be verified against the signature header, so it
 *    is read as text and never parsed first;
 *  - delivery is at-least-once, so `recordPaid` is idempotent and inventory is
 *    only touched when the order is genuinely new;
 *  - a non-2xx response triggers retries, so expected conditions return 200 and
 *    only real failures return 5xx.
 */

// Raw body access requires the Node runtime, not Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set — refusing unverified events');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    // A bad signature means the request did not come from Stripe. Never retry.
    console.error('[stripe-webhook] signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        await handleCompletedSession(event.data.object);
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        // Nothing was reserved, so there is nothing to release. Logged so an
        // abandoned-basket flow has something to hook into later.
        console.info('[stripe-webhook] session not completed:', event.data.object.id);
        break;
      }

      default:
        // Unhandled types are acknowledged rather than retried forever.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // Genuine processing failure: return 5xx so Stripe retries with backoff.
    console.error(`[stripe-webhook] failed to process ${event.type}:`, error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function handleCompletedSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') return;

  const order = orderFromSession(session);
  const { created } = await orderStore.recordPaid(order);

  // Only the first delivery of this event moves stock. A replay is a no-op.
  if (created) {
    await inventoryStore.recordSale(order.lines);
    console.info(`[stripe-webhook] recorded order ${order.reference} (${order.sessionId})`);
  }
}
