"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "admin" | "customer";
export type UserPlan = "starter" | "growth" | "elite";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  avatar?: string;
  createdAt: string;
}

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "admin-1",
    email: "admin@lueur.skin",
    password: "admin123",
    name: "Alliyah Mendes",
    role: "admin",
    plan: "elite",
    createdAt: "2024-01-01",
  },
  {
    id: "user-1",
    email: "sofia@gmail.com",
    password: "user123",
    name: "Sofia Laurent",
    role: "customer",
    plan: "starter",
    createdAt: "2025-03-15",
  },
];

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 700));
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) return { success: false, error: "Invalid email or password." };
        const { password: _, ...user } = found;
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 700));
        const exists = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return { success: false, error: "An account with this email already exists." };
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: "customer",
          plan: "starter",
          createdAt: new Date().toISOString().split("T")[0],
        };
        DEMO_USERS.push({ ...newUser, password });
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "lueur-auth-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage;
        }
        return localStorage;
      }),
    }
  )
);
