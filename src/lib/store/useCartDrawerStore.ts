import { create } from 'zustand';

/**
 * Cart Drawer Store — Controls the open/close state of the slide-out cart drawer.
 * Decoupled from cart data to prevent unnecessary re-renders.
 */
interface CartDrawerStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartDrawerStore = create<CartDrawerStore>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
