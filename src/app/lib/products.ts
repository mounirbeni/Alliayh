export interface Product {
  id: string;
  name: string;
  category: 'Cleansers' | 'Serums' | 'Moisturizers' | 'Masks' | 'Toners';
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
    name: 'Silk Radiance Gentle Foam',
    category: 'Cleansers',
    price: 42,
    description: 'A luxurious foaming cleanser by Alliyah that removes impurities while maintaining your skin\'s natural moisture barrier. Infused with silk amino acids and rare botanical extracts.',
    ingredients: ['Water', 'Glycerin', 'Silk Amino Acids', 'Aloe Vera Leaf Juice', 'Green Tea Extract'],
    usage: 'Massage 1-2 pumps onto damp skin morning and night. Rinse thoroughly with lukewarm water.',
    benefits: ['Deeply cleanses without stripping', 'Leaves skin feeling soft and hydrated', 'Calms inflammation'],
    image: 'product-cleanser',
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: '2',
    name: 'Aura Glow Vitamin C Serum',
    category: 'Serums',
    price: 88,
    description: 'A potent antioxidant serum designed to brighten the complexion and even skin tone. Features a stable form of Vitamin C and Ferulic Acid in a sophisticated delivery system.',
    ingredients: ['15% Vitamin C (THD Ascorbate)', 'Ferulic Acid', 'Vitamin E', 'Hyaluronic Acid'],
    usage: 'Apply 3-4 drops to clean, dry skin every morning before moisturizer and SPF.',
    benefits: ['Brightens dull skin', 'Fades hyperpigmentation', 'Protects against environmental stressors'],
    image: 'product-serum',
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: '3',
    name: 'Luminous Dew Day Cream',
    category: 'Moisturizers',
    price: 64,
    description: 'A lightweight yet deeply hydrating moisturizer that creates a dewy, radiant finish. Perfect for all skin types, especially under makeup for the signature Alliyah glow.',
    ingredients: ['Squalane', 'Rosehip Oil', 'Niacinamide', 'Ceramides NP/AP/EOP'],
    usage: 'Apply a dime-sized amount to face and neck as the final step of your morning routine.',
    benefits: ['Intense hydration', 'Strengthens skin barrier', 'Creates natural glow'],
    image: 'product-moisturizer',
    rating: 4.7,
    reviewsCount: 185
  },
  {
    id: '4',
    name: 'Celestial Overnight Mask',
    category: 'Masks',
    price: 78,
    description: 'Wake up to transformed skin. This overnight treatment deeply replenishes moisture and promotes skin renewal while you sleep. A centerpiece of the Lueur ritual.',
    ingredients: ['Bakuchiol', 'Peptides', 'Melatonin', 'Shea Butter'],
    usage: 'Apply generously to clean skin twice a week in the evening. Leave on overnight.',
    benefits: ['Plumps fine lines', 'Deeply nourishing', 'Evens skin texture'],
    image: 'product-mask',
    rating: 4.9,
    reviewsCount: 89
  },
  {
    id: '5',
    name: 'Ever-Bright Eye Essence',
    category: 'Serums',
    price: 52,
    description: 'A targeted treatment for the delicate eye area. Reduces puffiness and dark circles while smoothing fine lines for a rested, elegant look.',
    ingredients: ['Caffeine', 'Peptides', 'Cucumber Extract', 'Sodium Hyaluronate'],
    usage: 'Gently dab a small amount around the orbital bone morning and night.',
    benefits: ['Reduces dark circles', 'Debuffs tired eyes', 'Hydrates fine lines'],
    image: 'product-eye-cream',
    rating: 4.6,
    reviewsCount: 95
  },
  {
    id: '6',
    name: 'Pure Balance Toning Mist',
    category: 'Toners',
    price: 36,
    description: 'A refreshing, pH-balancing mist that preps the skin for serums and provides a boost of botanical hydration throughout the day.',
    ingredients: ['Witch Hazel', 'Rose Water', 'Calendula Extract', 'Probiotics'],
    usage: 'Mist over face after cleansing or anytime skin needs a refresh.',
    benefits: ['Refines pores', 'Hydrates instantly', 'Soothes irritation'],
    image: 'product-toner',
    rating: 4.7,
    reviewsCount: 112
  }
];
