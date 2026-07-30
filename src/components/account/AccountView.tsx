"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Package, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/i18n/format';
import type { Product } from '@/lib/catalog';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

/** No order backend is wired up yet; the empty state is the honest state. */
const ORDERS: Order[] = [];

export function AccountView({ products }: { products: Product[] }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const updateAddress = useAuthStore((state) => state.updateAddress);
  const savedIds = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();

  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect only once the persisted auth state is known, otherwise a signed-in
  // visitor is bounced to /login on every hard refresh.
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }
    setAddress(user?.defaultShippingAddress ?? '');
  }, [mounted, isAuthenticated, user, router, locale]);

  const saved = products.filter((product) => savedIds.includes(product.id));

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(address);
    toast({ title: t.account.addressUpdated, description: t.account.addressUpdatedDesc });
  };

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="py-24 text-center" aria-busy="true">
        <span className="sr-only">{t.common.loading}</span>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-headline text-4xl mb-2 uppercase tracking-widest">{t.account.title}</h1>
            <p className="text-muted-foreground italic text-lg">
              {t.account.welcomeBack}, {user.name}
            </p>
          </div>
          <Button
            onClick={() => {
              logout();
              router.push(`/${locale}`);
            }}
            variant="outline"
            className="rounded-full flex gap-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> {t.account.signOut}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            <section className="bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10">
              <h2 className="font-headline text-xl uppercase tracking-widest mb-6 border-b border-primary/10 pb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" aria-hidden="true" /> {t.account.shippingAddress}
              </h2>
              <form onSubmit={handleUpdateAddress} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="default-address"
                    className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                  >
                    {t.account.defaultAddress}
                  </label>
                  <textarea
                    id="default-address"
                    name="address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-transparent border border-primary/20 rounded-xl p-4 focus:outline-none focus:border-primary transition-colors min-h-[100px] text-sm resize-none"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-xs h-12 font-bold">
                  {t.account.saveAddress}
                </Button>
              </form>
            </section>

            <section className="bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10">
              <h2 className="font-headline text-xl uppercase tracking-widest mb-6 border-b border-primary/10 pb-4 flex items-center gap-2">
                <Package className="h-5 w-5" aria-hidden="true" /> {t.account.orderHistory}
              </h2>
              {ORDERS.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 mx-auto text-primary/30 mb-3" aria-hidden="true" />
                  <p className="text-muted-foreground text-sm italic mb-4">
                    {t.account.noRecentDeliveries}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full text-[10px] uppercase tracking-widest h-10 px-6"
                  >
                    <Link href={`/${locale}/products`}>{t.account.exploreProducts}</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4 list-none">
                  {ORDERS.map((order) => (
                    <li
                      key={order.id}
                      className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/5"
                    >
                      <div>
                        <p className="font-headline text-sm text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground uppercase">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{formatCurrency(order.total, locale)}</p>
                        <p className="text-[10px] uppercase text-primary tracking-widest font-bold">
                          {order.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="lg:col-span-2">
            <div className="bg-white dark:bg-black/20 p-8 sm:p-12 rounded-[2rem] border border-primary/10 min-h-full">
              <h2 className="font-headline text-2xl uppercase tracking-widest mb-8 border-b border-primary/10 pb-6 flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary fill-primary/10" aria-hidden="true" />{' '}
                {t.account.yourWishlist}
              </h2>

              {saved.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="h-12 w-12 mx-auto text-muted mb-4" aria-hidden="true" />
                  <p className="text-muted-foreground italic mb-6">{t.account.noSavedRituals}</p>
                  <Button asChild className="rounded-full uppercase tracking-widest text-xs font-bold px-8">
                    <Link href={`/${locale}/products`}>{t.account.discoverProducts}</Link>
                  </Button>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8 list-none">
                  {saved.map((product) => (
                    <li
                      key={product.id}
                      className="group relative bg-background border border-primary/5 p-4 rounded-2xl flex flex-col gap-4 transition-all hover:border-primary/20 hover:shadow-lg"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`${t.product.removeFromWishlist}: ${product.name}`}
                      >
                        <Heart className="h-4 w-4 fill-destructive text-destructive" aria-hidden="true" />
                      </Button>

                      <Link href={product.href} className="relative aspect-square rounded-xl overflow-hidden block">
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </Link>

                      <div className="flex-1">
                        <h3 className="font-headline text-lg tracking-tight mb-1">
                          <Link href={product.href} className="hover:text-primary transition-colors">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-primary font-bold">{formatCurrency(product.price, locale)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
