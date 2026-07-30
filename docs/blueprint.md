# Lueur Skin — Platform Blueprint

## What the platform is

A bilingual (pt-PT / en-GB) direct-to-consumer storefront for Lueur Skin by
Alliyah: a four-product botanical wellness range (sea moss gummies and herbal
glow tea, each also sold as a two-month bundle), plus editorial, an ingredient
glossary and an AI skin advisor.

## Core features

- **Product catalog** — locale-resolved product records with taxonomy, stock,
  galleries and derived filter facets.
- **Collection page** — URL-driven search, category, active-ingredient, concern,
  price and stock filters; every refinement is linkable and crawlable.
- **Product detail** — working gallery, subscription vs one-time pricing, stock
  ceilings on quantity, reviews, cross-sell, `Product` structured data.
- **Bag & checkout** — one pricing module shared by the drawer, the bag page,
  checkout and the receipt. VAT-inclusive euros, free delivery over €50.
- **AI skin advisor** — catalog-grounded recommendations that map to real
  products, with a deterministic fallback when the model is unavailable.
- **Journal & glossary** — localised editorial with `Article` structured data
  and merchandised product links.
- **Account & wishlist** — persisted client state, hydration-safe.
- **Legal** — an explicit, localised set of documents (shipping, terms, privacy,
  cookies, accessibility).

## Rendering model

Every route is a Server Component that owns metadata, `generateStaticParams` and
JSON-LD, and renders a client view only for the interactive part. Both language
trees are prerendered at build time.

## Style guidelines

The visual identity is fixed and must not drift:

- **Primary** burgundy `#781430` (`hsl(343 71% 27%)`) — CTAs, headings, accents.
- **Secondary** soft pink `#f4cbe7` (`hsl(320 63% 87%)`) — highlights on dark
  surfaces.
- **Background** warm off-white `hsl(320 63% 98%)`, with a dark theme that
  inverts to deep burgundy.
- **Headline** Prata (serif). **Body** Montserrat. Both self-hosted via
  `next/font`, exposed as `--font-headline` / `--font-body`.
- **Shape** generous radii (`--radius: 2rem`, up to `5rem` on hero surfaces),
  glassmorphic panels, luminous shadows in the primary hue.
- **Icons** Lucide line icons, always `aria-hidden` when decorative.
- **Motion** subtle and fluid, and always conditional on
  `prefers-reduced-motion`.
- **Layout** mobile-first, ample white space, 44×44 minimum touch targets.

## Non-negotiables

1. Facets, filters and navigation must be derived from real data — never
   hand-listed alongside it.
2. Prices are calculated in exactly one place (`lib/pricing.ts`).
3. Every user-visible string comes from a dictionary; both dictionaries are
   kept in lockstep by the type system.
4. The build fails on type or lint errors. Do not re-enable
   `ignoreBuildErrors`.
