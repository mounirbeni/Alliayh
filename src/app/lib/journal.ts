export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  author: string;
  image: string;
  category: string;
  readTime: string;
  relatedProducts?: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: 'alchemy-of-sea-moss',
    title: 'The Alchemy of Sea Moss: Deep Ocean Hydration',
    excerpt: 'Discover how wildcrafted sea moss restores the skin\'s natural lipid barrier and brings a healthy, radiant glow from within.',
    content: `Sea moss, scientifically known as Chondrus crispus, is a type of algae or seaweed found primarily on the rocky shores of the North Atlantic. For centuries, it has been used in traditional medicine for its rich mineral profile. 

At Lueur Skin, we harvest our sea moss ethically, ensuring peak cellular bioavailability. When applied topically or ingested, sea moss delivers over 90 essential minerals directly to your cells. It's a natural source of sulfur, which is known to lower the microbial levels on the skin and soothe inflammation.

### The Barrier Guardian
One of the most profound effects of sea moss is its ability to fortify the skin's moisture barrier. By forming a non-occlusive film, it locks in hydration while allowing the skin to breathe. This means plumper, more resilient skin that can easily deflect environmental stressors.

We believe that true beauty starts with health. In integrating wildcrafted sea moss into your ritual, you aren't just hydrating—you are actively repairing the cellular matrix of your skin over time.`,
    date: '2026-03-15',
    author: 'Alliyah',
    image: '/products/sea-moss-facts.jpg',
    category: 'Ingredients',
    readTime: '4 min read',
    relatedProducts: ['sea-moss-gummies']
  },
  {
    slug: 'morning-rituals-radiant-skin',
    title: 'Morning Rituals for Radiant Skin',
    excerpt: 'How to structure your morning skincare routine for maximum cellular turnover and protection against urban stressors.',
    content: `The morning sets the tone for your skin's resilience throughout the day. A hurried splash of water is not enough to protect your natural aura from the environmental aggressors waiting outside your door.

### 1. The Internal Cleanse
Before any topical products touch your skin, hydration begins from within. A cup of our Glow Tea steeped for exactly four minutes awakens the digestive tract and delivers a potent dose of antioxidants to your bloodstream. 

### 2. Gentle Awakening
Cleanse your face with a non-stripping botanical wash. The goal is not to leave the skin feeling "squeaky clean," but rather balanced and respected.

### 3. The Lock-In Phase
While the skin is still damp, apply your serums. This is when your skin's permeability is highest. Follow immediately with a lipid-rich moisturizer to seal in the hydration. 

Remember, skincare is not a chore; it is a ritual of self-worship. Take a moment to massage the products in, breathing deeply and setting your intentions for the day.`,
    date: '2026-02-28',
    author: 'Alliyah',
    image: '/products/glow-tea-instructions.jpg',
    category: 'Wellness',
    readTime: '6 min read',
    relatedProducts: ['radiance-glow-tea', 'sea-moss-gummies']
  },
  {
    slug: 'botanical-defense',
    title: 'Botanical Defense: Protecting Your Aura',
    excerpt: 'The science behind our antioxidant-rich Glow Tea and how it neutralizes free radicals to prevent premature aging.',
    content: `Free radicals are unstable atoms that can damage cells, causing illness and aging. They are everywhere: in the pollution we walk through, the screens we stare at, and the sun we bask in. But nature has provided an antidote: antioxidants.

At Lueur Skin, we formulate our ingestibles with a high concentration of polyphenols and flavonoids. When you consume our Radiance Glow Tea, you are flooding your system with these protective molecules. They neutralize free radicals by donating an electron, effectively stopping the cascade of cellular damage.

### The Synergistic Approach
We don't rely on a single heroic ingredient. Instead, we use a complex blend of botanicals that work in synergy. This ensures that the benefits are absorbed efficiently and utilized by the body where they are needed most—including the deepest layers of your dermis.`,
    date: '2026-02-10',
    author: 'Dr. Sarah',
    image: '/products/glow-tea.jpg',
    category: 'Science',
    readTime: '5 min read',
    relatedProducts: ['radiance-glow-tea']
  }
];
