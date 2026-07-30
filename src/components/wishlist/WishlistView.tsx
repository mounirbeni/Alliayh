"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import type { Product } from '@/lib/catalog';

/**
 * Saved products.
 *
 * The catalog now arrives from the server already resolved for the locale; the
 * page only decides which of those ids the visitor saved. That removes a
 * bespoke card implementation that duplicated `ProductCard` badly — it had no
 * stock state, no rating and no keyboard-reachable add-to-bag.
 */
export function WishlistView({ products }: { products: Product[] }) {
  const savedIds = useWishlistStore((state) => state.items);
  const { dictionary: t, locale } = useLocaleStore();

  const saved = products.filter((product) => savedIds.includes(product.id));

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-headline text-4xl md:text-5xl mb-12 uppercase tracking-widest text-center">
          {t.wishlistPage.title}
        </h1>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white/50 dark:bg-black/20 rounded-[3rem] border border-primary/10 text-center">
            <span className="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
              <Heart className="h-10 w-10 fill-current" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-headline mb-4 uppercase tracking-widest">
              {t.wishlistPage.empty}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md italic">{t.wishlistPage.emptyDesc}</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 px-8 uppercase tracking-widest text-[10px] font-bold h-14"
            >
              <Link href={`/${locale}/products`}>{t.wishlistPage.exploreCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saved.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
