"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/lib/store/useCartStore';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { getCheckoutSchema, type CheckoutFormValues } from '@/i18n/schemas';
import { formatCurrency } from '@/i18n/format';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, cartTotal } = useCartStore();
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();

  const checkoutSchema = getCheckoutSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.push(`/${locale}`);
    return null;
  }

  const subtotal = cartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  const onSubmit = async (data: CheckoutFormValues) => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real app we'd pass data to a server and get an order ID back
    toast({
      title: t.checkout.orderProcessed,
      description: t.checkout.redirecting,
    });
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="font-headline text-4xl mb-12 uppercase tracking-widest text-center">{t.checkout.title}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                
                {/* Shipping Details */}
                <div className="space-y-6">
                  <h2 className="font-headline text-2xl uppercase tracking-widest border-b border-primary/10 pb-4">{t.checkout.shippingDetails}</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.firstName}</label>
                      <input 
                        {...register("firstName")}
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderFirstName}
                      />
                      {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.lastName}</label>
                      <input 
                        {...register("lastName")}
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderLastName}
                      />
                      {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.email}</label>
                    <input 
                      {...register("email")}
                      type="email"
                      className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder={t.checkout.placeholderEmail}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.address}</label>
                    <input 
                      {...register("address")}
                      className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder={t.checkout.placeholderAddress}
                    />
                    {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.city}</label>
                      <input 
                        {...register("city")}
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderCity}
                      />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.postalCode}</label>
                      <input 
                        {...register("zipCode")}
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderZipCode}
                      />
                      {errors.zipCode && <p className="text-destructive text-xs mt-1">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                    <h2 className="font-headline text-2xl uppercase tracking-widest">{t.checkout.payment}</h2>
                    <div className="flex gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.cardNumber}</label>
                    <input 
                      {...register("cardNumber")}
                      className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder={t.checkout.placeholderCardNumber}
                    />
                    {errors.cardNumber && <p className="text-destructive text-xs mt-1">{errors.cardNumber.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.expiry}</label>
                      <input 
                        {...register("expiry")}
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderExpiry}
                      />
                      {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.checkout.cvc}</label>
                      <input 
                        {...register("cvc")}
                        type="password"
                        className="w-full h-12 bg-white/50 dark:bg-black/20 border border-primary/20 rounded-xl px-4 focus:outline-none focus:border-primary transition-colors"
                        placeholder={t.checkout.placeholderCvc}
                        maxLength={4}
                      />
                      {errors.cvc && <p className="text-destructive text-xs mt-1">{errors.cvc.message}</p>}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-sm font-bold flex gap-2"
                >
                  {isSubmitting ? t.checkout.processing : `${t.checkout.payAmount} ${formatCurrency(total, locale)}`}
                </Button>
                
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 sticky top-28">
                <h3 className="font-headline text-xl uppercase tracking-widest mb-6">{t.checkout.inYourBag}</h3>
                
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                  {items.map((item) => {
                    return (
                      <div key={item.cartItemId} className="flex gap-4 items-center">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.image?.startsWith('/') ? item.image : '/products/glow-tea.jpg'} alt={item.name} fill className="object-cover object-center" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline text-sm truncate">{item.name}</h4>
                          <span className="text-[10px] text-muted-foreground uppercase">{item.quantity} x {formatCurrency(item.price, locale)}</span>
                        </div>
                        <div className="font-headline font-bold text-primary">
                          {formatCurrency(item.quantity * item.price, locale)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 border-t border-primary/10 pt-6 text-sm font-headline uppercase tracking-wider text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="text-foreground">{formatCurrency(subtotal, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.checkout.estimatedTax}</span>
                    <span className="text-foreground">{formatCurrency(tax, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cart.shipping}</span>
                    <span className="text-foreground">{formatCurrency(shipping, locale)}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-primary/10 flex justify-between items-center text-foreground">
                    <span className="font-bold text-lg">{t.cart.total}</span>
                    <span className="text-2xl">{formatCurrency(total, locale)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
