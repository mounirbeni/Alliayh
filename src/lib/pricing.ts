/**
 * Order pricing — one implementation, used by the bag, the drawer and checkout.
 *
 * The three surfaces previously disagreed. The cart page added 8% "estimated
 * tax" plus a flat $10 shipping and printed dollar signs; the drawer showed the
 * subtotal as the total with shipping "calculated at checkout"; the home page
 * promised free shipping over €50, which no calculation implemented. Prices are
 * VAT-inclusive euros, which is the convention the store actually sells under.
 */
import type { CartItem } from '@/lib/store/useCartStore';

/** Orders at or above this subtotal ship free — matches the value-prop banner. */
export const FREE_SHIPPING_THRESHOLD = 50;

/** Flat contribution below the threshold. */
export const STANDARD_SHIPPING = 4.95;

export interface OrderTotals {
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  /** How much more the customer needs to spend to reach free delivery. */
  amountToFreeShipping: number;
  itemCount: number;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateTotals(items: CartItem[]): OrderTotals {
  const subtotal = round(
    items.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const savings = round(
    items.reduce(
      (total, item) => total + (item.originalPrice - item.price) * item.quantity,
      0,
    ),
  );

  const isEmpty = items.length === 0;
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isEmpty || qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING;

  return {
    subtotal,
    savings,
    shipping,
    total: round(subtotal + shipping),
    qualifiesForFreeShipping,
    amountToFreeShipping: qualifiesForFreeShipping
      ? 0
      : round(FREE_SHIPPING_THRESHOLD - subtotal),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}
