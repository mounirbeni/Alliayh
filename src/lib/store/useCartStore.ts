import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/catalog';

/**
 * Shopping bag.
 *
 * Two correctness problems are fixed here:
 *
 *  1. **Stock was never enforced.** `addItem` and `updateQuantity` accepted any
 *     quantity, so a customer could add 99 units of a product with 18 in stock —
 *     or add one that was entirely out of stock — and only find out after
 *     paying. Every mutation is now clamped to the product's stock.
 *  2. **Persisted state caused hydration mismatches.** The server renders an
 *     empty bag while the browser rehydrates a full one. `hasHydrated` lets
 *     components render the server-safe state until rehydration completes.
 */
export interface CartItem {
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  categoryLabel: string;
  href: string;
  /** Unit price actually charged (subscription discount already applied). */
  price: number;
  /** Undiscounted unit price, for strike-through display. */
  originalPrice: number;
  quantity: number;
  /** Units available — the ceiling for `quantity`. */
  maxQuantity: number;
  isSubscription: boolean;
  subscriptionInterval: string;
}

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (
    product: Product,
    quantity?: number,
    isSubscription?: boolean,
    subscriptionInterval?: string,
  ) => { added: number; clamped: boolean };
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartSavings: () => number;
  cartItemsCount: () => number;
  setHydrated: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addItem: (product, quantity = 1, isSubscription = false, subscriptionInterval = '30 Days') => {
        if (!product.inStock || quantity < 1) return { added: 0, clamped: true };

        const cartItemId = `${product.id}-${isSubscription ? 'sub' : 'one'}-${subscriptionInterval}`;
        const unitPrice = isSubscription ? product.subscriptionPrice : product.price;

        const existing = get().items.find((item) => item.cartItemId === cartItemId);
        const currentQuantity = existing?.quantity ?? 0;
        const nextQuantity = clamp(currentQuantity + quantity, 1, product.stock);
        const added = nextQuantity - currentQuantity;

        set((state) => ({
          items: existing
            ? state.items.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity: nextQuantity } : item,
              )
            : [
                ...state.items,
                {
                  cartItemId,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  imageAlt: product.imageAlt,
                  categoryLabel: product.categoryLabel,
                  href: product.href,
                  price: unitPrice,
                  originalPrice: product.price,
                  quantity: nextQuantity,
                  maxQuantity: product.stock,
                  isSubscription,
                  subscriptionInterval,
                },
              ],
        }));

        return { added, clamped: added < quantity };
      },

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: clamp(quantity, 1, item.maxQuantity) }
              : item,
          ),
        })),

      clearCart: () => set({ items: [] }),

      cartTotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      /** Total saved versus paying full price on every line. */
      cartSavings: () =>
        get().items.reduce(
          (total, item) => total + (item.originalPrice - item.price) * item.quantity,
          0,
        ),

      cartItemsCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'lueur-skin-cart',
      version: 2,
      // v1 stored the whole Product object per line, including localised copy
      // that goes stale the moment the visitor switches language. Those entries
      // are dropped rather than migrated half-way.
      migrate: () => ({ items: [] as CartItem[] }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
