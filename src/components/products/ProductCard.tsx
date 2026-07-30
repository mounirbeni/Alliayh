"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Plus, Eye, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/i18n/format';
import type { Product } from '@/lib/catalog';

/**
 * ProductCard — premium hover treatment, unchanged visually.
 *
 * What changed underneath:
 *   - the secondary "texture" image comes from the product's own gallery
 *     instead of a hand-maintained id→file map that silently broke whenever a
 *     product was added or reordered;
 *   - out-of-stock products are shown as such and cannot be added to the bag;
 *   - the wishlist toggle is a real toggle button with `aria-pressed`.
 */
interface ProductCardProps {
  product: Product;
  className?: string;
  /** Set on above-the-fold cards so the first paint is not lazy. */
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { dictionary: t, locale } = useLocaleStore();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = wishlistItems.includes(product.id);
  const textureImage = product.images[1];

  const handleAddToCart = (e: React.MouseEvent) => {
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
    <motion.article
      className={cn(
        'group relative flex flex-col bg-white dark:bg-black/20 rounded-[2.5rem] overflow-hidden border border-primary/5 min-w-0',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={
        reduceMotion
          ? undefined
          : { scale: 1.02, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } }
      }
      style={{
        boxShadow: isHovered
          ? '0 30px 80px -15px rgba(120, 20, 48, 0.15), 0 0 60px -20px rgba(244, 203, 231, 0.3)'
          : '0 4px 20px -5px rgba(120, 20, 48, 0.05)',
        transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.4, 0.25, 1)',
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden m-3 md:m-4 rounded-[2rem] block shrink-0">
        <Link href={product.href} className="absolute inset-0 z-0 block" tabIndex={-1} aria-hidden="true">
          {/* Primary Image */}
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'object-cover w-full h-full transition-transform [transition-duration:2000ms] ease-out group-hover:scale-110',
              !product.inStock && 'grayscale-[35%]',
            )}
          />

          {/* Secondary Texture Image — fades in on hover */}
          {textureImage && (
            <span
              className={cn(
                'absolute inset-0 block transition-opacity duration-700 ease-in-out',
                isHovered ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={textureImage.src}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 right-3">
                <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-[8px] font-body font-bold uppercase tracking-[0.2em] text-primary px-3 py-1 rounded-full">
                  {t.product.texture}
                </span>
              </span>
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute z-10 top-3 left-3 flex flex-col gap-1.5 max-w-[55%] pointer-events-none">
          <Badge className="bg-white/90 dark:bg-black/90 text-primary border-none font-body text-[8px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg backdrop-blur-md font-bold rounded-full truncate">
            {product.categoryLabel}
          </Badge>
          {product.rating >= 4.8 && product.inStock && (
            <Badge className="bg-primary text-white border-none font-body text-[8px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg font-bold rounded-full flex items-center gap-1 w-fit">
              <Sparkles className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t.product.bestSeller}</span>
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-foreground/80 text-background border-none font-body text-[8px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg font-bold rounded-full w-fit">
              {t.product.outOfStock}
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={isSaved}
            aria-label={isSaved ? t.product.removeFromWishlist : t.product.addToWishlist}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="rounded-full bg-white/60 backdrop-blur-md hover:bg-white/95 shadow-md text-primary min-h-[44px] min-w-[44px] h-10 w-10"
          >
            <Heart
              aria-hidden="true"
              className={cn(
                'h-4 w-4 transition-all duration-300 shrink-0',
                isSaved ? 'fill-primary text-primary scale-110' : 'text-primary',
              )}
            />
          </Button>
        </div>

        {/* Quick Add to Cart overlay — slides up on hover */}
        <div className="absolute z-10 inset-x-3 bottom-3 flex gap-2 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-500 ease-out delay-75">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 min-w-0 rounded-full bg-primary/95 backdrop-blur-md text-white hover:bg-primary border-none font-body uppercase tracking-[0.12em] text-[9px] h-11 min-h-[44px] font-bold shadow-xl gap-2 whitespace-nowrap overflow-hidden text-ellipsis disabled:opacity-60"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {product.inStock ? t.product.addToBag : t.product.outOfStock}
          </Button>
          <Button
            asChild
            size="icon"
            className="rounded-full bg-white/95 dark:bg-white/20 backdrop-blur-md text-primary hover:bg-white dark:hover:bg-white/30 border-none min-h-[44px] min-w-[44px] h-11 w-11 font-bold shadow-xl shrink-0"
          >
            <Link href={product.href} aria-label={`${t.product.viewProduct}: ${product.name}`}>
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 px-4 md:px-5 pb-4 md:pb-5 pt-1 gap-2.5 min-w-0">
        {/* Stars + Review Count */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-0.5 shrink-0" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  'h-2.5 w-2.5',
                  i <= Math.floor(product.rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground/20',
                )}
              />
            ))}
          </span>
          <span className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.15em] opacity-60 truncate">
            {product.rating} · {product.reviewsCount} {t.product.reviews}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-headline text-base md:text-lg leading-snug text-foreground transition-colors group-hover:text-primary tracking-tight line-clamp-2 break-words min-w-0">
          <Link href={product.href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-[11px] text-muted-foreground line-clamp-2 italic leading-relaxed font-body opacity-75 break-words">
          {product.tagline}
        </p>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-primary/5 gap-3 min-w-0">
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.25em] font-bold opacity-50">
              {t.product.price}
            </span>
            <span className="font-headline text-xl text-primary truncate">
              {formatCurrency(product.price, locale)}
              {product.compareAtPrice && (
                <span className="ml-2 text-[11px] font-body text-muted-foreground line-through align-middle">
                  {formatCurrency(product.compareAtPrice, locale)}
                </span>
              )}
            </span>
          </div>

          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="relative z-10 cursor-pointer shrink-0 touch-manipulation disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${t.product.addToBag}: ${product.name}`}
            whileHover={reduceMotion ? undefined : { scale: 1.1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <span className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-primary/15 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 hover:shadow-lg hover:shadow-primary/20">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
