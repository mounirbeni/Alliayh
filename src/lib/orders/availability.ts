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
 */
export async function getAvailability(): Promise<Record<string, number>> {
  const soldByProduct = await inventoryStore.soldQuantities();
  const availability: Record<string, number> = {};

  for (const product of getProducts('pt')) {
    const sold = soldByProduct[product.id] ?? 0;
    availability[product.id] = Math.max(0, product.stock - sold);
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
