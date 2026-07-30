/**
 * The Journal.
 *
 * Two problems this module fixes:
 *
 *  1. Articles were English-only, so a Portuguese reader hit an English wall
 *     the moment they left the marketing pages.
 *  2. `relatedProducts` listed slugs like `radiance-glow-tea` that were then
 *     matched against product *ids* (`'1'`, `'2'`). The comparison never
 *     succeeded, so the "Shop The Ritual" block silently rendered nothing on
 *     every article. Related products are now catalog slugs, resolved through
 *     the catalog's slug-or-id lookup.
 */
import type { Locale } from '@/i18n';

export interface JournalContent {
  title: string;
  excerpt: string;
  /** Markdown-lite: blank-line-separated paragraphs, `### ` for subheadings. */
  body: string;
  category: string;
  readTime: string;
}

export interface JournalArticle {
  slug: string;
  date: string;
  author: string;
  image: string;
  imageAlt: Record<Locale, string>;
  /** Catalog slugs merchandised alongside the article. */
  relatedProducts: string[];
  content: Record<Locale, JournalContent>;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: 'alchemy-of-sea-moss',
    date: '2026-03-15',
    author: 'Alliyah',
    image: '/products/sea-moss-facts.jpg',
    imageAlt: {
      pt: 'Musgo marinho irlandês seco sobre uma superfície de pedra clara',
      en: 'Dried Irish sea moss on a pale stone surface',
    },
    relatedProducts: ['sea-moss-gummies', 'sea-moss-gummies-duo'],
    content: {
      en: {
        title: 'The Alchemy of Sea Moss: Deep Ocean Hydration',
        excerpt:
          "Discover how wildcrafted sea moss restores the skin's natural lipid barrier and brings a healthy, radiant glow from within.",
        category: 'Ingredients',
        readTime: '4 min read',
        body: `Sea moss, known botanically as Chondrus crispus, is an alga found on the rocky shores of the North Atlantic. It has been used in traditional preparations for centuries, largely for its unusually broad mineral profile.

We harvest ours responsibly, drying it slowly so the cell walls stay intact. Prepared that way it carries sulphur compounds associated with a calmer, clearer complexion, alongside the trace minerals the skin draws on to repair itself.

### The barrier guardian
Sea moss is rich in carrageenan, which forms a light, breathable film. That film slows water loss without sealing the skin off, which is why skin tends to look plumper and more resilient after a few weeks rather than a few hours.

We believe visible beauty follows from health. Adding wildcrafted sea moss to a daily ritual is not a quick hydration fix — it is steady support for the structure underneath.`,
      },
      pt: {
        title: 'A Alquimia do Musgo Marinho: Hidratação de Alto Mar',
        excerpt:
          'Descubra como o musgo marinho de recolha selvagem restaura a barreira lipídica natural da pele e devolve um brilho saudável a partir do interior.',
        category: 'Ingredientes',
        readTime: '4 min de leitura',
        body: `O musgo marinho, botanicamente Chondrus crispus, é uma alga das costas rochosas do Atlântico Norte. É usado em preparações tradicionais há séculos, sobretudo pelo seu perfil mineral invulgarmente amplo.

Colhemos o nosso de forma responsável e secamo-lo lentamente, para que as paredes celulares se mantenham intactas. Preparado assim, mantém compostos de enxofre associados a uma pele mais calma e limpa, a par dos minerais vestigiais de que a pele precisa para se reparar.

### Guardião da barreira
O musgo marinho é rico em carragenina, que forma uma película leve e respirável. Essa película trava a perda de água sem selar a pele, e é por isso que a pele parece mais preenchida e resistente ao fim de algumas semanas — não de algumas horas.

Acreditamos que a beleza visível resulta da saúde. Integrar musgo marinho selvagem no ritual diário não é uma solução rápida de hidratação: é apoio constante à estrutura que está por baixo.`,
      },
    },
  },
  {
    slug: 'morning-rituals-radiant-skin',
    date: '2026-02-28',
    author: 'Alliyah',
    image: '/products/glow-tea-instructions.jpg',
    imageAlt: {
      pt: 'Chávena de chá em infusão junto a uma janela ao amanhecer',
      en: 'A cup of tea steeping beside a window at dawn',
    },
    relatedProducts: ['lueur-glow-tea', 'sea-moss-gummies'],
    content: {
      en: {
        title: 'Morning Rituals for Radiant Skin',
        excerpt:
          'How to structure a morning routine for cellular turnover and protection against urban stressors.',
        category: 'Wellness',
        readTime: '6 min read',
        body: `The morning sets the tone for how your skin copes with the rest of the day. A hurried splash of water is not enough to prepare it for what is waiting outside the door.

### 1. The internal cleanse
Hydration begins before anything touches your face. A cup of Glow Tea, steeped for a full five minutes, wakes the digestive tract and delivers antioxidants ahead of the first exposure of the day.

### 2. Gentle awakening
Cleanse with a non-stripping botanical wash. The goal is not skin that squeaks — it is skin that feels balanced and intact.

### 3. The lock-in phase
Apply serums while the skin is still damp, when permeability is highest, and follow immediately with a lipid-rich moisturiser to seal that hydration in.

Treat it as a ritual rather than a chore. Massage the products in properly, breathe, and give the two minutes their due.`,
      },
      pt: {
        title: 'Rituais Matinais para uma Pele Radiante',
        excerpt:
          'Como estruturar a rotina da manhã para favorecer a renovação celular e proteger a pele dos agressores urbanos.',
        category: 'Bem-estar',
        readTime: '6 min de leitura',
        body: `A manhã define a forma como a pele lida com o resto do dia. Um salpico apressado de água não a prepara para o que a espera à porta de casa.

### 1. A limpeza interior
A hidratação começa antes de qualquer produto tocar no rosto. Uma chávena de Chá Glow, em infusão durante cinco minutos completos, desperta o sistema digestivo e entrega antioxidantes antes da primeira exposição do dia.

### 2. Despertar suave
Limpe com um gel botânico que não agrida. O objetivo não é uma pele que "range" — é uma pele equilibrada e intacta.

### 3. A fase de selagem
Aplique os séruns com a pele ainda húmida, quando a permeabilidade é maior, e siga de imediato com um hidratante rico em lípidos para reter essa hidratação.

Trate isto como um ritual e não como uma tarefa. Massaje bem os produtos, respire, e dê a esses dois minutos a importância que merecem.`,
      },
    },
  },
  {
    slug: 'botanical-defense',
    date: '2026-02-10',
    author: 'Alliyah',
    image: '/products/glow-tea.jpg',
    imageAlt: {
      pt: 'Folhas e flores botânicas dispostas sobre linho claro',
      en: 'Botanical leaves and flowers arranged on pale linen',
    },
    relatedProducts: ['lueur-glow-tea', 'lueur-glow-tea-duo'],
    content: {
      en: {
        title: 'Botanical Defence: Protecting Your Aura',
        excerpt:
          'The science behind our antioxidant-rich Glow Tea, and how polyphenols interrupt oxidative damage.',
        category: 'Science',
        readTime: '5 min read',
        body: `Free radicals are unstable molecules that damage cells. They are unavoidable: in traffic pollution, in ultraviolet light, in ordinary metabolism. Nature's counterweight is the antioxidant.

We formulate our ingestibles with a high concentration of polyphenols and flavonoids. Drinking Glow Tea introduces those protective molecules into circulation, where they neutralise free radicals by donating an electron and interrupting the chain of damage before it propagates.

### The synergistic approach
We do not lean on a single heroic ingredient. A blend of botanicals works in concert, which improves absorption and spreads the benefit across the tissues that need it — including the deeper layers of the dermis, where topical products cannot reach.

None of this is a substitute for sun protection. It is what works underneath it.`,
      },
      pt: {
        title: 'Defesa Botânica: Proteger a Sua Aura',
        excerpt:
          'A ciência por trás do nosso Chá Glow rico em antioxidantes e a forma como os polifenóis interrompem o dano oxidativo.',
        category: 'Ciência',
        readTime: '5 min de leitura',
        body: `Os radicais livres são moléculas instáveis que danificam as células. São inevitáveis: estão na poluição do trânsito, na luz ultravioleta, no próprio metabolismo. O contrapeso da natureza é o antioxidante.

Formulamos os nossos ingeríveis com uma concentração elevada de polifenóis e flavonoides. Beber o Chá Glow coloca essas moléculas protetoras em circulação, onde neutralizam os radicais livres cedendo um eletrão e interrompendo a cadeia de dano antes de ela se propagar.

### A abordagem sinérgica
Não dependemos de um único ingrediente heroico. Uma mistura de botânicos trabalha em conjunto, o que melhora a absorção e distribui o benefício pelos tecidos que dele precisam — incluindo as camadas mais profundas da derme, onde os produtos tópicos não chegam.

Nada disto substitui a proteção solar. É o que funciona por baixo dela.`,
      },
    },
  },
];

export function getArticleSlugs(): string[] {
  return JOURNAL_ARTICLES.map((article) => article.slug);
}

export function getArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((article) => article.slug === slug);
}

/** Articles sorted newest first, with copy resolved for one locale. */
export function getArticles(locale: Locale) {
  return [...JOURNAL_ARTICLES]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((article) => ({
      slug: article.slug,
      date: article.date,
      author: article.author,
      image: article.image,
      imageAlt: article.imageAlt[locale],
      relatedProducts: article.relatedProducts,
      ...article.content[locale],
    }));
}

export type ResolvedArticle = ReturnType<typeof getArticles>[number];
