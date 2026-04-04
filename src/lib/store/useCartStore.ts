import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/app/lib/products';

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  isSubscription?: boolean;
  subscriptionInterval?: string;
  originalPrice?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, isSubscription?: boolean, subscriptionInterval?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, isSubscription = false, subscriptionInterval = '30 Days') => {
        set((state) => {
          const price = isSubscription ? Math.round(product.price * 0.85) : product.price;
          const cartItemId = `${product.id}-${isSubscription ? 'sub' : 'one'}-${subscriptionInterval}`;

          const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { 
            items: [
              ...state.items, 
              { 
                ...product, 
                cartItemId, 
                quantity, 
                isSubscription, 
                subscriptionInterval, 
                price, 
                originalPrice: product.price 
              }
            ] 
          };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      cartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      cartItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'lueur-skin-cart',
    }
  )
);
