/**
 * The Lueur Skin catalog.
 *
 * Product copy lives here, per locale, alongside the commerce attributes it
 * describes. Previously the catalog was English-only while the rest of the site
 * was bilingual, so Portuguese visitors read English product pages.
 */
import type { CatalogProduct } from './types';

const SEA_MOSS_GUMMIES: CatalogProduct = {
  id: '1',
  slug: 'sea-moss-gummies',
  sku: 'LS-GUM-30',
  category: 'gummies',
  price: 45,
  subscriptionDiscount: 0.15,
  stock: 42,
  unit: { pt: '60 gomas · 30 dias', en: '60 gummies · 30 days' },
  featured: true,
  concerns: ['clarity', 'vitality', 'radiance'],
  actives: ['sea-moss', 'bladderwrack', 'burdock-root', 'vitamin-c', 'zinc', 'vitamin-d'],
  images: [
    {
      src: '/products/sea-moss-gummies.jpg',
      alt: {
        pt: 'Frasco de gomas de musgo marinho Lueur Skin sobre fundo claro',
        en: 'Jar of Lueur Skin sea moss gummies on a soft neutral background',
      },
    },
    {
      src: '/products/sea-moss-usage.jpg',
      alt: {
        pt: 'Instruções de utilização das gomas de musgo marinho',
        en: 'Usage instructions for the sea moss gummies',
      },
    },
    {
      src: '/products/sea-moss-facts.jpg',
      alt: {
        pt: 'Tabela nutricional e benefícios do musgo marinho',
        en: 'Nutritional panel and benefits of sea moss',
      },
    },
  ],
  rating: 4.9,
  reviewsCount: 156,
  related: ['2', '3'],
  content: {
    en: {
      name: 'Sea Moss Gummies',
      tagline: 'Ninety-two minerals, one daily ritual',
      description:
        'Nourish your body and skin from the inside out with our organic Sea Moss Gummies. Formulated with Bladderwrack and Burdock Root for comprehensive wellness and a clarified complexion.',
      usage:
        'Take 2 gummies during the day or at night. Chew thoroughly before swallowing.',
      benefits: [
        'Supports cellular function',
        'Natural antioxidant source',
        'Promotes a clear, radiant complexion',
      ],
      ingredients: [
        'Organic Irish Sea Moss',
        'Organic Bladderwrack',
        'Organic Burdock Root',
        'Vitamin C',
        'Zinc',
        'Vitamin D',
      ],
    },
    pt: {
      name: 'Gomas de Musgo Marinho',
      tagline: 'Noventa e dois minerais, um ritual diário',
      description:
        'Nutra o corpo e a pele de dentro para fora com as nossas Gomas de Musgo Marinho biológico. Formuladas com Bodelha e Raiz de Bardana para um bem-estar completo e uma pele visivelmente mais limpa.',
      usage:
        'Tome 2 gomas durante o dia ou à noite. Mastigue bem antes de engolir.',
      benefits: [
        'Apoia a função celular',
        'Fonte natural de antioxidantes',
        'Promove uma pele limpa e radiante',
      ],
      ingredients: [
        'Musgo marinho irlandês biológico',
        'Bodelha biológica',
        'Raiz de bardana biológica',
        'Vitamina C',
        'Zinco',
        'Vitamina D',
      ],
    },
  },
};

