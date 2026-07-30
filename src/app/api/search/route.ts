import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/catalog';
import { toLocale } from '@/i18n';

/**
 * Product search endpoint.
 *
 * The navbar used to import the entire catalog into the client bundle just to
 * filter it in the browser — every visitor downloaded all product copy, in
 * every language, on every page, to serve a search overlay most never open.
 * Searching on the server keeps the payload proportional to the query.
 */
const MAX_RESULTS = 8;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').slice(0, 100);
  const locale = toLocale(searchParams.get('locale'));

  const results = searchProducts(query, locale, MAX_RESULTS).map((product) => ({
    id: product.id,
    name: product.name,
    categoryLabel: product.categoryLabel,
    price: product.price,
    image: product.image,
    imageAlt: product.imageAlt,
    href: product.href,
    inStock: product.inStock,
  }));

  return NextResponse.json(
    { query, results },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
