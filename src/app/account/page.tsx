"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { Heart, Package, MapPin, LogOut } from 'lucide-react';
import { Product, PRODUCTS } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

// Mock Order History
const MOCK_ORDERS: { id: string; date: string; total: number; status: string }[] = [
  // Emptying out order array to demonstrate the empty state UI correctly per requirements
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateAddress } = useAuthStore();
  const { items: wishlistIds, toggleWishlist } = useWishlistStore();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setNewAddress(user?.defaultShippingAddress || '');
    }
  }, [isAuthenticated, router, user]);

  useEffect(() => {
    // Resolve wishlist ids to products realistically based on our simulated DB response
    const resolved = PRODUCTS.filter(p => wishlistIds.includes(p.id));
    setWishlistProducts(resolved);
  }, [wishlistIds]);

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(newAddress);
    toast({
      title: "Address Updated",
      description: "Your default shipping address has been successfully saved."
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="font-headline text-4xl mb-2 uppercase tracking-widest">Your Account</h1>
              <p className="text-muted-foreground italic text-lg">Welcome back, {user.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="rounded-full flex gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Sidebar / Settings */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10">
                <h3 className="font-headline text-xl uppercase tracking-widest mb-6 border-b border-primary/10 pb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Shipping Address
                </h3>
                <form onSubmit={handleUpdateAddress} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Default Address</label>
                    <textarea 
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full bg-transparent border border-primary/20 rounded-xl p-4 focus:outline-none focus:border-primary transition-colors min-h-[100px] text-sm resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-xs h-12 font-bold">
                    Save Address
                  </Button>
                </form>
              </div>

              <div className="bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10">
                 <h3 className="font-headline text-xl uppercase tracking-widest mb-6 border-b border-primary/10 pb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" /> Order History
                </h3>
                <div className="space-y-4">
                  {MOCK_ORDERS.length === 0 ? (
                    <div className="text-center py-8">
                       <Package className="h-8 w-8 mx-auto text-primary/30 mb-3" />
                       <p className="text-muted-foreground text-sm italic mb-4">No recent deliveries.</p>
                       <Link href="/products">
                         <Button variant="outline" className="rounded-full text-[10px] uppercase tracking-widest h-10 px-6">Explore Products</Button>
                       </Link>
                    </div>
                  ) : (
                    MOCK_ORDERS.map(order => (
                      <div key={order.id} className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/5 hover:border-primary/20 transition-colors">
                        <div>
                          <div className="font-headline text-sm text-foreground">{order.id}</div>
                          <div className="text-xs text-muted-foreground uppercase">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">${order.total.toFixed(2)}</div>
                          <div className="text-[10px] uppercase text-primary tracking-widest font-bold">{order.status}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Wishlist Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-black/20 p-8 sm:p-12 rounded-[2rem] border border-primary/10 min-h-full">
                <h3 className="font-headline text-2xl uppercase tracking-widest mb-8 border-b border-primary/10 pb-6 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary fill-primary/10" /> Your Wishlist
                </h3>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="h-12 w-12 mx-auto text-muted mb-4" />
                    <p className="text-muted-foreground italic mb-6">You haven't saved any rituals yet.</p>
                    <Link href="/products">
                      <Button className="rounded-full uppercase tracking-widest text-xs font-bold px-8">Discover Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {wishlistProducts.map(product => {
                      const placeholder = PlaceHolderImages.find(img => img.id === product.image);
                      return (
                        <div key={product.id} className="group relative bg-background border border-primary/5 p-4 rounded-2xl flex flex-col gap-4 transition-all hover:border-primary/20 hover:shadow-lg">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 z-10 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart className="h-4 w-4 fill-destructive text-destructive" />
                          </Button>
                          
                          <Link href={`/products/${product.id}`} className="relative aspect-square rounded-xl overflow-hidden block">
                            <Image src={product.image?.startsWith('/') ? product.image : '/products/sea-moss-gummies.jpg'} alt={product.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                          </Link>
                          
                          <div className="flex-1">
                            <h4 className="font-headline text-lg tracking-tight mb-1">
                              <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
                            </h4>
                            <div className="text-primary font-bold">${product.price}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
