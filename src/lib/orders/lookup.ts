import 'server-only';
import { getStripe, isStripeConfigured } from '@/lib/stripe/server';
import { orderFromSession } from './from-session';
import { orderStore } from './store';
import type { Order } from './types';

/**
 * Read an order for the confirmation page.
 *
 * Order of resolution matters. The customer is redirected back from Stripe the
 * instant payment succeeds, which is routinely *before* the webhook arrives —
 * so reading only from our own store would show "no order found" to someone who
 * just paid. Stripe is therefore consulted as the fallback, and it is also the
 * recovery path after a restart clears the in-memory store.
 */
export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  if (!sessionId || sessionId.length > 200) return null;

  const stored = await orderStore.get(sessionId);
  if (stored) return stored;

  // Demo sessions only ever live in the store; never ask Stripe about them.
  if (sessionId.startsWith('demo_') || !isStripeConfigured()) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return null;
    return orderFromSession(session);
  } catch (error) {
    console.error('[orders] could not retrieve session:', error);
    return null;
  }
}
