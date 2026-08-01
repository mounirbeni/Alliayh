"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/i18n/format';
import type { Product } from '@/lib/catalog';

/**
 * ProductCard — an apothecary specimen plate.
 *
 * The previous card was a soft white box: 2.5rem radius, drop shadow, a badge
 * cluster, a floating pill button. Six of those in a grid read as a template.
 *
 * This one has no box at all. The image sits in a hairline-ruled frame, the
 * second gallery image wipes across on hover via clip-path rather than a
 * cross-fade, and the metadata sets like a catalogue entry: index numeral,
 * rule, name, price. Restraint is what makes it look expensive.
 */
interface ProductCardProps {
  product: Product;
  /** Catalogue index, rendered as 01 / 02 / 03. */
  index?: number;
  className?: string;
  /** Set on above-the-fold cards so the first paint is not lazy. */
  priority?: boolean;
  /**
   * Smaller metadata, for rails where several cards share a column and the
   * display-size name of the full card would tower over its own photograph.
   */
  compact?: boolean;
}

export function ProductCard({
  product,
  index,
  className,
  priority = false,
  compact = false,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { dictionary: t, locale } = useLocaleStore();
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const isSaved = wishlistItems.includes(product.id);
  const second = product.images[1];
  const active = hovered && !reduce;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    addItem(product, 1);
    openCart();
    toast({
      title: t.product.addedToBag,
      description: `${product.name} ${t.product.addedDesc}`,
      duration: 3000,
    });
  };

  return (
    <article
      /* `h-full` so `mt-auto` on the price row has a full-height box to push
         against — grid items stretch, but the animation wrapper in between does
         not pass that height down on its own. */
      className={cn('group relative flex h-full flex-col', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Plate */}
      {/*
        The plate is padded and the photograph is *contained*, not cropped.
        These are packshots on a white sweep: `object-cover` in a tall frame was
        slicing the top off every jar and the bottom off every pouch, which is
        the fastest way to make a catalogue look careless.
      */}
      <div className="relative aspect-square overflow-hidden rule-t rule-b rule-l rule-r bg-white p-6">
        <Link href={product.href} className="absolute inset-0 z-0" tabIndex={-1} aria-hidden="true">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className={cn(
              'object-contain duotone transition-transform duration-1200 ease-editorial',
              active && 'scale-[1.04]',
              !product.inStock && 'opacity-55 grayscale',
            )}
          />

          {/*
            Second image wipes in from the bottom. A clip-path reveal reads as
            deliberate; a cross-fade reads as an accident of two stacked images.
          */}
          {second && (
            <span
              aria-hidden="true"
              className="absolute inset-0 block transition-[clip-path] duration-900 ease-wipe"
              style={{ clipPath: active ? 'inset(0 0 0% 0)' : 'inset(100% 0 0 0)' }}
            >
              <Image
                src={second.src}
                alt=""
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                className="object-contain duotone"
              />
            </span>
          )}
        </Link>

        {/* Index numeral, top-left inside the plate. */}
        {index !== undefined && (
          <span
            aria-hidden="true"
            className="numeral pointer-events-none absolute left-4 top-3 z-10 text-label text-foreground/40 mix-blend-multiply dark:mix-blend-normal dark:text-background/60"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {/* Status — a single word, no badge chrome. */}
        {!product.inStock && (
          <span className="label-sm absolute right-4 top-3 z-10 text-foreground/60">
            {t.product.outOfStock}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? t.product.removeFromWishlist : t.product.addToWishlist}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center opacity-0 transition-opacity duration-400 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Heart
            aria-hidden="true"
            className={cn(
              'h-4 w-4 transition-all duration-300',
              isSaved ? 'fill-primary text-primary' : 'text-foreground/70',
            )}
          />
        </button>
      </div>

      {/* Catalogue entry */}
      <div className="flex flex-1 flex-col pt-4">
        <p className="label-sm text-foreground/45">{product.categoryLabel}</p>

        <h3
          className={cn(
            'mt-2 font-display tracking-editorial',
            compact ? 'text-body-lg leading-snug' : 'text-display-xs leading-[1.08]',
          )}
        >
          <Link href={product.href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>

        <p
          className={cn(
            'mt-2 line-clamp-2 max-w-[42ch] text-foreground/55',
            compact ? 'text-[0.8125rem] leading-snug' : 'text-body-sm',
          )}
        >
          {product.tagline}
        </p>

        {/*
          `mt-auto` pins the price row to the bottom of the card. Without it the
          row sat directly under the tagline, so a two-line product name pushed
          one card's rule 40px below its neighbours' and the grid read as ragged.
        */}
        <div
          className={cn(
            'mt-auto flex items-end justify-between gap-4 rule-t',
            compact ? 'pt-3' : 'pt-4',
          )}
        >
          <p
            className={cn(
              'tabular font-display text-primary',
              compact ? 'text-body-md' : 'text-body-lg',
            )}
          >
            {formatCurrency(product.price, locale)}
            {product.compareAtPrice && (
              <span className="ml-2 align-middle text-body-sm text-foreground/40 line-through">
                {formatCurrency(product.compareAtPrice, locale)}
              </span>
            )}
          </p>

          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`${t.product.addToBag}: ${product.name}`}
            whileHover={reduce ? undefined : { scale: 1.08 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            className="relative z-10 -mr-2 -mb-1 flex h-11 w-11 items-center justify-center text-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </article>
  );
}