const GLOW_TEA: CatalogProduct = {
  id: '2',
  slug: 'lueur-glow-tea',
  sku: 'LS-TEA-30',
  category: 'tea',
  price: 28,
  subscriptionDiscount: 0.15,
  stock: 68,
  unit: { pt: '30 saquetas · 30 dias', en: '30 sachets · 30 days' },
  featured: true,
  concerns: ['hydration', 'radiance', 'fatigue'],
  actives: ['cassia', 'coix', 'mulberry', 'goji', 'rose', 'white-grass-root'],
  images: [
    {
      src: '/products/glow-tea.jpg',
      alt: {
        pt: 'Chá Lueur Glow servido numa chávena de porcelana',
        en: 'Lueur Glow Tea served in a porcelain cup',
      },
    },
    {
      src: '/products/glow-tea-instructions.jpg',
      alt: {
        pt: 'Instruções de infusão do Chá Lueur Glow',
        en: 'Brewing instructions for Lueur Glow Tea',
      },
    },
  ],
  rating: 4.8,
  reviewsCount: 203,
  related: ['1', '4'],
  content: {
    en: {
      name: 'Lueur Glow Tea',
      tagline: 'A botanical infusion for luminous skin',
      description:
        'Enhance your natural aura with our proprietary herbal blend. Formulated to relieve fatigue, moisturise, and plump the skin from the inside out.',
      usage:
        'Drink every day. Pour a cup of near-boiling water over one tea bag. Infuse for at least 5–7 minutes. Brew 1 tea bag 1–3 times a day.',
      benefits: [
        'Improves complexion',
        'Relieves fatigue and dullness',
        'Moisturises and plumps skin',
      ],
      ingredients: [
        'Cassia seeds',
        'Coix seeds',
        'Mulberry leaves',
        'Goji berries',
        'Rose flower',
        'White grass root',
      ],
    },
    pt: {
      name: 'Chá Lueur Glow',
      tagline: 'Uma infusão botânica para uma pele luminosa',
      description:
        'Realce a sua aura natural com a nossa mistura de ervas exclusiva. Formulada para aliviar o cansaço, hidratar e preencher a pele de dentro para fora.',
      usage:
        'Beba todos os dias. Verta uma chávena de água quase a ferver sobre uma saqueta. Deixe em infusão 5 a 7 minutos. Prepare 1 saqueta 1 a 3 vezes por dia.',
      benefits: [
        'Melhora o tom de pele',
        'Alivia o cansaço e a falta de luminosidade',
        'Hidrata e preenche a pele',
      ],
      ingredients: [
        'Sementes de cássia',
        'Sementes de coix',
        'Folhas de amoreira',
        'Bagas de goji',
        'Flor de rosa',
        'Raiz de imperata',
      ],
    },
  },
};

const SEA_MOSS_DUO: CatalogProduct = {
  id: '3',
  slug: 'sea-moss-gummies-duo',
  sku: 'LS-GUM-60',
  category: 'gummies',
  price: 80,
  compareAtPrice: 90,
  subscriptionDiscount: 0.15,
  stock: 18,
  unit: { pt: '120 gomas · 60 dias', en: '120 gummies · 60 days' },
  featured: true,
  concerns: ['clarity', 'vitality', 'barrier'],
  actives: ['sea-moss', 'bladderwrack', 'burdock-root', 'vitamin-c', 'zinc'],
  images: [
    {
      src: '/products/sea-moss-usage.jpg',
      alt: {
        pt: 'Conjunto de dois frascos de gomas de musgo marinho',
        en: 'Two-jar bundle of sea moss gummies',
      },
    },
    {
      src: '/products/sea-moss-gummies.jpg',
      alt: {
        pt: 'Frasco de gomas de musgo marinho Lueur Skin',
        en: 'Lueur Skin sea moss gummies jar',
      },
    },
    {
      src: '/products/sea-moss-facts.jpg',
      alt: {
        pt: 'Tabela nutricional das gomas de musgo marinho',
        en: 'Nutritional panel for the sea moss gummies',
      },
    },
  ],
  rating: 5.0,
  reviewsCount: 89,
  related: ['1', '4'],
  content: {
    en: {
      name: 'Sea Moss Gummies (2-Pack)',
      tagline: 'Two months of uninterrupted ritual',
      description:
        'Our top-selling Organic Sea Moss Gummies bundled for extended wellness. Formulated with Bladderwrack and Burdock Root for optimal health benefits.',
      usage:
        'Take 2 gummies during the day or at night. Chew thoroughly before swallowing.',
      benefits: [
        'Extended 60-day supply',
        'Supports cellular function',
        'Promotes a clear complexion',
      ],
      ingredients: [
        'Organic Irish Sea Moss',
        'Organic Bladderwrack',
        'Organic Burdock Root',
        'Vitamin C',
        'Zinc',
      ],
    },
    pt: {
      name: 'Gomas de Musgo Marinho (Pack 2)',
      tagline: 'Dois meses de ritual sem interrupções',
      description:
        'As nossas Gomas de Musgo Marinho biológico mais vendidas, em conjunto para um bem-estar prolongado. Formuladas com Bodelha e Raiz de Bardana para benefícios ótimos.',
      usage:
        'Tome 2 gomas durante o dia ou à noite. Mastigue bem antes de engolir.',
      benefits: [
        'Reserva prolongada de 60 dias',
        'Apoia a função celular',
        'Promove uma pele mais limpa',
      ],
      ingredients: [
        'Musgo marinho irlandês biológico',
        'Bodelha biológica',
        'Raiz de bardana biológica',
        'Vitamina C',
        'Zinco',
      ],
    },
  },
};

