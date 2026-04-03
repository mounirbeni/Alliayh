import { Product, PRODUCTS } from '@/app/lib/products';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  defaultShippingAddress: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      await delay(800); // Simulate network latency
      return PRODUCTS;
    },
    getById: async (id: string): Promise<Product | undefined> => {
      await delay(500);
      return PRODUCTS.find(p => p.id === id);
    }
  },
  auth: {
    login: async (email: string, password: string): Promise<UserProfile> => {
      await delay(1000);
      if (email && password) {
        return {
          id: 'user_123',
          name: 'Jane Doe',
          email: email,
          defaultShippingAddress: '123 Ritual Lane, Paris, France',
        };
      }
      throw new Error("Invalid credentials");
    }
  },
  reviews: {
    submitReview: async (productId: string, rating: number, comment: string): Promise<{success: boolean}> => {
      await delay(800);
      return { success: true };
    }
  }
};
