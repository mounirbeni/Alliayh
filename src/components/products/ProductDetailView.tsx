"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Star, Loader2, Send, Minus, Plus, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/products/ProductCard';
import { DrawRule, MaskReveal, ParallaxFrame, Reveal } from '@/components/motion/Editorial';
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
 * Restructured from a two-card layout into an editorial spread: the gallery
 * runs as a vertical column of full-width plates while a slim buy panel stays
 * pinned alongside it. The tab strip that hid the reviews behind a click is
 * gone — everything is on one scroll, sectioned by hairlines, the way a print
 * catalogue would set it.
 */
export function ProductDetailView({ product, related }: { product: Product; related: Product[] }) {
  const { dictionary: t, locale } = useLocaleStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

  const seedReviews = useMemo<Review[]>(
    () => t.productDetail.sampleReviews.map((review, index) => ({ id: `seed-${index}`, ...review })),
    [t],
  );
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [formOpen, setFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSaved = wishlistItems.includes(product.id);
  const unitPrice = isSubscription ? product.subscriptionPrice : product.price;
  const maxQuantity = Math.max(product.stock, 1);

  const handleAdd = () => {
    const result = addItem(product, quantity, isSubscription, '30 Days');
    if (result.added === 0) return;

    openCart();
    toast({
      title: t.product.addedToBag,
      description: `${result.added}× ${product.name} ${t.product.addedDesc}`,
    });
    if (result.clamped) toast({ title: t.productDetail.maxQuantity });
    setQuantity(1);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReview(product.id, newRating, newText);
      setReviews([
        {
          id: `local-${Date.now()}`,
          author: user?.name ?? user?.email ?? t.productDetail.anonymous,
          rating: newRating,
          text: newText,
          verified: Boolean(user),
        },
        ...reviews,
      ]);
      setFormOpen(false);
      setNewText('');
      setNewRating(5);
      toast({ title: t.productDetail.reviewPublished, description: t.productDetail.reviewPublishedDesc });
    } catch {
      toast({
        title: t.productDetail.reviewError,
        description: t.productDetail.reviewErrorDesc,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Spread ───────────────────────────────────────────────────── */}
      <div className="shell grid grid-cols-1 gap-x-16 gap-y-12 pt-6 lg:grid-cols-12">
        {/* Gallery — a stacked column of plates */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {product.images.map((image, i) => (
              <ParallaxFrame
                key={image.src}
                className={cn('w-full rule-t rule-b rule-l rule-r', i === 0 ? 'aspect-[4/5]' : 'aspect-square')}
                amount={i === 0 ? 6 : 8}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={cn('object-cover duotone', !product.inStock && 'grayscale opacity-70')}
                />
              </ParallaxFrame>
            ))}
          </div>
        </div>

        {/* Buy panel — pinned */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <p className="label text-foreground/45">{product.categoryLabel}</p>

            <h1 className="mt-5 font-display text-display-md leading-[0.95] tracking-tightest">
              <MaskReveal>{product.name}</MaskReveal>
            </h1>

            <p className="mt-4 font-display text-lede italic text-foreground/60">{product.tagline}</p>

            {/* Rating + unit */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2" aria-label={`${product.rating} / 5`}>
                <span aria-hidden="true" className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i <= Math.round(product.rating) ? 'fill-primary text-primary' : 'text-foreground/20',
                      )}
                    />
                  ))}
                </span>
                <span className="label tabular text-foreground/60">
                  {product.rating} · {product.reviewsCount}
                </span>
              </span>
              <span className="label text-foreground/45">{product.unit}</span>
            </div>

            <DrawRule className="my-8" />

            <p className="max-w-prose text-body-md text-foreground/70">{product.description}</p>

            {/* Purchase mode — two ruled columns, no cards */}
            <fieldset className="mt-10">
              <legend className="sr-only">
                {t.productDetail.oneTime} / {t.productDetail.subscribe}
              </legend>
              <div className="grid grid-cols-2">
                {[
                  { on: !isSubscription, label: t.productDetail.oneTime, price: product.price, set: false },
                  { on: isSubscription, label: t.productDetail.subscribe, price: product.subscriptionPrice, set: true },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={option.on}
                    onClick={() => setIsSubscription(option.set)}
                    className={cn(
                      'flex flex-col items-start gap-2 border-t-2 py-4 pr-4 text-left transition-colors',
                      option.on ? 'border-primary' : 'border-rule hover:border-foreground/30',
                    )}
                  >
                    <span className={cn('label', option.on ? 'text-primary' : 'text-foreground/50')}>
                      {option.label}
                    </span>
                    <span className="tabular font-display text-display-xs">
                      {formatCurrency(option.price, locale)}
                    </span>
                    {option.set && (
                      <span className="label-sm text-foreground/45">{t.productDetail.discountLabel}</span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {isSubscription && (
              <p className="mt-3 text-body-sm italic text-foreground/50">{t.productDetail.subscriptionNote}</p>
            )}

            {/* Stock */}
            <p
              className={cn(
                'mt-8 label',
                product.inStock ? 'text-primary' : 'text-foreground/45',
              )}
            >
              {product.inStock
                ? product.stock <= 20
                  ? `${t.product.lowStock} — ${product.stock} ${t.productDetail.unitsLeft}`
                  : t.productDetail.inStock
                : t.productDetail.outOfStockDesc}
            </p>

            {/* Quantity + buy */}
            <div className="mt-5 flex items-stretch gap-4">
              <div className="flex items-center rule-t rule-b rule-l rule-r">
                <button
                  type="button"
                  onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                  disabled={quantity <= 1}
                  aria-label={t.productDetail.decreaseQuantity}
                  className="flex h-14 w-11 items-center justify-center transition-opacity disabled:opacity-25"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span
                  className="tabular w-8 text-center text-body-md"
                  aria-live="polite"
                  aria-label={`${t.productDetail.quantity}: ${quantity}`}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((v) => Math.min(maxQuantity, v + 1))}
                  disabled={quantity >= maxQuantity || !product.inStock}
                  aria-label={t.productDetail.increaseQuantity}
                  className="flex h-14 w-11 items-center justify-center transition-opacity disabled:opacity-25"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="group flex h-14 flex-1 items-center justify-between gap-4 bg-primary px-6 label text-primary-foreground transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>{product.inStock ? t.product.addToBag : t.product.outOfStock}</span>
                {product.inStock && (
                  <span className="tabular">{formatCurrency(unitPrice * quantity, locale)}</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                toast({
                  title: isSaved ? t.productDetail.removedFromWishlist : t.productDetail.addedToWishlist,
                });
              }}
              aria-pressed={isSaved}
              className="label link-underline mt-6 text-foreground/55 transition-colors hover:text-primary"
            >
              {isSaved ? t.product.removeFromWishlist : t.product.addToWishlist}
            </button>

            {/* Detail disclosures */}
            <Accordion type="single" collapsible className="mt-10 w-full">
              {[
                {
                  value: 'ingredients',
                  title: t.productDetail.keyIngredients,
                  body: (
                    <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
                      {product.ingredients.map((ingredient) => (
                        <li key={ingredient} className="text-body-sm text-foreground/70">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  value: 'usage',
                  title: t.productDetail.howToUse,
                  body: <p className="max-w-prose text-body-sm text-foreground/70">{product.usage}</p>,
                },
                {
                  value: 'benefits',
                  title: t.productDetail.ritualBenefits,
                  body: (
                    <ul className="space-y-3">
                      {product.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-body-sm text-foreground/70">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ].map((item) => (
                <AccordionItem key={item.value} value={item.value} className="border-b border-rule">
                  <AccordionTrigger className="label py-5 hover:no-underline hover:text-primary">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-1">{item.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              <span className="label-sm text-foreground/45">{t.productDetail.crueltyFree}</span>
              <span className="label-sm text-foreground/45">{t.productDetail.ecoConscious}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Philosophy ───────────────────────────────────────────────── */}
      <section className="section mt-[clamp(4rem,8vw,8rem)] bg-muted/40 grain relative">
        <div className="shell relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {/* A section title, so it belongs in the outline as a heading. */}
            <h2 className="font-display text-display-sm tracking-tightest">
              <MaskReveal>{t.productDetail.scienceTitle}</MaskReveal>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="max-w-prose text-body-lg text-foreground/70">{t.productDetail.scienceDesc}</p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
              {[
                { title: t.productDetail.skinHarmony, desc: t.productDetail.skinHarmonyDesc },
                { title: t.productDetail.dermatologistTested, desc: t.productDetail.dermatologistTestedDesc },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="pt-5 rule-t">
                    <h3 className="label text-primary">{item.title}</h3>
                    <p className="mt-3 text-body-sm text-foreground/65">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section className="section shell" aria-labelledby="reviews-heading">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <h2 id="reviews-heading" className="font-display text-display-sm tracking-tightest">
                {t.productDetail.customerGlow}
              </h2>

              <p className="tabular mt-8 font-display text-display-lg leading-none text-primary">
                {product.rating}
              </p>
              <p className="label mt-3 text-foreground/45">
                {t.productDetail.basedOn} {product.reviewsCount} {t.productDetail.experiences}
              </p>

              {!formOpen ? (
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="label link-underline mt-8 text-primary"
                >
                  {t.productDetail.writeReview}
                </button>
              ) : (
                <form onSubmit={handleReview} className="mt-8 space-y-5">
                  <fieldset>
                    <legend className="label text-foreground/45">{t.productDetail.yourRating}</legend>
                    <div className="mt-3 flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewRating(i)}
                          aria-label={`${i} / 5`}
                          aria-pressed={i === newRating}
                        >
                          <Star
                            aria-hidden="true"
                            className={cn(
                              'h-5 w-5 transition-transform hover:scale-110',
                              i <= newRating ? 'fill-primary text-primary' : 'text-foreground/25',
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
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={4}
                    placeholder={t.productDetail.reviewPlaceholder}
                    className="w-full resize-none border-0 border-b border-rule bg-transparent pb-3 text-body-sm placeholder:text-foreground/35 focus:border-primary focus:outline-none"
                  />

                  <div className="flex items-center gap-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="label inline-flex items-center gap-2 text-primary disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {t.productDetail.post}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      disabled={submitting}
                      className="label text-foreground/45"
                    >
                      {t.productDetail.cancel}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            {reviews.length === 0 ? (
              <p className="py-16 text-center font-display text-lede italic text-foreground/45">
                {t.productDetail.beFirstReview}
              </p>
            ) : (
              <ul>
                {reviews.map((review, i) => (
                  <li key={review.id}>
                    <Reveal delay={Math.min(i, 4) * 0.05}>
                      <article className="py-8 rule-t">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <span className="label">{review.author}</span>
                          <span aria-label={`${review.rating} / 5`} className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((j) => (
                              <Star
                                key={j}
                                aria-hidden="true"
                                className={cn(
                                  'h-3 w-3',
                                  j <= review.rating ? 'fill-primary text-primary' : 'text-foreground/20',
                                )}
                              />
                            ))}
                          </span>
                          {review.verified && (
                            <span className="label-sm text-foreground/40">{t.productDetail.verifiedBuyer}</span>
                          )}
                        </div>
                        <blockquote className="mt-4 max-w-prose font-display text-lede italic leading-relaxed text-foreground/75">
                          {review.text}
                        </blockquote>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
            <DrawRule />
          </div>
        </div>
      </section>

      {/* ── Cross-sell ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section shell rule-t" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-12">
            <div>
              <p className="label text-foreground/45">{t.productDetail.completeRitualDesc}</p>
              <h2 id="related-heading" className="mt-4 font-display text-display-sm tracking-tightest">
                {t.productDetail.completeRitual}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.07}>
                <ProductCard product={item} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
