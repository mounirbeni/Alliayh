"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (incoming) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === incoming.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === incoming.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { ...incoming, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "lueur-cart-v1",
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          } as unknown as Storage;
        }
        return localStorage;
      }),
    },
  ),
);
