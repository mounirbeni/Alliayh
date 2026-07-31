# Lueur Skin by Alliyah

Bilingual (pt-PT / en-GB) storefront for the Lueur Skin botanical skincare and
wellness range. Built with Next.js 15 (App Router), React 19, Tailwind CSS,
Radix primitives and Genkit.

## Quick start

```bash
npm ci
cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:9002
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack, port 9002) |
| `npm run build` | Production build — type-checks and lints, and fails on either |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |
| `npm run genkit:dev` | Genkit developer UI for the advisor flow |

## Architecture

```
src/
  app/
    [locale]/          Localised routes. Each page.tsx is a Server Component
                       that owns metadata, static params and JSON-LD, and
                       renders a client "view" for anything interactive.
    api/search/        Product search endpoint (keeps the catalog off the client)
    sitemap.ts         XML sitemap with hreflang alternates
    robots.ts          Crawl directives
    manifest.ts        Web app manifest
  components/
    layout/            SiteShell, Navbar, Footer, CartDrawer, Breadcrumbs …
    products/          ProductCard, CollectionView, ProductDetailView
    <feature>/         One client view per route that needs interactivity
  lib/
    catalog/           Product domain: data, taxonomy, queries, facets
    journal.ts         Editorial content, localised
    legal.ts           Legal documents, localised
    pricing.ts         Order totals — the single source of truth
    seo.ts             Metadata + JSON-LD builders
    site.ts            Brand constants and URL helpers
    store/             Zustand stores (cart, wishlist, auth, cookies)
  i18n/
    config.ts          Locale constants — edge-safe, no dictionary payload
    dictionaries/      pt.ts defines the shape; en.ts must match it exactly
  ai/flows/            Genkit advisor flow, grounded in the catalog
```

### Principles

**Server first.** Pages resolve data on the server and hand plain props to a
client view. Every route is prerendered via `generateStaticParams`, so the
default response is static HTML rather than a spinner.

**One source of truth per concern.** Products live in `lib/catalog`, prices in
`lib/pricing`, brand constants in `lib/site`. Filter facets are *derived* from
the catalog rather than hand-listed, so a filter cannot offer an option that no
product matches.

**Typed translation parity.** `Dictionary` is `typeof pt`. Adding a key to the
Portuguese dictionary without adding it to English is a compile error.

**URL-addressable state.** Collection filters are query parameters, so a
filtered view can be linked, bookmarked and indexed.

## Internationalisation

Portuguese (`pt`, default) and English (`en`). Locale resolution order:

1. `NEXT_LOCALE` cookie, written by the language switcher
2. `Accept-Language` header, with q-value ordering
3. `DEFAULT_LOCALE`

Product copy, journal articles and legal documents are all per-locale — the
language switch changes the content, not just the chrome.

To add a locale: extend `LOCALES` in `src/i18n/config.ts`, add a dictionary that
satisfies `Dictionary`, then fill in the `Record<Locale, …>` maps in
`lib/catalog/data.ts`, `lib/catalog/taxonomy.ts`, `lib/journal.ts` and
`lib/legal.ts`. TypeScript will point at every one that needs filling.

## Payments and orders

Checkout runs on **Stripe Checkout** (hosted). The storefront never renders a
card field and no card data reaches this application — which also means Apple
Pay, Google Pay and local European methods come for free.

The flow:

1. `createCheckoutSession` (`app/[locale]/checkout/actions.ts`) receives **only
   product ids and quantities**. It rebuilds every line and price from the
   catalog, re-checks live stock, and hands Stripe the amounts it computed
   itself. A tampered request cannot change what is charged.
2. The customer pays on Stripe and returns to `/checkout/success?session_id=…`.
3. `/api/webhooks/stripe` verifies the signature on the raw body, records the
   order and decrements inventory. **This** is what makes an order real — the
   browser's return is only a convenience.
4. The confirmation page reads the order from the store, falling back to
   retrieving the Stripe session. It therefore survives a refresh, a shared
   link and a redeploy.

Webhook delivery is at-least-once, so `recordPaid` is idempotent and stock only
moves on the first delivery of an event.

**Persistence.** `lib/orders/store.ts` ships an in-memory adapter: fine for
development and a single instance, but state is lost on restart and is not
shared between instances, so inventory drifts once you scale out. Implement
`OrderStore` and `InventoryStore` against Firestore (the project already depends
on `firebase` and targets Firebase App Hosting) and swap the two exports at the
bottom of that file — nothing else needs to change.

**Demo mode.** With no `STRIPE_SECRET_KEY`, checkout records a clearly-labelled
demo order instead of dead-ending, the same way the advisor degrades without a
model key.

## The AI advisor

`src/ai/flows/ai-powered-skincare-advisor-flow.ts` injects the real catalog into
the prompt and rejects any recommendation whose product id is not in it. If the
model is unreachable — including when `GOOGLE_GENAI_API_KEY` is unset — a
deterministic concern matcher answers instead, so the page always returns a
usable result. The server action in `app/[locale]/advisor/actions.ts` adds a
per-client rate limit (in-process; move it to a shared store before scaling out).

## Design system

The visual identity is unchanged: burgundy `#781430` on a warm off-white, Prata
headlines over Montserrat body copy, generous radii, glassmorphic surfaces.
Colours live as HSL custom properties in `src/app/globals.css`; fonts are
self-hosted through `next/font` and exposed to Tailwind as
`var(--font-headline)` / `var(--font-body)`.

Animation honours `prefers-reduced-motion` globally, and interactive components
also check `useReducedMotion()` before running entrance or parallax effects.

## Accessibility

Targeting WCAG 2.2 AA: skip link on every page, one `<main id="main-content">`
per document, visible `:focus-visible` rings, focus-trapped dialogs that close
on Escape and restore focus, 44×44 minimum touch targets, and `aria-current` on
active navigation.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` — canonical URLs, hreflang alternates, the sitemap
and JSON-LD all derive from it. Firebase App Hosting settings live in
`apphosting.yaml`.

## Legal copy

`src/lib/legal.ts` holds structured template documents covering the EU/PT
baseline (distance selling, GDPR, cookies, accessibility). **Have them reviewed
by counsel before launch**, and bump `LEGAL_UPDATED` with any revision.
