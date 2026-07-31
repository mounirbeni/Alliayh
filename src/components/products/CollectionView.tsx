"use client";

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { DrawRule, MaskReveal, Reveal } from '@/components/motion/Editorial';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { formatCurrency } from '@/i18n/format';
import { SORT_OPTIONS, type CatalogFacets, type Product, type SortOption } from '@/lib/catalog';

export interface CollectionState {
  search: string;
  category: string;
  actives: string[];
  concerns: string[];
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  inStockOnly: boolean;
}

/**
 * Collection.
 *
 * Filtering still lives entirely in the URL — that architecture was right and
 * is untouched. What changed is the surface: the popover-and-pill control bar
 * became a ruled filter rail, categories read as a printed index with counts,
 * and the refinement panel expands inline instead of floating over the grid.
 */
export function CollectionView({
  products,
  facets,
  state,
  total,
}: {
  products: Product[];
  facets: CatalogFacets;
  state: CollectionState;
  total: number;
}) {
  const { dictionary: t, locale } = useLocaleStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);

  const setParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) continue;
        if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
        else params.set(key, value);
      }

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const toggleIn = (values: string[], value: string) =>
    values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];

  const sortLabels: Record<SortOption, string> = {
    featured: t.productsPage.featured,
    'price-low': t.productsPage.priceLowToHigh,
    'price-high': t.productsPage.priceHighToLow,
    rating: t.productsPage.topRated,
    name: t.productsPage.nameAZ,
  };

  const chips = useMemo(() => {
    const out: { key: string; label: string; clear: () => void }[] = [];

    state.actives.forEach((value) => {
      const facet = facets.actives.find((entry) => entry.value === value);
      if (facet) {
        out.push({
          key: `a-${value}`,
          label: facet.label,
          clear: () => setParams({ active: toggleIn(state.actives, value) }),
        });
      }
    });
    state.concerns.forEach((value) => {
      const facet = facets.concerns.find((entry) => entry.value === value);
      if (facet) {
        out.push({
          key: `c-${value}`,
          label: facet.label,
          clear: () => setParams({ concern: toggleIn(state.concerns, value) }),
        });
      }
    });
    if (state.minPrice || state.maxPrice) {
      out.push({
        key: 'price',
        label: `${state.minPrice || facets.priceRange.min}–${state.maxPrice || facets.priceRange.max} ${t.common.currency}`,
        clear: () => setParams({ min: null, max: null }),
      });
    }
    if (state.inStockOnly) {
      out.push({ key: 'stock', label: t.productsPage.inStockOnly, clear: () => setParams({ stock: null }) });
    }
    return out;
  }, [state, facets, setParams, t]);

  const clearAll = () =>
    setParams({ q: null, category: null, active: null, concern: null, min: null, max: null, stock: null, sort: null });

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <header className="shell pt-[clamp(2rem,5vw,5rem)] pb-10">
        <p className="label text-foreground/45">{t.productsPage.metaTitle.split('|')[0]?.trim()}</p>
        {/*
          The size lives on the <h1>, not on the mask inside it. `ch` and every
          other measure on this element resolve against its own font-size — with
          the size one level down, `max-w-[16ch]` was 16 characters of *body*
          type, roughly 160px, and the display-size title wrapped into a column
          seven lines tall.
        */}
        <h1 className="mt-5 max-w-[14ch] font-display text-display-lg tracking-tightest">
          <MaskReveal>{t.productsPage.title}</MaskReveal>
        </h1>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-prose text-lede text-foreground/60">{t.productsPage.subtitle}</p>
        </Reveal>
      </header>

      {/* ── Filter rail ──────────────────────────────────────────────── */}
      <div className="sticky top-[var(--header-height)] z-30 bg-background/95 backdrop-blur-md">
        <DrawRule />

        <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
          {/* Categories, as a printed index */}
          <nav aria-label={t.productsPage.categories} className="scrollbar-hide -mx-1 flex max-w-full items-center gap-6 overflow-x-auto px-1">
            <button
              type="button"
              onClick={() => setParams({ category: null })}
              data-active={state.category === 'all'}
              className={cn(
                'label link-underline whitespace-nowrap py-1 transition-opacity',
                state.category === 'all' ? 'text-primary' : 'text-foreground/60 hover:opacity-70',
              )}
            >
              {t.productsPage.all}
              <span className="ml-1.5 tabular opacity-45">{total}</span>
            </button>

            {facets.categories.map((facet) => (
              <button
                key={facet.value}
                type="button"
                onClick={() => setParams({ category: facet.value })}
                data-active={state.category === facet.value}
                className={cn(
                  'label link-underline whitespace-nowrap py-1 transition-opacity',
                  state.category === facet.value ? 'text-primary' : 'text-foreground/60 hover:opacity-70',
                )}
              >
                {facet.label}
                <span className="ml-1.5 tabular opacity-45">{facet.count}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setPanelOpen((open) => !open)}
              aria-expanded={panelOpen}
              aria-controls="filter-panel"
              className="label link-underline py-1 text-foreground/60 transition-opacity hover:opacity-70"
            >
              {t.productsPage.filters}
              {chips.length > 0 && <span className="ml-1.5 tabular text-primary">({chips.length})</span>}
            </button>

            <label className="label flex items-center gap-2 text-foreground/60">
              <span className="sr-only sm:not-sr-only">{t.productsPage.sortBy}</span>
              <select
                aria-label={t.a11y.sortResults}
                value={state.sort}
                onChange={(e) => setParams({ sort: e.target.value === 'featured' ? null : e.target.value })}
                className="label cursor-pointer border-0 bg-transparent py-1 pr-5 text-foreground focus:outline-none focus-visible:underline"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option} className="font-body normal-case tracking-normal">
                    {sortLabels[option]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Inline refinement panel — expands in place rather than floating. */}
        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.div
              id="filter-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rule-t"
            >
              <div className="shell grid grid-cols-1 gap-x-12 gap-y-10 py-10 md:grid-cols-3">
                <fieldset>
                  <legend className="label text-foreground/45">{t.productsPage.keyIngredients}</legend>
                  <ul className="mt-5 space-y-2.5">
                    {facets.actives.map((facet) => {
                      const on = state.actives.includes(facet.value);
                      return (
                        <li key={facet.value}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setParams({ active: toggleIn(state.actives, facet.value) })}
                            className="group flex w-full items-center gap-3 text-left text-body-sm"
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                'flex h-4 w-4 shrink-0 items-center justify-center border transition-colors',
                                on ? 'border-primary bg-primary text-primary-foreground' : 'border-rule',
                              )}
                            >
                              {on && <Check className="h-3 w-3" />}
                            </span>
                            <span className={cn('flex-1', on ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground')}>
                              {facet.label}
                            </span>
                            <span className="tabular text-label text-foreground/35">{facet.count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                <fieldset>
                  <legend className="label text-foreground/45">{t.productsPage.concerns}</legend>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
                    {facets.concerns.map((facet) => {
                      const on = state.concerns.includes(facet.value);
                      return (
                        <li key={facet.value}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setParams({ concern: toggleIn(state.concerns, facet.value) })}
                            className={cn(
                              'link-underline text-body-sm transition-colors',
                              on ? 'text-primary' : 'text-foreground/65 hover:text-foreground',
                            )}
                            data-active={on}
                          >
                            {facet.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                <fieldset>
                  <legend className="label text-foreground/45">{t.productsPage.priceRange}</legend>
                  <div className="mt-5 flex items-center gap-4">
                    <input
                      type="number"
                      inputMode="numeric"
                      aria-label={t.productsPage.min}
                      placeholder={String(facets.priceRange.min)}
                      defaultValue={state.minPrice}
                      onChange={(e) => setParams({ min: e.target.value })}
                      className="tabular w-full border-0 border-b border-rule bg-transparent pb-2 text-body-md focus:border-primary focus:outline-none"
                    />
                    <span aria-hidden="true" className="text-foreground/35">—</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      aria-label={t.productsPage.max}
                      placeholder={String(facets.priceRange.max)}
                      defaultValue={state.maxPrice}
                      onChange={(e) => setParams({ max: e.target.value })}
                      className="tabular w-full border-0 border-b border-rule bg-transparent pb-2 text-body-md focus:border-primary focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    aria-pressed={state.inStockOnly}
                    onClick={() => setParams({ stock: state.inStockOnly ? null : '1' })}
                    className="group mt-6 flex items-center gap-3 text-body-sm"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center border transition-colors',
                        state.inStockOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-rule',
                      )}
                    >
                      {state.inStockOnly && <Check className="h-3 w-3" />}
                    </span>
                    <span className={state.inStockOnly ? 'text-primary' : 'text-foreground/70'}>
                      {t.productsPage.inStockOnly}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="label link-underline mt-8 block text-foreground/45 hover:text-primary"
                  >
                    {t.productsPage.clearAllFilters}
                  </button>
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DrawRule />
      </div>

      {/* ── Applied refinements + count ──────────────────────────────── */}
      <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.clear}
                aria-label={`${t.productsPage.removeFilter}: ${chip.label}`}
                className="group inline-flex items-center gap-2 label text-primary"
              >
                {chip.label}
                <X className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <p className="label tabular text-foreground/45" aria-live="polite">
          {products.length} / {total}
        </p>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className={cn('shell pb-[clamp(4rem,9vw,9rem)] transition-opacity duration-300', isPending && 'opacity-40')}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-28 text-center">
            <Search className="h-8 w-8 text-primary/25" aria-hidden="true" />
            <h2 className="font-display text-display-sm tracking-editorial">{t.productsPage.noProducts}</h2>
            <p className="max-w-prose text-body-md text-foreground/55">{t.productsPage.noProductsDesc}</p>
            <button type="button" onClick={clearAll} className="label link-underline mt-2 text-primary">
              {t.productsPage.clearAllFilters}
            </button>
          </div>
        ) : (
          /*
           * Two columns, not three. The house carries four products: a 3-up grid
           * put three on one row and stranded the fourth beside two thirds of
           * empty page. Two large plates per row stays balanced for any even
           * catalogue and gives the photography room to be looked at.
           */
          <div className="grid grid-cols-1 gap-x-12 gap-y-20 sm:grid-cols-2">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i, 5) * 0.06} className="h-full">
                <ProductCard product={product} index={i} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="sr-only">
          {t.productsPage.showing} {products.length} {t.productsPage.of} {total} {t.productsPage.products}.{' '}
          {formatCurrency(facets.priceRange.min, locale)} – {formatCurrency(facets.priceRange.max, locale)}
        </p>
      </div>
    </>
  );
}
