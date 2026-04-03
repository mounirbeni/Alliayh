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
      title: "Added to Aura",
      description: `${product.name} has been added to your bag.`,
      duration: 3000,
    });
  };

  return (
    <div className={cn(
      "group relative flex flex-col bg-white dark:bg-black/20 rounded-[3.5rem] overflow-hidden border border-primary/5 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(120,20,48,0.12)] aura-glow",
      className
    )}>
      {/* Immersive Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden m-5 rounded-[2.5rem]">
        <Image
          src={placeholder?.imageUrl || "https://picsum.photos/600/800"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
          data-ai-hint={placeholder?.imageHint || "skincare bottle luxury"}
        />
        
        {/* Floating Aura Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <Badge className="bg-white/90 dark:bg-black/90 text-primary border-none font-body text-[9px] uppercase tracking-[0.3em] px-6 py-2 shadow-xl backdrop-blur-md font-bold rounded-full">
            {product.category}
          </Badge>
          {product.rating >= 4.8 && (
            <Badge className="bg-primary text-white border-none font-body text-[9px] uppercase tracking-[0.3em] px-6 py-2 shadow-xl font-bold rounded-full flex gap-2">
              <Sparkles className="h-3 w-3" /> Aura Essential
            </Badge>
          )}
        </div>

        {/* Wishlist Action Overlay */}
        <div className="absolute top-6 right-6 z-10 transition-all duration-300 pointer-events-auto">
           <Button 
             variant="ghost"
             size="icon"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
             className="rounded-full bg-white/50 backdrop-blur-md hover:bg-white/90 shadow-lg text-primary h-12 w-12"
           >
             <Heart className={cn("h-5 w-5 transition-colors", isSaved ? "fill-primary text-primary" : "text-primary")} />
           </Button>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-6 bottom-6 flex gap-3 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
           <Button 
             onClick={handleAddToCart}
             className="flex-1 rounded-full bg-white/95 dark:bg-primary/90 dark:text-white backdrop-blur-md text-primary hover:bg-primary hover:text-white border-none font-body uppercase tracking-[0.3em] text-[9px] h-14 font-bold shadow-2xl">
             Add to Aura
           </Button>
           <Button size="icon" className="rounded-full bg-white/95 dark:bg-primary/90 dark:text-white backdrop-blur-md text-primary hover:bg-primary hover:text-white border-none h-14 w-14 font-bold shadow-2xl">
             <Eye className="h-5 w-5" />
           </Button>
        </div>
      </Link>

      {/* Content Architecture */}
      <div className="flex flex-col flex-1 p-10 pt-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={cn("h-3 w-3", i <= Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20")} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em] opacity-60">
              {product.reviewsCount} Glows
            </span>
          </div>
          
          <Link href={`/products/${product.id}`}>
            <h3 className="font-headline text-3xl leading-tight text-foreground transition-colors group-hover:text-primary tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed font-body font-medium opacity-80">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-8 border-t border-primary/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-bold opacity-50">Ritual Investment</span>
            <span className="font-headline text-3xl text-primary">${product.price}</span>
          </div>
          
          <button onClick={handleAddToCart} className="cursor-pointer">
            <div className="h-14 w-14 rounded-full border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 group-hover:border-primary/40 shadow-sm hover:shadow-xl">
              <Plus className="h-6 w-6" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}