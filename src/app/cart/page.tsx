"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/lib/store/useCartStore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, cartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-12 uppercase tracking-widest text-center">Your Ritual</h1>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-black/20 rounded-[3rem] border border-primary/10">
              <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-headline mb-4 uppercase tracking-widest">Your Bag is Empty</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md italic">Begin your journey to healthier skin by exploring our curated collections of premium skincare rituals.</p>
              <Link href="/products">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-8 uppercase tracking-widest text-xs font-bold h-14">
                  Explore Collection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-6">
                {items.map((item) => {
                  const placeholder = PlaceHolderImages.find(img => img.id === item.image);
                  
                  return (
                    <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 items-center">
                      <div className="relative w-32 h-40 rounded-2xl overflow-hidden shrink-0">
                        <Image
                          src={item.image?.startsWith('/') ? item.image : '/products/sea-moss-gummies.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">{item.category}</span>
                               {item.isSubscription && (
                                 <span className="text-[8px] bg-secondary/20 text-secondary uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                                   Delivery every {item.subscriptionInterval}
                                 </span>
                               )}
                            </div>
                            <h3 className="font-headline text-2xl tracking-tight mt-1">
                              <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">{item.name}</Link>
                            </h3>
                          </div>
                          <div className="text-right">
                             {item.isSubscription && item.originalPrice && (
                                <div className="text-sm line-through text-muted-foreground">${item.originalPrice * item.quantity}</div>
                             )}
                             <div className="font-headline text-xl">${item.price * item.quantity}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                          <div className="flex items-center border border-border rounded-full p-1 bg-background">
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-lg font-bold rounded-full hover:bg-muted transition-colors"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            >-</button>
                            <span className="w-10 text-center font-headline text-sm">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-lg font-bold rounded-full hover:bg-muted transition-colors"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            >+</button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => removeItem(item.cartItemId)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 sticky top-28">
                  <h3 className="font-headline text-2xl uppercase tracking-widest mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 text-sm font-headline uppercase tracking-wider text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-foreground">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-primary/10 flex justify-between items-center text-foreground">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block mt-8">
                    <Button className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2">
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5 opacity-70">
                    <ShieldCheck className="h-3 w-3" /> Secure Encrypted Checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
