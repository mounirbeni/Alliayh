"use client";

import { use, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Product } from '@/app/lib/products';
import { api } from '@/lib/api';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingBag, Heart, Shield, Sparkles, Droplets, Loader2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { formatCurrency } from '@/i18n/format';

// Mock initial reviews to simulate DB
const INITIAL_REVIEWS = [
  { id: 'r1', author: 'Jane Doe', rating: 5, text: "I've been using this for two weeks and my skin has never looked more radiant. It's so lightweight yet my skin feels plump all day. Definitely a permanent step in my ritual now.", verified: true },
  { id: 'r2', author: 'Emma S.', rating: 4, text: "Really loving the texture and how it absorbs. I just wish the bottle was a bit larger for the price, but the results are undeniable.", verified: true },
  { id: 'r3', author: 'Sarah L.', rating: 5, text: "Absolutely incredible. The glow is instant and lasts throughout the day. Layers beautifully under makeup too.", verified: false }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();

  // Reviews State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic Rating Calculation
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product?.rating || 5;
    const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.getById(id);
        if (data) setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, isSubscription, '30 Days');
      toast({
        title: t.product.addedToBag,
        description: `${quantity}x ${product.name} ${t.product.addedDesc}`,
        duration: 3000,
      });
      setQuantity(1);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product.id);
      const saved = !isInWishlist(product.id);
      toast({
        title: saved ? t.productDetail.addedToWishlist : t.productDetail.removedFromWishlist,
        description: saved ? `${product.name} ${t.productDetail.savedForLater}` : `${product.name} ${t.productDetail.removed}`
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmittingReview(true);
    try {
      await api.reviews.submitReview(product.id, newReviewRating, newReviewText);
      const newReview = {
        id: `r${Date.now()}`,
        author: user?.name || 'Anonymous Guest',
        rating: newReviewRating,
        text: newReviewText,
        verified: !!user
      };
      setReviews([newReview, ...reviews]);
      setIsReviewFormOpen(false);
      setNewReviewText('');
      setNewReviewRating(5);
      toast({
        title: t.productDetail.reviewPublished,
        description: t.productDetail.reviewPublishedDesc,
      });
    } catch (e) {
      toast({ title: t.productDetail.reviewError, description: t.productDetail.reviewErrorDesc, variant: "destructive" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center p-4">
        <Navbar />
        <h1 className="text-4xl font-headline mb-4">{t.productDetail.productNotFound}</h1>
        <Link href={`/${locale}/products`}>
          <Button>{t.productDetail.backToShop}</Button>
        </Link>
      </div>
    );
  }

  const placeholder = PlaceHolderImages.find(img => img.id === product.image);
  const isSaved = isInWishlist(product.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-lg">
                <Image
                  src={product.image.startsWith('/') ? product.image : '/products/sea-moss-gummies.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <Badge className="absolute top-6 left-6 bg-white/90 text-foreground border-none font-headline px-4 py-1 uppercase tracking-widest text-xs z-10">{product.category}</Badge>
              </div>
              {/* Thumbnail strip — real images cycling through available assets */}
              <div className="grid grid-cols-4 gap-4">
                {['/products/sea-moss-gummies.jpg', '/products/sea-moss-facts.jpg', '/products/glow-tea.jpg', '/products/glow-tea-instructions.jpg'].map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors">
                    <Image src={src} alt={`Product view ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-headline text-sm uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4" />
                  {t.productDetail.premiumSkincare}
                </div>
                <h1 className="font-headline text-5xl md:text-6xl tracking-tight leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm bg-primary/5 px-3 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={cn("h-3 w-3", i <= Math.round(averageRating) ? 'fill-primary text-primary' : 'text-primary/30')} />
                    ))}
                    <span className="ml-2 font-headline uppercase tracking-widest text-xs font-bold">{averageRating} / 5.0</span>
                  </div>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">{reviews.length} {t.productDetail.reviewsCount}</span>
                </div>
                <div className="text-3xl font-headline text-primary-foreground">
                  {isSubscription ? (
                    <div className="flex items-center gap-3">
                      <span className="line-through text-muted-foreground text-xl">{formatCurrency(product.price, locale)}</span>
                      <span>{formatCurrency(product.price * 0.85, locale)}</span>
                      <span className="text-[10px] bg-secondary/20 text-secondary px-3 py-1 rounded-full uppercase tracking-widest font-bold">{t.productDetail.discountLabel}</span>
                    </div>
                  ) : (
                    <span>{formatCurrency(product.price, locale)}</span>
                  )}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed italic">
                {product.description}
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setIsSubscription(false)}
                    className={cn(
                      "cursor-pointer border rounded-3xl p-5 transition-all flex flex-col justify-center items-center gap-2 text-center",
                      !isSubscription ? "border-primary bg-primary/5 shadow-inner" : "border-primary/10 hover:border-primary/30 bg-background"
                    )}
                  >
                    <span className="font-headline uppercase tracking-widest text-xs opacity-80">{t.productDetail.oneTime}</span>
                    <span className="text-lg font-bold">{formatCurrency(product.price, locale)}</span>
                  </div>
                  <div 
                    onClick={() => setIsSubscription(true)}
                    className={cn(
                      "cursor-pointer border rounded-3xl p-5 transition-all flex flex-col justify-center items-center gap-2 text-center relative overflow-hidden",
                      isSubscription ? "border-secondary bg-secondary/10 shadow-inner" : "border-primary/10 hover:border-secondary/30 bg-background"
                    )}
                  >
                    <span className="font-headline uppercase tracking-widest text-xs opacity-80">{t.productDetail.subscribe}</span>
                    <span className="text-lg font-bold text-secondary">{formatCurrency(product.price * 0.85, locale)} <span className="text-[10px] uppercase font-normal tracking-widest text-muted-foreground">{t.productDetail.perMonth}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-primary/20 rounded-full p-1 bg-white/50 dark:bg-black/20">
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold rounded-full hover:bg-muted"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span className="w-12 text-center font-headline text-lg">{quantity}</span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold rounded-full hover:bg-muted"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>
                  <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 rounded-full bg-primary hover:bg-primary/90 text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl flex gap-3">
                    <ShoppingBag className="h-4 w-4" /> {t.product.addToBag}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleWishlistToggle}
                    className={cn(
                      "h-14 w-14 rounded-full border border-primary/20 hover:bg-primary/5 transition-all shadow-sm",
                      isSaved && "border-primary"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", isSaved ? "fill-primary text-primary" : "text-primary")} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-primary/10 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-headline uppercase tracking-widest text-foreground/80">{t.productDetail.crueltyFree}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-primary/10 flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="text-xs font-headline uppercase tracking-widest text-foreground/80">{t.productDetail.ecoConscious}</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ingredients" className="border-primary/10">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">{t.productDetail.keyIngredients}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {product.ingredients.map((ing, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm">
                           <div className="h-1.5 w-1.5 bg-primary/70 rounded-full" />
                           {ing}
                         </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-primary/10">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">{t.productDetail.howToUse}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    {product.usage}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="benefits" className="border-primary/10">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">{t.productDetail.ritualBenefits}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    <ul className="space-y-4">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="mt-32">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-transparent border-b border-primary/10 w-full justify-start rounded-none h-14 p-0 space-x-12">
                <TabsTrigger value="details" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full">{t.productDetail.productPhilosophy}</TabsTrigger>
                <TabsTrigger value="reviews" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full">{t.productDetail.customerGlow} ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="py-12 animate-in fade-in duration-700">
                <div className="max-w-4xl space-y-8">
                  <h3 className="font-headline text-3xl italic">{t.productDetail.scienceTitle}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {t.productDetail.scienceDesc}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                    <div className="space-y-4">
                      <div className="h-1 w-20 bg-primary" />
                      <h4 className="font-headline text-xl uppercase tracking-widest">{t.productDetail.skinHarmony}</h4>
                      <p className="text-muted-foreground italic">{t.productDetail.skinHarmonyDesc}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1 w-20 bg-primary" />
                      <h4 className="font-headline text-xl uppercase tracking-widest">{t.productDetail.dermatologistTested}</h4>
                      <p className="text-muted-foreground italic">{t.productDetail.dermatologistTestedDesc}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-12 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  
                  {/* Reviews Summary Column */}
                  <div className="space-y-8 bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10 h-fit">
                    <div className="space-y-4 text-center">
                      <h3 className="font-headline text-xl uppercase tracking-widest">{t.productDetail.overallRating}</h3>
                      <div className="text-7xl font-headline text-primary leading-none">{averageRating}</div>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={cn("h-6 w-6", i <= Math.round(averageRating) ? 'fill-primary text-primary' : 'text-primary/20')} />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-headline uppercase tracking-widest pt-2">{t.productDetail.basedOn} {reviews.length} {t.productDetail.experiences}</p>
                    </div>
                    
                    <div className="border-t border-primary/10 pt-8">
                      {!isReviewFormOpen ? (
                        <Button 
                          onClick={() => setIsReviewFormOpen(true)}
                          className="w-full rounded-full bg-primary hover:bg-primary/90 font-headline tracking-widest uppercase text-xs h-12 shadow-lg"
                        >
                          {t.productDetail.writeReview}
                        </Button>
                      ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-4 animate-in slide-in-from-top-4">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground">{t.productDetail.yourRating}</label>
                          <div className="flex gap-2 pb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <button key={i} type="button" onClick={() => setNewReviewRating(i)} className="focus:outline-none">
                                <Star className={cn("h-6 w-6 hover:scale-110 transition-transform", i <= newReviewRating ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                              </button>
                            ))}
                          </div>
                          <textarea 
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            required
                            placeholder={t.productDetail.reviewPlaceholder}
                            className="w-full bg-background border border-primary/20 rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none min-h-[120px]"
                          />
                          <div className="flex gap-2">
                             <Button type="button" variant="ghost" onClick={() => setIsReviewFormOpen(false)} className="flex-1 rounded-full text-xs uppercase" disabled={isSubmittingReview}>{t.productDetail.cancel}</Button>
                             <Button type="submit" className="flex-1 rounded-full bg-primary text-xs uppercase gap-2" disabled={isSubmittingReview}>
                               {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />} {t.productDetail.post}
                             </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="md:col-span-2 space-y-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground italic">{t.productDetail.beFirstReview}</div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-black/20 p-8 rounded-3xl border border-primary/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-headline font-bold text-primary shadow-inner">
                                {review.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-headline uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                                  {review.author} 
                                  {review.verified && <Shield className="h-3 w-3 text-primary" />}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[1, 2, 3, 4, 5].map(j => <Star key={j} className={cn("h-3 w-3", j <= review.rating ? "fill-primary text-primary" : "text-primary/20")} />)}
                                </div>
                              </div>
                            </div>
                            {review.verified && <span className="text-[10px] text-primary/70 bg-primary/5 px-2 py-1 rounded-full uppercase tracking-widest font-bold hidden sm:block">{t.productDetail.verifiedBuyer}</span>}
                          </div>
                          <p className="text-foreground/80 italic leading-relaxed pt-2">
                            &quot;{review.text}&quot;
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
