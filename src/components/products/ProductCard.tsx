"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Plus, Eye, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toast } = useToast();
  const placeholder = PlaceHolderImages.find(img => img.id === product.image);
  
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Added to Bag",
      description: `${product.name} has been added.`,
      duration: 3000,
    });
  };

  return (
    <div className={cn(
      "group relative flex flex-col bg-white dark:bg-black/20 rounded-[3rem] overflow-hidden border border-primary/5 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(120,20,48,0.12)] aura-glow min-w-0",
      className
    )}>
      {/* Image Container — strict aspect ratio, overflow-hidden prevents bleed */}
      <Link href={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden m-4 rounded-[2rem] block shrink-0">
        <Image
          src={product.image.startsWith('/') ? product.image : '/products/sea-moss-gummies.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover w-full h-full transition-transform duration-[2s] ease-out group-hover:scale-110"
        />
        
        {/* Badges — capped width so they never overflow the image on small screens */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 max-w-[55%]">
          <Badge className="bg-white/90 dark:bg-black/90 text-primary border-none font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg backdrop-blur-md font-bold rounded-full truncate">
            {product.category}
          </Badge>
          {product.rating >= 4.8 && (
            <Badge className="bg-primary text-white border-none font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg font-bold rounded-full flex items-center gap-1 w-fit">
              <Sparkles className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">Best Seller</span>
            </Badge>
          )}
        </div>

        {/* Wishlist button — explicit min 44px touch target */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
            className="rounded-full bg-white/60 backdrop-blur-md hover:bg-white/95 shadow-md text-primary min-h-[44px] min-w-[44px] h-11 w-11"
          >
            <Heart className={cn("h-4 w-4 transition-colors shrink-0", isSaved ? "fill-primary text-primary" : "text-primary")} />
          </Button>
        </div>

        {/* Quick actions — visible on hover desktop, always accessible */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <Button
            onClick={handleAddToCart}
            className="flex-1 min-w-0 rounded-full bg-white/95 dark:bg-primary/90 dark:text-white backdrop-blur-md text-primary hover:bg-primary hover:text-white border-none font-body uppercase tracking-[0.12em] text-[9px] h-11 min-h-[44px] font-bold shadow-xl whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Add to Bag
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-white/95 dark:bg-primary/90 dark:text-white backdrop-blur-md text-primary hover:bg-primary hover:text-white border-none min-h-[44px] min-w-[44px] h-11 w-11 font-bold shadow-xl shrink-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Card Body — min-w-0 prevents flex child overflow */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-2 gap-3 min-w-0">
        
        {/* Stars + Review Count */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={cn("h-2.5 w-2.5", i <= Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20")} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.15em] opacity-60 truncate">
            {product.reviewsCount} reviews
          </span>
        </div>

        {/* Product Name — line-clamp prevents overflow, break-words handles long strings */}
        <Link href={`/products/${product.id}`} className="block min-w-0">
          <h3 className="font-headline text-lg leading-snug text-foreground transition-colors group-hover:text-primary tracking-tight line-clamp-2 break-words">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed font-body opacity-75 break-words">
          {product.description}
        </p>

        {/* Price + Add to cart — gap and min-w-0 prevents collision */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-primary/5 gap-3 min-w-0">
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.25em] font-bold opacity-50">Price</span>
            <span className="font-headline text-xl text-primary truncate">Dhs {product.price}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="cursor-pointer shrink-0 touch-manipulation"
            aria-label={`Add ${product.name} to cart`}
          >
            <div className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-primary/15 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 hover:shadow-lg">
              <Plus className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}