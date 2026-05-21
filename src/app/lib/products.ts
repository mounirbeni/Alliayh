
export interface Product {
  id: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    price: 48,
    image: 'product-cleanser',
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: '2',
    price: 92,
    image: 'product-serum',
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: '3',
    price: 72,
    image: 'product-moisturizer',
    rating: 4.7,
    reviewsCount: 185
  },
  {
    id: '4',
    price: 84,
    image: 'product-mask',
    rating: 4.9,
    reviewsCount: 89
  }
];
