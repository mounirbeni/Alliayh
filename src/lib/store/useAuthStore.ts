import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/lib/api';

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateAddress: (address: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateAddress: (address) => set((state) => ({
        user: state.user ? { ...state.user, defaultShippingAddress: address } : null
      }))
    }),
    {
      name: 'lueur-skin-auth',
    }
  )
);
