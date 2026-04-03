"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore, CartItem } from '@/lib/store/useCartStore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Sparkles } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
  const { items, clearCart, cartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
    
    // If there's items in the cart, capture them for the receipt and then clear the cart
    if (items.length > 0) {
      setOrderItems([...items]);
      
      const sub = cartTotal();
      const tax = sub * 0.08;
      const shp = sub > 0 ? 10 : 0;
      setOrderTotal(sub + tax + shp);

      setOrderId(`LUEUR-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
    }
  }, [items, clearCart, cartTotal]);

  if (!mounted) return null;

  // We only show the UI if we successfully captured order data or have an order ID
  // If a user navigates to /checkout/success directly without buying anything, orderItems will be empty.
  if (orderItems.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-headline mb-6">No Order Found</h1>
          <Link href="/products">
            <Button className="rounded-full">Back to Shop</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          
          <div className="animate-in zoom-in duration-700 flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <CheckCircle2 className="h-12 w-12" />
              <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="font-headline text-4xl md:text-5xl mb-4 italic">Thank you for your order.</h1>
          <p className="text-muted-foreground text-lg mb-8">Your ritual is being prepared. We have sent a confirmation email to you.</p>

          <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 text-left mb-12">
            <div className="flex justify-between items-center border-b border-primary/10 pb-6 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Order Number</span>
                <span className="font-headline text-xl text-primary">{orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Total Paid</span>
                <span className="font-headline text-xl">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <h3 className="font-headline text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" /> Order Summary
            </h3>

            <div className="space-y-6">
              {orderItems.map((item) => {
                const placeholder = PlaceHolderImages.find(img => img.id === item.image);
                return (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                      <Image src={placeholder?.imageUrl || "https://picsum.photos/100/150"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline text-lg">{item.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-headline text-lg">
                      ${item.quantity * item.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link href="/products">
            <Button size="lg" className="h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-sm font-bold px-12">
              Continue Shopping
            </Button>
          </Link>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
