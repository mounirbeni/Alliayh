import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { CollectionView, type CollectionState } from '@/components/products/CollectionView';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary, isValidLocale } from '@/i18n';
import {
  ACTIVES,
  CONCERNS,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  getFacets,
  getProducts,
  queryProducts,
  type Active,
  type Concern,
  type ProductCategory,
  type SortOption,
} from '@/lib/catalog';
import { getAvailability } from '@/lib/orders/availability';
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from '@/lib/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return buildMetadata({
    locale,
    path: '/products',
    title: t.productsPage.metaTitle,
    description: t.productsPage.metaDescription,
  });
}

/** Read a query param that may legitimately repeat (`?active=a&active=b`). */
function readList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function readOne(value: string | string[] | undefined): string {
  if (!value) return '';
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

/**
 * Collection page.
 *
 * Filters live in the URL and are resolved on the server, so a filtered view is
 * shareable, crawlable and survives a page refresh. Unknown values are dropped
 * rather than trusted, which keeps a hand-edited query string from producing an
 * empty grid with no explanation.
 */
export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const query = await searchParams;
  const t = getDictionary(locale);

  const search = readOne(query.q);
  const categoryParam = readOne(query.category);
  const category = (PRODUCT_CATEGORIES as readonly string[]).includes(categoryParam)
    ? (categoryParam as ProductCategory)
    : 'all';
  const actives = readList(query.active).filter((value): value is Active =>
    (ACTIVES as readonly string[]).includes(value),
  );
  const concerns = readList(query.concern).filter((value): value is Concern =>
    (CONCERNS as readonly string[]).includes(value),
  );
  const sortParam = readOne(query.sort);
  const sort: SortOption = (SORT_OPTIONS as readonly string[]).includes(sortParam)
    ? (sortParam as SortOption)
    : 'featured';
  const minPrice = readOne(query.min);
  const maxPrice = readOne(query.max);
  const inStockOnly = readOne(query.stock) === '1';

  const availability = await getAvailability();
  const products = queryProducts(
    {
      search,
      category,
      actives,
      concerns,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
      inStockOnly,
    },
    locale,
    // Apply live stock after filtering so an item that just sold out still
    // appears — greyed and unbuyable — rather than vanishing mid-session.
  ).map((product) => {
    const stock = availability[product.id] ?? product.stock;
    return { ...product, stock, inStock: stock > 0 };
  });

  const state: CollectionState = {
    search,
    category,
    actives,
    concerns,
    minPrice,
    maxPrice,
    sort,
    inStockOnly,
  };

  const crumbs = [
    { name: t.common.home, path: `/${locale}` },
    { name: t.productsPage.title, path: `/${locale}/products` },
  ];

  return (
    <SiteShell>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          itemListJsonLd(products, t.productsPage.title),
        ]}
      />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={crumbs} label={t.a11y.breadcrumb} />
      </div>
      <CollectionView
        products={products}
        facets={getFacets(locale)}
        state={state}
        total={getProducts(locale).length}
      />
    </SiteShell>
  );
}
