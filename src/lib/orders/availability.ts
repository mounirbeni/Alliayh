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
export async function getAvailability(): Promise<Record<string, number>> {
  const declared = Object.fromEntries(
    getProducts('pt').map((product) => [product.id, product.stock]),
  );

  let soldByProduct: Record<string, number>;
  try {
    soldByProduct = await inventoryStore.soldQuantities();
  } catch (error) {
    console.error('[inventory] unavailable, falling back to declared stock:', error);
    return declared;
  }

  const availability: Record<string, number> = {};
  for (const [productId, stock] of Object.entries(declared)) {
    availability[productId] = Math.max(0, stock - (soldByProduct[productId] ?? 0));
  }

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
