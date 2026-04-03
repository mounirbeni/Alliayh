"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { Product, PRODUCTS } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items: wishlistIds, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const resolved = PRODUCTS.filter(p => wishlistIds.includes(p.id));
    setWishlistProducts(resolved);
  }, [wishlistIds]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast({
      title: "Added to Aura",
      description: `${product.name} has been added to your bag.`,
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-12 uppercase tracking-widest text-center">Your Archives</h1>
          
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white/50 dark:bg-black/20 rounded-[3rem] border border-primary/10 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
                <Heart className="h-10 w-10 fill-current" />
              </div>
              <h2 className="text-2xl font-headline mb-4 uppercase tracking-widest">No Saved Rituals</h2>
              <p className="text-muted-foreground mb-8 max-w-md italic">You have not archived any products to your wishlist yet.</p>
              <Link href="/products">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-8 uppercase tracking-widest text-[10px] font-bold h-14">
                  Explore Collection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map(product => {
                const placeholder = PlaceHolderImages.find(img => img.id === product.image);
                return (
                  <div key={product.id} className="group relative bg-white dark:bg-black/20 border border-primary/10 p-6 rounded-[2.5rem] flex flex-col gap-6 transition-all hover:border-primary/30 hover:shadow-xl">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-4 right-4 z-10 rounded-full bg-white/50 backdrop-blur text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <Link href={`/products/${product.id}`} className="relative aspect-square rounded-[2rem] overflow-hidden block">
                      <Image 
                        src={product.image.startsWith('/') ? product.image : '/products/sea-moss-gummies.jpg'} 
                        alt={product.name} 
                        fill 
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-[4s]" 
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-headline text-2xl tracking-tight mb-2">
                        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
                      </h4>
                      <div className="text-primary font-bold text-lg mb-6">${product.price}</div>
                      
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full mt-auto rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-[10px] h-12 font-bold"
                      >
                         <ShoppingBag className="w-4 h-4 mr-2" /> Add to Aura
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