const GLOW_TEA_DUO: CatalogProduct = {
  id: '4',
  slug: 'lueur-glow-tea-duo',
  sku: 'LS-TEA-60',
  category: 'tea',
  price: 48,
  compareAtPrice: 56,
  subscriptionDiscount: 0.15,
  stock: 0,
  unit: { pt: '60 saquetas · 60 dias', en: '60 sachets · 60 days' },
  featured: true,
  concerns: ['hydration', 'radiance', 'fatigue'],
  actives: ['cassia', 'coix', 'mulberry', 'goji', 'rose'],
  images: [
    {
      src: '/products/glow-tea-instructions.jpg',
      alt: {
        pt: 'Conjunto duplo do Chá Lueur Glow com instruções',
        en: 'Lueur Glow Tea double bundle with brewing card',
      },
    },
    {
      src: '/products/glow-tea.jpg',
      alt: {
        pt: 'Chá Lueur Glow servido numa chávena de porcelana',
        en: 'Lueur Glow Tea served in a porcelain cup',
      },
    },
  ],
  rating: 4.9,
  reviewsCount: 112,
  related: ['2', '3'],
  content: {
    en: {
      name: 'Glow Tea (Double Archive)',
      tagline: 'Double the radiance, half the reordering',
      description:
        'Double the radiance. Secure a lasting supply of our complexion-enhancing Glow Tea herbal blend.',
      usage:
        'Drink every day. Pour near-boiling water over one tea bag. Infuse for 5–7 minutes.',
      benefits: [
        '60-day supply',
        'Relieves fatigue',
        'Improves complexion naturally',
      ],
      ingredients: [
        'Cassia seeds',
        'Coix seeds',
        'Mulberry leaves',
        'Goji berries',
        'Rose flower',
      ],
    },
    pt: {
      name: 'Chá Glow (Arquivo Duplo)',
      tagline: 'O dobro da luminosidade, metade das encomendas',
      description:
        'O dobro da luminosidade. Garanta uma reserva duradoura da nossa mistura de ervas Glow, que realça o tom de pele.',
      usage:
        'Beba todos os dias. Verta água quase a ferver sobre uma saqueta. Deixe em infusão 5 a 7 minutos.',
      benefits: [
        'Reserva para 60 dias',
        'Alivia o cansaço',
        'Melhora o tom de pele de forma natural',
      ],
      ingredients: [
        'Sementes de cássia',
        'Sementes de coix',
        'Folhas de amoreira',
        'Bagas de goji',
        'Flor de rosa',
      ],
    },
  },
};

export const CATALOG: readonly CatalogProduct[] = [
  SEA_MOSS_GUMMIES,
  GLOW_TEA,
  SEA_MOSS_DUO,
  GLOW_TEA_DUO,
];
