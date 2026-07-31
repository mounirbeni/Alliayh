# Lueur Skin by Alliyah

Bilingual (pt-PT / en-GB) storefront for the Lueur Skin botanical skincare and
wellness range. Built with Next.js 15 (App Router), React 19, Tailwind CSS,
Radix primitives and the Gemini API.

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
| `npm run db:migrate` | Apply `src/lib/db/schema.sql` |
| `npm run db:check` | Verify the database layer end to end |

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
    auth/              Password hashing, sessions, sign-in/up server actions
    db/                Postgres client and schema
    orders/            Order + inventory domain, Postgres and in-memory adapters
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
  ai/flows/            Advisor flow, grounded in the catalog
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

**Demo mode.** With no `STRIPE_SECRET_KEY`, checkout records a clearly-labelled
demo order instead of dead-ending, the same way the advisor degrades without a
model key.

## Persistence and accounts

No third-party backend. Both run on plain Postgres reached through a single
`DATABASE_URL`, so the app runs unchanged on Neon, Supabase, Railway, Render,
RDS or a database you host yourself — switching provider is a connection string,
not a rewrite. When `DATABASE_URL` is absent, orders fall back to in-memory
(with a startup warning) and accounts report as unavailable, so the storefront
still works for a contributor without a database.

Apply the schema with `npm run db:migrate`, then `npm run db:check` to verify
it end to end — it exercises webhook-replay idempotency, concurrent inventory
increments, exact money round-trips, case-insensitive email uniqueness and
session expiry, and removes everything it wrote. Every schema statement is
idempotent, so migrating on each deploy is safe.

**Connection poolers.** A transaction-mode pooler (Neon's `-pooler` host,
Supabase's `pgbouncer=true`) hands out a different backend per transaction, so
server-side prepared statements — which postgres.js uses by default — break
against it, typically as intermittent errors only under concurrency. The client
detects a pooled URL and disables preparation. Set `DATABASE_URL_UNPOOLED` to
the direct endpoint so migrations run off the pooler.

### Orders and inventory

| Table | Key | Written by |
| --- | --- | --- |
| `orders` | Stripe Checkout Session id | the webhook |
| `inventory` | product id, `sold` counter | the webhook |

Keying orders by session id is what makes the webhook idempotent *across
instances*: a replayed event collides on the primary key, `ON CONFLICT DO
NOTHING` discards the insert, and stock is not moved twice. Inventory is
incremented by the database inside a transaction, so concurrent sales of the
same product cannot overwrite each other.

Money is stored in minor units as integers — keeping euros as a float invites
the classic `38.249999999`.

**Availability fails soft.** If the database is unreachable, product pages fall
back to the catalog's declared stock and log a warning, rather than erroring.
The catalog needs no database to render, so an outage — or simply building in an
environment that cannot reach the database — should not take down every product
page. Checkout re-checks stock before taking money and the webhook is the
authority on what sold, so the degraded mode is "may briefly offer something low
on stock", not "may oversell silently".

### Authentication

Owned by the application; no identity provider is involved.

- **Passwords** are hashed with scrypt from Node's standard library — memory-hard,
  so GPU cracking stays expensive. Parameters are N=2^16, r=8, p=2: one of
  OWASP's listed configurations, ~64 MB and ~390 ms per hash. That memory figure
  is deliberate — the higher-memory variant (~128 MB) exhausts a 512 MB
  serverless function after a few concurrent sign-ins, long before CPU matters.
  The stored value carries its own cost parameters (`scrypt$N$r$p$salt$hash`),
  so they can be raised later without invalidating existing accounts;
  `needsRehash` upgrades a hash on the next successful sign-in.
- **Sessions** are opaque 256-bit tokens, not JWTs — a JWT cannot be revoked
  before expiry without a server-side denylist, at which point its statelessness
  is gone. Only the SHA-256 of the token is stored, so reading the `sessions`
  table does not let anyone impersonate a customer; the raw token lives solely
  in the HttpOnly cookie.
- **Enumeration resistance**: sign-in spends the same time on an unknown address
  as on a known one (`fakeVerify`) and returns one generic error either way.
  Registration is the only place that says "this address is taken", because the
  alternative is an account the customer can never use.
- **Rate limiting** is per-process. It is a guardrail against credential stuffing
  from one source, not a distributed defence — move it to a shared store before
  running more than one instance.

**Not implemented yet:** password reset. It needs an outbound email service,
which this deployment does not have. The link was removed rather than left as a
button that silently does nothing.

## The AI advisor

`src/ai/flows/ai-powered-skincare-advisor-flow.ts` injects the real catalog into
the prompt and rejects any recommendation whose product id is not in it. If the
model is unreachable — including when `GOOGLE_GENAI_API_KEY` is unset — a
deterministic concern matcher answers instead, so the page always returns a
usable result. The server action in `app/[locale]/advisor/actions.ts` adds a
per-client rate limit (in-process; move it to a shared store before scaling out).

It calls the Gemini API directly with a response schema, so the reply is shaped
server-side rather than parsed out of prose — and is still validated with zod
afterwards, because a schema-constrained reply is not the same as a trustworthy
one. This replaced Genkit, which was pulling ~74 Firebase packages and 594
modules in total to serve a single prompt.

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
and JSON-LD all derive from it.

Nothing here is tied to a specific host. The app needs a Node runtime (the
Stripe webhook and password hashing both require it, so an Edge-only target will
not do) and a Postgres reachable from it. Run `npm run db:migrate` on deploy.

## Legal copy

`src/lib/legal.ts` holds structured template documents covering the EU/PT
baseline (distance selling, GDPR, cookies, accessibility). **Have them reviewed
by counsel before launch**, and bump `LEGAL_UPDATED` with any revision.
