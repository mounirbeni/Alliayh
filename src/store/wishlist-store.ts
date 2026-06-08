"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistState = {
  items: string[];
  toggle: (productId: string) => void;
  isWished: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        })),
      isWished: (productId) => get().items.includes(productId),
      clear: () => set({ items: [] }),
    }),
    {
      name: "lueur-wishlist-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage;
        }
        return localStorage;
      }),
    }
  )
);
