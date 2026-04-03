export interface Product {
  id: string;
  name: string;
  category: 'Gummies' | 'Tea' | 'Wellness' | 'Serums';
  price: number;
  description: string;
  ingredients: string[];
  usage: string;
  benefits: string[];
  image: string;
  rating: number;
  reviewsCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sea Moss Gummies',
    category: 'Gummies',
    price: 45,
    description: 'Nourish your body and skin from the inside out with our organic Sea Moss Gummies. Formulated with Bladderwrack and Burdock Root for comprehensive wellness and a clarified complexion.',
    ingredients: ['Organic Irish Sea Moss', 'Organic Bladderwrack', 'Organic Burdock Root', 'Vitamin C', 'Zinc', 'Vitamin D'],
    usage: 'Take 2 gummies during the day or at night. Chew thoroughly before swallowing.',
    benefits: ['Supports cellular function', 'Natural antioxidant source', 'Promotes a clear, radiant complexion'],
    image: '/products/sea-moss-gummies.jpg',
    rating: 4.9,
    reviewsCount: 156
  },
  {
    id: '2',
    name: 'Lueur Glow Tea',
    category: 'Tea',
    price: 28,
    description: 'Enhance your natural aura with our proprietary herbal blend. Formulated to relieve fatigue, moisturize, and plump the skin from the inside out.',
    ingredients: ['Cassia seeds', 'Coix seeds', 'Mulberry leaves', 'Goji berries', 'Rose flower', 'White grass root'],
    usage: 'Drink everyday. Pour a cup of near boiling water over one tea bag. Infuse for at least 5-7 minutes. Brew 1 tea bag 1-3 times a day.',
    benefits: ['Improves complexion', 'Relieves fatigue and dullness', 'Moisturizes and plumps skin'],
    image: '/products/glow-tea.jpg',
    rating: 4.8,
    reviewsCount: 203
  },
  {
    id: '3',
    name: 'Sea Moss Gummies (2-Pack)',
    category: 'Gummies',
    price: 80,
    description: 'Our top-selling Organic Sea Moss Gummies bundled for extended wellness. Formulated with Bladderwrack and Burdock Root for optimal health benefits.',
    ingredients: ['Organic Irish Sea Moss', 'Organic Bladderwrack', 'Organic Burdock Root', 'Vitamin C', 'Zinc'],
    usage: 'Take 2 gummies during the day or at night. Chew thoroughly before swallowing.',
    benefits: ['Extended 60-day supply', 'Supports cellular function', 'Promotes a clear complexion'],
    image: '/products/sea-moss-usage.jpg',
    rating: 5.0,
    reviewsCount: 89
  },
  {
    id: '4',
    name: 'Glow Tea (Double Archive)',
    category: 'Tea',
    price: 48,
    description: 'Double the radiance. Secure a lasting supply of our complexion-enhancing Glow Tea herbal blend.',
    ingredients: ['Cassia seeds', 'Coix seeds', 'Mulberry leaves', 'Goji berries', 'Rose flower'],
    usage: 'Drink everyday. Pour near boiling water over one tea bag. Infuse for 5-7 minutes.',
    benefits: ['60-day supply', 'Relieves fatigue', 'Improves complexion naturally'],
    image: '/products/glow-tea-instructions.jpg',
    rating: 4.9,
    reviewsCount: 112
  }
];
