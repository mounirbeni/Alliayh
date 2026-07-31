"use client";

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';

/**
 * Empties the bag once a confirmed order has been rendered.
 *
 * Kept separate from the receipt so the receipt itself can be a Server
 * Component reading the real order from Stripe. The previous implementation
 * snapshotted the cart in an effect and then cleared it — which meant a refresh
 * of the confirmation page showed "no order found", because the only copy of
 * the order lived in component state.
 */
export function ClearCartOnMount() {
  const clearCart = useCartStore((state) => state.clearCart);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const cleared = useRef(false);

  useEffect(() => {
    if (!hasHydrated || cleared.current) return;
    cleared.current = true;
    clearCart();
  }, [hasHydrated, clearCart]);

  return null;
}
