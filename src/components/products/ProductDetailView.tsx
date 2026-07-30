"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Heart, Shield, Sparkles, Droplets, Loader2, Send, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/i18n/format';
import { submitReview } from '@/lib/api';
import type { Product } from '@/lib/catalog';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  verified: boolean;
}

/**
 * Product detail.
 *
 * Fixes carried by this rewrite:
 *   - the price was rendered in `text-primary-foreground`, which is near-white
 *     on the light theme — the single most important number on the page was
 *     invisible;
 *   - the thumbnail strip showed the same four hard-coded files for every
 *     product and clicking one did nothing; it is now the product's own gallery
 *     and it drives the main image;
 *   - quantity had no ceiling and out-of-stock products could still be bought;
 *   - the headline rating was recomputed from three sample reviews, so it
 *     contradicted both the card grid and the Product structured data.
 */
export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { dictionary: t, locale } = useLocaleStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

  const seedReviews = useMemo<Review[]>(
    () =>
      t.productDetail.sampleReviews.map((review, index) => ({
        id: `seed-${index}`,
        ...review,
      })),
    [t],
  );
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isSaved = wishlistItems.includes(product.id);
  const unitPrice = isSubscription ? product.subscriptionPrice : product.price;
  const maxQuantity = Math.max(product.stock, 1);
  const gallery = product.images;
  const currentImage = gallery[activeImage] ?? gallery[0];

  const handleAddToCart = () => {
    const result = addItem(product, quantity, isSubscription, '30 Days');
    if (result.added === 0) return;

    openCart();
    toast({
      title: t.product.addedToBag,
      description: `${result.added}× ${product.name} ${t.product.addedDesc}`,
      duration: 3000,
    });
    if (result.clamped) {
      toast({ title: t.productDetail.maxQuantity, duration: 4000 });
    }
    setQuantity(1);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    const saved = !isSaved;
    toast({
      title: saved ? t.productDetail.addedToWishlist : t.productDetail.removedFromWishlist,
      description: saved
        ? `${product.name} ${t.productDetail.savedForLater}`
        : `${product.name} ${t.productDetail.removed}`,
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await submitReview(product.id, newReviewRating, newReviewText);
      setReviews([
        {
          id: `local-${Date.now()}`,
          author: user?.name ?? t.productDetail.anonymous,
          rating: newReviewRating,
          text: newReviewText,
          verified: Boolean(user),
        },
        ...reviews,
      ]);
      setIsReviewFormOpen(false);
      setNewReviewText('');
      setNewReviewRating(5);
      toast({
        title: t.productDetail.reviewPublished,
        description: t.productDetail.reviewPublishedDesc,
      });
    } catch {
      toast({
        title: t.productDetail.reviewError,
        description: t.productDetail.reviewErrorDesc,
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="py-12 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-lg">
              <Image
                src={currentImage?.src ?? product.image}
                alt={currentImage?.alt ?? product.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
              <Badge className="absolute top-6 left-6 bg-white/90 text-foreground border-none font-headline px-4 py-1 uppercase tracking-widest text-xs z-10">
                {product.categoryLabel}
              </Badge>
              {!product.inStock && (
                <Badge className="absolute top-6 right-6 bg-foreground/85 text-background border-none font-headline px-4 py-1 uppercase tracking-widest text-xs z-10">
                  {t.product.outOfStock}
                </Badge>
              )}
            </div>

            {/* Thumbnail strip — the product's own gallery, and it works. */}
            {gallery.length > 1 && (
              <div
                className="grid grid-cols-4 gap-4"
                role="tablist"
                aria-label={t.a11y.productGallery}
              >
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    role="tab"
                    aria-selected={index === activeImage}
                    aria-label={t.productDetail.imageOf
                      .replace('{current}', String(index + 1))
                      .replace('{total}', String(gallery.length))}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      'relative aspect-square rounded-2xl overflow-hidden border transition-colors',
                      index === activeImage
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary',
                    )}
                  >
                    <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-primary font-headline text-sm uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t.productDetail.premiumSkincare}
              </p>
              <h1 className="font-headline text-5xl md:text-6xl tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-muted-foreground italic">{product.tagline}</p>

              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1 text-sm bg-primary/5 px-3 py-1 rounded-full">
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3 w-3',
                          i <= Math.round(product.rating) ? 'fill-primary text-primary' : 'text-primary/30',
                        )}
                      />
                    ))}
                  </span>
                  <span className="ml-2 font-headline uppercase tracking-widest text-xs font-bold">
                    {product.rating} / 5.0
                  </span>
                </span>
                <span className="text-muted-foreground text-xs uppercase tracking-widest">
                  {product.reviewsCount} {t.productDetail.reviewsCount}
                </span>
                <span className="text-muted-foreground text-xs uppercase tracking-widest">
                  {product.unit}
                </span>
              </div>

              {/* Price — legible on both themes. */}
              <div className="text-3xl font-headline text-primary">
                {isSubscription ? (
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="line-through text-muted-foreground text-xl">
                      {formatCurrency(product.price, locale)}
                    </span>
                    <span>{formatCurrency(product.subscriptionPrice, locale)}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                      {t.productDetail.discountLabel}
                    </span>
                  </span>
                ) : (
                  <span className="flex flex-wrap items-baseline gap-3">
                    <span>{formatCurrency(product.price, locale)}</span>
                    {product.compareAtPrice && (
                      <span className="line-through text-muted-foreground text-lg font-body">
                        {formatCurrency(product.compareAtPrice, locale)}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Stock signal */}
              <p
                className={cn(
                  'text-[11px] font-body font-bold uppercase tracking-[0.2em]',
                  product.inStock ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {product.inStock
                  ? product.stock <= 20
                    ? `${t.product.lowStock} — ${product.stock} ${t.productDetail.unitsLeft}`
                    : t.productDetail.inStock
                  : t.productDetail.outOfStockDesc}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed italic">{product.description}</p>

            <div className="space-y-6">
              <fieldset className="grid grid-cols-2 gap-4">
                <legend className="sr-only">{t.productDetail.oneTime} / {t.productDetail.subscribe}</legend>
                <button
                  type="button"
                  aria-pressed={!isSubscription}
                  onClick={() => setIsSubscription(false)}
                  className={cn(
                    'border rounded-3xl p-5 transition-all flex flex-col justify-center items-center gap-2 text-center',
                    !isSubscription
                      ? 'border-primary bg-primary/5 shadow-inner'
                      : 'border-primary/10 hover:border-primary/30 bg-background',
                  )}
                >
                  <span className="font-headline uppercase tracking-widest text-xs opacity-80">
                    {t.productDetail.oneTime}
                  </span>
                  <span className="text-lg font-bold">{formatCurrency(product.price, locale)}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={isSubscription}
                  onClick={() => setIsSubscription(true)}
                  className={cn(
                    'border rounded-3xl p-5 transition-all flex flex-col justify-center items-center gap-2 text-center relative overflow-hidden',
                    isSubscription
                      ? 'border-primary bg-secondary/20 shadow-inner'
                      : 'border-primary/10 hover:border-primary/30 bg-background',
                  )}
                >
                  <span className="font-headline uppercase tracking-widest text-xs opacity-80">
                    {t.productDetail.subscribe}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.subscriptionPrice, locale)}{' '}
                    <span className="text-[10px] uppercase font-normal tracking-widest text-muted-foreground">
                      {t.productDetail.perMonth}
                    </span>
                  </span>
                </button>
              </fieldset>

              {isSubscription && (
                <p className="text-xs text-muted-foreground italic">{t.productDetail.subscriptionNote}</p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-primary/20 rounded-full p-1 bg-white/50 dark:bg-black/20">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted disabled:opacity-40"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    aria-label={t.productDetail.decreaseQuantity}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span
                    className="w-12 text-center font-headline text-lg"
                    aria-live="polite"
                    aria-label={`${t.productDetail.quantity}: ${quantity}`}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted disabled:opacity-40"
                    onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                    disabled={quantity >= maxQuantity || !product.inStock}
                    aria-label={t.productDetail.increaseQuantity}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  size="lg"
                  className="flex-1 h-14 rounded-full bg-primary hover:bg-primary/90 text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl flex gap-3 disabled:opacity-60"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  {product.inStock ? t.product.addToBag : t.product.outOfStock}
                  {product.inStock && ` · ${formatCurrency(unitPrice * quantity, locale)}`}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistToggle}
                  aria-pressed={isSaved}
                  aria-label={isSaved ? t.product.removeFromWishlist : t.product.addToWishlist}
                  className={cn(
                    'h-14 w-14 rounded-full border border-primary/20 hover:bg-primary/5 transition-all shadow-sm',
                    isSaved && 'border-primary',
                  )}
                >
                  <Heart
                    aria-hidden="true"
                    className={cn('h-5 w-5', isSaved ? 'fill-primary text-primary' : 'text-primary')}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-primary/10 flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-xs font-headline uppercase tracking-widest text-foreground/80">
                  {t.productDetail.crueltyFree}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-primary/10 flex items-center gap-3">
                <Droplets className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-xs font-headline uppercase tracking-widest text-foreground/80">
                  {t.productDetail.ecoConscious}
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ingredients" className="border-primary/10">
                <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">
                  {t.productDetail.keyIngredients}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {product.ingredients.map((ingredient) => (
                      <li key={ingredient} className="flex items-center gap-3 text-sm">
                        <span className="h-1.5 w-1.5 bg-primary/70 rounded-full shrink-0" aria-hidden="true" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="usage" className="border-primary/10">
                <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">
                  {t.productDetail.howToUse}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                  {product.usage}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="benefits" className="border-primary/10">
                <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">
                  {t.productDetail.ritualBenefits}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                  <ul className="space-y-4">
                    {product.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-4">
                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
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
            <TabsList className="bg-transparent border-b border-primary/10 w-full justify-start rounded-none h-14 p-0 gap-12">
              <TabsTrigger
                value="details"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full"
              >
                {t.productDetail.productPhilosophy}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full"
              >
                {t.productDetail.customerGlow} ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="py-12">
              <div className="max-w-4xl space-y-8">
                <h2 className="font-headline text-3xl italic">{t.productDetail.scienceTitle}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{t.productDetail.scienceDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-4">
                    <span className="block h-1 w-20 bg-primary" aria-hidden="true" />
                    <h3 className="font-headline text-xl uppercase tracking-widest">
                      {t.productDetail.skinHarmony}
                    </h3>
                    <p className="text-muted-foreground italic">{t.productDetail.skinHarmonyDesc}</p>
                  </div>
                  <div className="space-y-4">
                    <span className="block h-1 w-20 bg-primary" aria-hidden="true" />
                    <h3 className="font-headline text-xl uppercase tracking-widest">
                      {t.productDetail.dermatologistTested}
                    </h3>
                    <p className="text-muted-foreground italic">{t.productDetail.dermatologistTestedDesc}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="space-y-8 bg-white dark:bg-black/20 p-8 rounded-[2rem] border border-primary/10 h-fit">
                  <div className="space-y-4 text-center">
                    <h3 className="font-headline text-xl uppercase tracking-widest">
                      {t.productDetail.overallRating}
                    </h3>
                    <p className="text-7xl font-headline text-primary leading-none">{product.rating}</p>
                    <span className="flex items-center justify-center gap-1" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-6 w-6',
                            i <= Math.round(product.rating) ? 'fill-primary text-primary' : 'text-primary/20',
                          )}
                        />
                      ))}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-headline uppercase tracking-widest pt-2">
                      {t.productDetail.basedOn} {product.reviewsCount} {t.productDetail.experiences}
                    </p>
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
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <fieldset>
                          <legend className="text-[10px] uppercase font-bold text-muted-foreground">
                            {t.productDetail.yourRating}
                          </legend>
                          <div className="flex gap-2 py-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setNewReviewRating(i)}
                                aria-label={`${i} / 5`}
                                aria-pressed={i === newReviewRating}
                              >
                                <Star
                                  aria-hidden="true"
                                  className={cn(
                                    'h-6 w-6 hover:scale-110 transition-transform',
                                    i <= newReviewRating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground/30',
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </fieldset>
                        <label htmlFor="review-text" className="sr-only">
                          {t.productDetail.reviewPlaceholder}
                        </label>
                        <textarea
                          id="review-text"
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          required
                          minLength={10}
                          maxLength={2000}
                          placeholder={t.productDetail.reviewPlaceholder}
                          className="w-full bg-background border border-primary/20 rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none min-h-[120px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsReviewFormOpen(false)}
                            className="flex-1 rounded-full text-xs uppercase"
                            disabled={isSubmittingReview}
                          >
                            {t.productDetail.cancel}
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 rounded-full bg-primary text-xs uppercase gap-2"
                            disabled={isSubmittingReview}
                          >
                            {isSubmittingReview ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Send className="h-4 w-4" aria-hidden="true" />
                            )}
                            {t.productDetail.post}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-center py-12 text-muted-foreground italic">
                      {t.productDetail.beFirstReview}
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <article
                        key={review.id}
                        className="bg-white dark:bg-black/20 p-8 rounded-3xl border border-primary/5 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <span
                              aria-hidden="true"
                              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-headline font-bold text-primary shadow-inner"
                            >
                              {review.author.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-headline uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                                {review.author}
                                {review.verified && <Shield className="h-3 w-3 text-primary" aria-hidden="true" />}
                              </p>
                              <span
                                className="flex items-center gap-1 mt-1"
                                aria-label={`${review.rating} / 5`}
                              >
                                {[1, 2, 3, 4, 5].map((j) => (
                                  <Star
                                    key={j}
                                    aria-hidden="true"
                                    className={cn(
                                      'h-3 w-3',
                                      j <= review.rating ? 'fill-primary text-primary' : 'text-primary/20',
                                    )}
                                  />
                                ))}
                              </span>
                            </div>
                          </div>
                          {review.verified && (
                            <span className="text-[10px] text-primary/70 bg-primary/5 px-2 py-1 rounded-full uppercase tracking-widest font-bold hidden sm:block">
                              {t.productDetail.verifiedBuyer}
                            </span>
                          )}
                        </div>
                        <p className="text-foreground/80 italic leading-relaxed pt-2">
                          &ldquo;{review.text}&rdquo;
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cross-sell */}
        {related.length > 0 && (
          <section className="mt-32 space-y-10" aria-labelledby="related-heading">
            <div className="space-y-2">
              <h2 id="related-heading" className="font-headline text-3xl tracking-tight">
                {t.productDetail.completeRitual}
              </h2>
              <p className="text-muted-foreground italic text-sm">
                {t.productDetail.completeRitualDesc}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
