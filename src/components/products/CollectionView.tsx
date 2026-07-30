"use client";

import { useCallback, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/products/ProductCard';
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
 * Collection controls + grid.
 *
 * Filtering is driven entirely by the URL. Previously the entire page was a
 * client component holding filter state in `useState`, which meant a filtered
 * view could not be linked, bookmarked, shared or indexed — and the browser
 * back button skipped straight past every refinement the customer had made.
 * Now each control writes a query parameter and the server re-renders the
 * matching set.
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

  /** Write (or clear) query params without adding a history entry per keystroke. */
  const setParams = useCallback(
    (updates: Record<string, string | string[] | null>, replace = true) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) continue;
        if (Array.isArray(value)) {
          value.forEach((entry) => params.append(key, entry));
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();
      startTransition(() => {
        const url = query ? `${pathname}?${query}` : pathname;
        if (replace) router.replace(url, { scroll: false });
        else router.push(url, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const toggleInArray = (values: string[], value: string) =>
    values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];

  const sortLabels: Record<SortOption, string> = {
    featured: t.productsPage.featured,
    'price-low': t.productsPage.priceLowToHigh,
    'price-high': t.productsPage.priceHighToLow,
    rating: t.productsPage.topRated,
    name: t.productsPage.nameAZ,
  };

  /** Every refinement currently applied, as removable chips. */
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];

    if (state.category !== 'all') {
      const facet = facets.categories.find((entry) => entry.value === state.category);
      if (facet) {
        chips.push({
          key: `category-${facet.value}`,
          label: facet.label,
          clear: () => setParams({ category: null }),
        });
      }
    }
    state.actives.forEach((value) => {
      const facet = facets.actives.find((entry) => entry.value === value);
      if (facet) {
        chips.push({
          key: `active-${value}`,
          label: facet.label,
          clear: () => setParams({ active: toggleInArray(state.actives, value) }),
        });
      }
    });
    state.concerns.forEach((value) => {
      const facet = facets.concerns.find((entry) => entry.value === value);
      if (facet) {
        chips.push({
          key: `concern-${value}`,
          label: facet.label,
          clear: () => setParams({ concern: toggleInArray(state.concerns, value) }),
        });
      }
    });
    if (state.minPrice || state.maxPrice) {
      chips.push({
        key: 'price',
        label: `${state.minPrice || facets.priceRange.min} – ${state.maxPrice || facets.priceRange.max} ${t.common.currency}`,
        clear: () => setParams({ min: null, max: null }),
      });
    }
    if (state.inStockOnly) {
      chips.push({
        key: 'stock',
        label: t.productsPage.inStockOnly,
        clear: () => setParams({ stock: null }),
      });
    }
    return chips;
  }, [state, facets, setParams, t]);

  const clearAll = () =>
    setParams({ q: null, category: null, active: null, concern: null, min: null, max: null, stock: null, sort: null });

  return (
    <>
      <div className="py-12 bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="font-headline text-5xl md:text-6xl tracking-tight">{t.productsPage.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto italic">{t.productsPage.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8">
          <div className="relative w-full lg:max-w-md">
            <label htmlFor="collection-search" className="sr-only">
              {t.productsPage.searchPlaceholder}
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="collection-search"
              type="search"
              placeholder={t.productsPage.searchPlaceholder}
              className="pl-12 h-14 bg-white dark:bg-black/20 rounded-full border-primary/20 shadow-sm text-sm focus:border-primary"
              defaultValue={state.search}
              onChange={(e) => setParams({ q: e.target.value })}
            />
          </div>

          <div className="flex overflow-x-auto w-full lg:w-auto items-center gap-4 snap-x pb-2 lg:pb-0 scrollbar-hide">
            <Tabs
              value={state.category}
              onValueChange={(value) => setParams({ category: value === 'all' ? null : value })}
              className="w-auto"
            >
              <TabsList className="bg-white dark:bg-black/20 border border-primary/10 rounded-full h-14 px-2 shadow-sm">
                <TabsTrigger
                  value="all"
                  className="rounded-full px-4 sm:px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white font-headline uppercase tracking-widest text-[10px] sm:text-xs"
                >
                  {t.productsPage.all}
                </TabsTrigger>
                {/* Categories come from the catalog, so a tab can never point at
                    an empty result set the way the hard-coded list did. */}
                {facets.categories.map((facet) => (
                  <TabsTrigger
                    key={facet.value}
                    value={facet.value}
                    className="rounded-full px-4 sm:px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white font-headline uppercase tracking-widest text-[10px] sm:text-xs"
                  >
                    {facet.label}
                    <span className="ml-1.5 opacity-50">{facet.count}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Advanced Filters Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-12 p-6 bg-white dark:bg-black/20 border border-primary/10 rounded-[2rem] shadow-sm overflow-hidden w-full">
          <div className="flex overflow-x-auto w-full snap-x pb-2 lg:pb-0 lg:flex-wrap items-center gap-4 scrollbar-hide">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-primary/20 hover:border-primary px-6 flex gap-2 uppercase tracking-widest text-xs font-bold shrink-0"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  {t.productsPage.filters}
                  {activeChips.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center border-none">
                      {activeChips.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6 rounded-[2rem] border-primary/10 shadow-xl" align="start">
                <div className="space-y-6">
                  <h2 className="font-headline uppercase tracking-widest text-sm border-b border-primary/10 pb-2">
                    {t.productsPage.filterOptions}
                  </h2>

                  {/* Price Range */}
                  <fieldset className="space-y-4">
                    <legend className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {t.productsPage.priceRange}
                    </legend>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                          {t.common.currency}
                        </span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={facets.priceRange.min}
                          max={facets.priceRange.max}
                          aria-label={t.productsPage.min}
                          placeholder={String(facets.priceRange.min)}
                          className="pl-6 h-10 rounded-xl"
                          defaultValue={state.minPrice}
                          onChange={(e) => setParams({ min: e.target.value })}
                        />
                      </div>
                      <span className="text-muted-foreground" aria-hidden="true">–</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                          {t.common.currency}
                        </span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={facets.priceRange.min}
                          max={facets.priceRange.max}
                          aria-label={t.productsPage.max}
                          placeholder={String(facets.priceRange.max)}
                          className="pl-6 h-10 rounded-xl"
                          defaultValue={state.maxPrice}
                          onChange={(e) => setParams({ max: e.target.value })}
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Key actives — derived from the catalog */}
                  <fieldset className="space-y-3">
                    <legend className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {t.productsPage.keyIngredients}
                    </legend>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {facets.actives.map((facet) => (
                        <label
                          key={facet.value}
                          className="flex items-center gap-3 text-sm cursor-pointer py-1"
                        >
                          <Checkbox
                            checked={state.actives.includes(facet.value)}
                            onCheckedChange={() =>
                              setParams({ active: toggleInArray(state.actives, facet.value) })
                            }
                          />
                          <span className="flex-1">{facet.label}</span>
                          <span className="text-muted-foreground text-xs">{facet.count}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Concerns */}
                  <fieldset className="space-y-3">
                    <legend className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {t.productsPage.concerns}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {facets.concerns.map((facet) => (
                        <button
                          key={facet.value}
                          type="button"
                          aria-pressed={state.concerns.includes(facet.value)}
                          onClick={() => setParams({ concern: toggleInArray(state.concerns, facet.value) })}
                          className={cn(
                            'px-3 py-1.5 rounded-full border text-[11px] transition-colors',
                            state.concerns.includes(facet.value)
                              ? 'bg-primary text-white border-primary'
                              : 'border-primary/20 hover:border-primary',
                          )}
                        >
                          {facet.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <Checkbox
                      checked={state.inStockOnly}
                      onCheckedChange={(checked) => setParams({ stock: checked ? '1' : null })}
                    />
                    {t.productsPage.inStockOnly}
                  </label>

                  <Button
                    variant="ghost"
                    onClick={clearAll}
                    className="w-full rounded-full uppercase tracking-widest text-[10px] font-bold"
                  >
                    {t.productsPage.clearAllFilters}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Active filter chips */}
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                aria-label={`${t.productsPage.removeFilter}: ${chip.label}`}
                className="shrink-0 h-12 pl-5 pr-3 rounded-full border border-primary/20 bg-primary/5 text-primary flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-colors"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold whitespace-nowrap" aria-live="polite">
              {t.productsPage.showing} {products.length} {t.productsPage.of} {total}
            </span>
            <Select
              value={state.sort}
              onValueChange={(value) => setParams({ sort: value === 'featured' ? null : value })}
            >
              <SelectTrigger
                aria-label={t.a11y.sortResults}
                className="h-12 w-[190px] rounded-full border-primary/20 uppercase tracking-widest text-[10px] font-bold"
              >
                <SelectValue placeholder={t.productsPage.sortBy} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs uppercase tracking-widest">
                    {sortLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className={cn('transition-opacity duration-200', isPending && 'opacity-50')}>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
              <Search className="h-12 w-12 text-primary/20" aria-hidden="true" />
              <div className="space-y-2 max-w-md">
                <h2 className="font-headline text-2xl">{t.productsPage.noProducts}</h2>
                <p className="text-muted-foreground italic text-sm">{t.productsPage.noProductsDesc}</p>
              </div>
              <Button
                onClick={clearAll}
                className="rounded-full bg-primary uppercase tracking-widest text-[10px] font-bold h-12 px-8"
              >
                {t.productsPage.clearAllFilters}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          )}
        </div>

        {isPending && (
          <span className="sr-only" role="status">
            <Loader2 aria-hidden="true" /> {t.common.loading}
          </span>
        )}

        <p className="sr-only">
          {t.productsPage.showing} {products.length} {t.productsPage.of} {total}{' '}
          {t.productsPage.products}. {formatCurrency(facets.priceRange.min, locale)} –{' '}
          {formatCurrency(facets.priceRange.max, locale)}
        </p>
      </div>
    </>
  );
}
