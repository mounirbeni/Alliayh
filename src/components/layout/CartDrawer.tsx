"use client";

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useOverlay } from '@/hooks/use-overlay';
import { formatCurrency } from '@/i18n/format';

/**
 * CartDrawer — slide-out bag, visually unchanged.
 *
 * It is now a real modal dialog: labelled, focus-trapped, dismissible with
 * Escape, and it restores focus to the cart button on close. Quantity steppers
 * respect the stock ceiling recorded on each line.
 */
export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartTotal = useCartStore((state) => state.cartTotal);
  const cartSavings = useCartStore((state) => state.cartSavings);
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const close = useCartDrawerStore((state) => state.close);
  const { dictionary: t, locale } = useLocaleStore();

  const handleClose = useCallback(() => close(), [close]);
  const panelRef = useOverlay<HTMLDivElement>(isOpen, handleClose);

  const formatPrice = (price: number) => formatCurrency(price, locale);
  const savings = cartSavings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.cart.title}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[90] w-full sm:w-[420px] bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-headline text-xl tracking-tight">{t.cart.title}</h2>
                {items.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full min-h-[44px] min-w-[44px]"
                onClick={close}
                aria-label={t.common.close}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-6 py-12"
                >
                  <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-headline text-lg">{t.cart.empty}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.cart.emptyDesc}</p>
                  </div>
                  <Link href={`/${locale}/products`} onClick={close}>
                    <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] text-[10px] font-bold px-8 h-12 min-h-[44px]">
                      {t.cart.exploreCta}
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-primary/5"
                      >
                        {/* Product Image */}
                        <Link href={item.href} onClick={close} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="min-w-0">
                            <h3 className="font-headline text-sm leading-tight truncate">
                              <Link href={item.href} onClick={close} className="hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            {item.isSubscription && (
                              <span className="text-[9px] font-body font-bold uppercase tracking-[0.15em] text-primary bg-primary/5 px-2 py-0.5 rounded-full inline-block mt-1">
                                {t.cart.subscription}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 gap-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-muted rounded-full px-1 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-7 w-7 min-h-[28px] min-w-[28px] rounded-full flex items-center justify-center hover:bg-background transition-colors disabled:opacity-40"
                                aria-label={`${t.productDetail.decreaseQuantity}: ${item.name}`}
                              >
                                <Minus className="h-3 w-3" aria-hidden="true" />
                              </button>
                              <span className="text-xs font-bold font-body w-6 text-center" aria-live="polite">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                disabled={item.quantity >= item.maxQuantity}
                                className="h-7 w-7 min-h-[28px] min-w-[28px] rounded-full flex items-center justify-center hover:bg-background transition-colors disabled:opacity-40"
                                aria-label={`${t.productDetail.increaseQuantity}: ${item.name}`}
                              >
                                <Plus className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-headline text-sm text-primary">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="self-start text-muted-foreground/50 hover:text-destructive transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center"
                          aria-label={t.cart.remove}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer — Summary & Checkout */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-primary/10 px-6 py-5 space-y-4 bg-background"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-bold">{formatPrice(cartTotal())}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">{t.product.save}</span>
                      <span className="font-bold text-primary">−{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.cart.shipping}</span>
                    <span className="text-xs text-muted-foreground italic">{t.cart.shippingCalc}</span>
                  </div>
                  <div className="h-px bg-primary/10 my-2" />
                  <div className="flex justify-between font-headline text-lg">
                    <span>{t.cart.total}</span>
                    <span className="text-primary">{formatPrice(cartTotal())}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href={`/${locale}/checkout`} onClick={close}>
                    <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] text-[10px] font-bold h-12 min-h-[44px] gap-2 shadow-lg">
                      {t.cart.checkout}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full rounded-full uppercase tracking-[0.2em] text-[10px] font-bold h-10 min-h-[40px] text-muted-foreground"
                    onClick={close}
                  >
                    {t.cart.continueShopping}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
