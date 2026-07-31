import 'server-only';
import Stripe from 'stripe';

/**
 * Server-side Stripe client.
 *
 * Instantiated lazily so the module can be imported in environments without a
 * key — the store then runs in demo mode rather than crashing at boot. Never
 * import this from a Client Component: `server-only` turns that into a build
 * error instead of a leaked secret key.
 */

/**
 * Pinned so a Stripe API upgrade is a deliberate, reviewed change.
 *
 * This must match the version the installed SDK's types were generated against.
 * Casting an older string here would typecheck while the runtime talked to a
 * different API shape — response fields the types promise (`collected_information`,
 * for one) would simply be undefined. Bump this and the `stripe` dependency
 * together, never separately.
 */
const API_VERSION: Stripe.LatestApiVersion = '2026-07-29.dahlia';

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Checkout runs in demo mode; see .env.example.',
    );
  }

  if (!client) {
    client = new Stripe(secretKey, {
      apiVersion: API_VERSION,
      appInfo: { name: 'Lueur Skin', version: '1.0.0' },
      // Stripe's own retries, so a transient network blip does not become a
      // failed checkout for the customer.
      maxNetworkRetries: 2,
      timeout: 20_000,
    });
  }

  return client;
}

/**
 * Whether real payments are configured.
 *
 * When false the checkout deliberately falls back to a clearly labelled
 * simulated order, the same way the AI advisor falls back to deterministic
 * matching — a missing key degrades the feature, it does not break the site.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

/** Stripe works in minor units; our catalog is in euros. */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function fromMinorUnits(amount: number): number {
  return Math.round(amount) / 100;
}
