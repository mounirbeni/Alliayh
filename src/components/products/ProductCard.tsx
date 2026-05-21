
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { localizedPath } from '@/lib/locale-path';
import { formatCurrency } from '@/i18n/format';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  locale: Locale;
  dictionary: Dictionary;
}

export function ProductCard({ product, className, locale, dictionary }: ProductCardProps) {
  const localizedProduct = dictionary.products.items[product.id as keyof typeof dictionary.products.items];
  const placeholder = PlaceHolderImages.find(img => img.id === product.image);
  const productImage = placeholder?.imageUrl || "/lueur-placeholder.svg";
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { toast } = useToast();

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className={cn("group flex h-full flex-col rounded-3xl border border-primary/10 bg-white/70 p-4", className)}
    >
      <Link
        href={localizedPath(`/products/${product.id}`, locale)}
        className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl"
      >
        <Image
          src={productImage}
          alt={localizedProduct.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.04]"
        />
        <Image
          src={productImage}
          alt={localizedProduct.name}
          fill
          className="object-cover opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_70px_rgba(255,214,234,0.35)] opacity-0 transition group-hover:opacity-100" />
        <Button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full opacity-0 transition duration-300 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            addItem({
              id: product.id,
              image: productImage,
              name: localizedProduct.name,
              price: product.price,
            });
            toast({
              title: dictionary.nav.addToBag,
              description: localizedProduct.name,
            });
            openCart();
          }}
        >
          {dictionary.nav.addToBag}
        </Button>
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={localizedPath(`/products/${product.id}`, locale)} className="flex-1">
            <h3 className="font-headline text-2xl tracking-tight leading-none transition-colors group-hover:text-primary">
              {localizedProduct.name}
            </h3>
          </Link>
          <span className="font-headline text-base text-primary/80">{formatCurrency(product.price, locale)}</span>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {localizedProduct.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-primary/5 pt-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={cn("h-2.5 w-2.5", i <= Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted/30")} />
            ))}
          </div>
          <Link href={localizedPath(`/products/${product.id}`, locale)} className="text-xs font-medium text-primary">
            {dictionary.products.explore}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
