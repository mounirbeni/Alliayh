import 'server-only';
import { getProducts, type Product } from '@/lib/catalog';
import type { Locale } from '@/i18n';
import { inventoryStore } from './store';

/**
 * Live availability = declared stock − units already sold.
 *
 * The catalog declares stock as a constant in source, which is fine as an
 * opening figure but cannot represent what is left after trading. This joins
 * the two so the shop stops selling a product once it is actually gone.
 *
 * **Fails soft by design.** If the database is unreachable, this returns the
 * catalog's declared stock rather than throwing. The alternative was worse: a
 * transient outage — or simply building in an environment that cannot reach the
 * database — took down every product page, even though the catalog itself needs
 * no database to render. Checkout still re-checks stock before taking money,
 * and the Stripe webhook is the authority on what actually sold, so the failure
 * mode here is "may briefly offer something low on stock", not "may oversell
 * silently".
 */
/**
 * How long to stop trying after a failure. Long enough that one outage cannot
 * stall a whole prerender pass, short enough that the shop recovers on its own
 * within a page's cache lifetime.
 */
const CIRCUIT_COOLDOWN_MS = 30_000;

/** Upper bound per attempt, whatever the driver decides to do. */
const QUERY_TIMEOUT_MS = 4_000;

/** Successful reads are shared briefly so one page render is one query. */
const RESULT_TTL_MS = 2_000;

let circuitOpenUntil = 0;
let inflight: Promise<Record<string, number>> | null = null;
let cached: { at: number; value: Record<string, number> } | null = null;

async function readSold(): Promise<Record<string, number>> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      inventoryStore.soldQuantities(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('inventory read timed out')), QUERY_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function getAvailability(): Promise<Record<string, number>> {
  const declared = Object.fromEntries(
    getProducts('pt').map((product) => [product.id, product.stock]),
  );

  const now = Date.now();

  /*
   * Circuit breaker. Without it an unreachable database cost every single page
   * its own connection attempt and its own timeout — enough to blow the 60s
   * per-page budget and abort a production build, even though the catalog
   * needs no database at all to render. After one failure the rest of the pass
   * short-circuits to declared stock immediately.
   */
  if (now < circuitOpenUntil) return declared;
  if (cached && now - cached.at < RESULT_TTL_MS) return cached.value;

  let soldByProduct: Record<string, number>;
  try {
    // Concurrent callers share one read rather than opening a connection each.
    inflight ??= readSold();
    soldByProduct = await inflight;
  } catch (error) {
    circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    console.error('[inventory] unavailable, falling back to declared stock:', error);
    return declared;
  } finally {
    inflight = null;
  }

  const availability: Record<string, number> = {};
  for (const [productId, stock] of Object.entries(declared)) {
    availability[productId] = Math.max(0, stock - (soldByProduct[productId] ?? 0));
  }

  cached = { at: Date.now(), value: availability };
  return availability;
}

/** Products with `stock` and `inStock` reflecting what is genuinely left. */
export async function getLiveProducts(locale: Locale): Promise<Product[]> {
  const availability = await getAvailability();

  return getProducts(locale).map((product) => {
    const stock = availability[product.id] ?? product.stock;
    return { ...product, stock, inStock: stock > 0 };
  });
}

export async function getLiveProduct(
  idOrSlug: string,
  locale: Locale,
): Promise<Product | undefined> {
  const products = await getLiveProducts(locale);
  return products.find((product) => product.slug === idOrSlug || product.id === idOrSlug);
}
