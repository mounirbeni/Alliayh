"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  Droplets,
  Flower2,
  Gift,
  Globe,
  Headphones,
  Heart,
  Leaf,
  Rabbit,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Truck,
  Users,
} from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { ComingSoon } from '@/components/media/ComingSoon';
import { Reveal } from '@/components/motion/Editorial';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import type { Product } from '@/lib/catalog';

/**
 * Home.
 *
 * Built to the supplied mockup, in its order:
 *
 *   1. split hero — copy left, the ritual photograph right, four brand marks
 *      along the bottom of the copy column,
 *   2. a trust strip,
 *   3. the category rail as circular marks,
 *   4. a favourites panel: a standing intro column beside a product rail,
 *   5. the plant-based banner with its seal,
 *   6. three reasons to choose the house.
 *
 * Colours and type come from the existing system; nothing here introduces a
 * new token.
 */
export function HomeView({ products }: { products: Product[] }) {
  const { dictionary: t, locale } = useLocaleStore();

  const heroMarks = [
    { icon: Leaf, label: t.hero.marks.botanical },
    { icon: Rabbit, label: t.hero.marks.crueltyFree },
    { icon: Droplets, label: t.hero.marks.clean },
    { icon: Users, label: t.hero.marks.allSkin },
  ];

  const trust = [
    { icon: Truck, title: t.trust.shippingTitle, desc: t.trust.shippingDesc },
    { icon: ShieldCheck, title: t.trust.paymentTitle, desc: t.trust.paymentDesc },
    { icon: Headphones, title: t.trust.supportTitle, desc: t.trust.supportDesc },
  ];

  /*
   * The rail links into the collection's own category and concern filters, so
   * every mark lands on a real, populated listing rather than a dead end.
   */
  const categories = [
    { icon: SprayCan, label: t.categoryRail.cleansing, href: `/${locale}/products?concern=clarity` },
    { icon: Droplets, label: t.categoryRail.serums, href: `/${locale}/products?category=gummies` },
    { icon: Flower2, label: t.categoryRail.hydration, href: `/${locale}/products?concern=hydration` },
    { icon: Sparkles, label: t.categoryRail.treatments, href: `/${locale}/products?concern=radiance` },
    { icon: Gift, label: t.categoryRail.kits, href: `/${locale}/products?category=tea` },
    { icon: Leaf, label: t.categoryRail.new, href: `/${locale}/products?sort=featured` },
  ];

  const reasons = [
    { icon: Leaf, title: t.whyChoose.naturalTitle, desc: t.whyChoose.naturalDesc },
    { icon: Heart, title: t.whyChoose.loveTitle, desc: t.whyChoose.loveDesc },
    { icon: Globe, title: t.whyChoose.consciousTitle, desc: t.whyChoose.consciousDesc },
  ];

  return (
    <>
      {/* ── 01 · HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-secondary/25">
        <div className="shell grid grid-cols-1 items-center gap-x-12 gap-y-10 lg:grid-cols-2 lg:gap-x-8">
          {/* Copy */}
          <div className="relative z-10 pb-4 lg:py-[clamp(3rem,6vw,6rem)]">
            <Reveal>
              <p className="label text-primary/70">{t.hero.badge}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 max-w-[16ch] font-display text-display-sm leading-[1.08] tracking-tightest text-primary">
                {t.hero.headline1} {t.hero.headline2}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[38ch] text-body-lg text-foreground/70">{t.hero.subtitle}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/products`}
                  className="label inline-flex min-h-[48px] items-center bg-primary px-8 text-primary-foreground transition-opacity hover:opacity-85"
                >
                  {t.hero.ctaShop}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="label inline-flex min-h-[48px] items-center border border-primary/35 bg-background px-8 text-primary transition-colors hover:border-primary"
                >
                  {t.hero.ctaStory}
                </Link>
              </div>
            </Reveal>

            {/* Brand marks */}
            <Reveal delay={0.24}>
              <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:mt-14">
                {heroMarks.map((mark) => (
                  <li key={mark.label} className="flex flex-col items-center gap-3 text-center">
                    <mark.icon className="h-6 w-6 text-primary" strokeWidth={1.25} aria-hidden="true" />
                    <span className="max-w-[12ch] text-body-sm leading-snug text-foreground/70">
                      {mark.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/*
            The products sit right of centre in the frame with clear space to
            their left, so the crop is anchored right — centred, the bottles
            drift out of the column and the panel reads as empty pink.
          */}
          {/*
            First on a phone. Stacked copy-then-image, the whole opening screen
            was type and the product never appeared until the visitor had
            scrolled past the headline, the subtitle, both buttons and four
            brand marks.
          */}
          <div className="relative -mx-[var(--gutter)] aspect-[3/2] order-first lg:order-none lg:ml-0 lg:aspect-auto lg:h-full lg:min-h-[34rem] lg:self-stretch">
            <Image
              src="/brand/hero-ritual.jpg"
              alt={t.hero.heroImageAlt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[78%_center]"
            />
          </div>
        </div>
      </section>

      {/* ── 02 · TRUST STRIP ───────────────────────────────────────────── */}
      <section aria-label={t.trust.shippingTitle} className="bg-secondary/40 rule-b">
        <ul className="shell grid grid-cols-1 gap-6 py-6 sm:grid-cols-3">
          {trust.map((item) => (
            <li key={item.title} className="flex items-center justify-center gap-3.5 text-center sm:text-left">
              <item.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.25} aria-hidden="true" />
              <span className="text-body-sm leading-snug text-foreground/75">
                <span className="block font-medium text-foreground">{item.title}</span>
                {item.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 03 · CATEGORY RAIL ─────────────────────────────────────────── */}
      <section className="section-sm shell">
        <Reveal>
          <h2 className="text-center font-display text-display-xs tracking-editorial text-primary">
            {t.categoryRail.title}
          </h2>
          <Ornament />
        </Reveal>

        <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-9 sm:grid-cols-6">
          {categories.map((category, i) => (
            <li key={category.label}>
              <Reveal delay={Math.min(i, 5) * 0.05}>
                <Link
                  href={category.href}
                  className="group flex flex-col items-center gap-3.5 text-center"
                >
                  <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-secondary/45 transition-colors duration-400 group-hover:bg-secondary">
                    <category.icon
                      className="h-7 w-7 text-primary"
                      strokeWidth={1.1}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-body-sm text-foreground/75 transition-colors group-hover:text-primary">
                    {category.label}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 04 · FAVOURITES ────────────────────────────────────────────── */}
      <section className="section-sm shell">
        <div className="grid grid-cols-1 gap-y-10 border border-rule bg-background p-6 sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:p-10">
          <div className="lg:col-span-4 lg:self-center">
            <Reveal>
              <p className="label text-primary/70">{t.favourites.badge}</p>
              <h2 className="mt-5 max-w-[18ch] font-display text-display-xs leading-[1.15] tracking-editorial">
                {t.favourites.headline}
              </h2>
              <Link
                href={`/${locale}/products`}
                className="label mt-8 inline-flex min-h-[48px] items-center bg-primary px-7 text-primary-foreground transition-opacity hover:opacity-85"
              >
                {t.favourites.cta}
              </Link>
            </Reveal>
          </div>

          {/*
            A scroll rail rather than a JavaScript carousel: it is reachable by
            keyboard, by trackpad, by touch and by screen reader without any of
            them needing a control we would have to build and label.
          */}
          <div className="lg:col-span-8">
            <ul className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
              {/*
                No scroll reveal on rail items. An IntersectionObserver tests
                both axes, so a card sitting off the right-hand end of the rail
                never intersects the viewport — it would stay at opacity 0 until
                the visitor scrolled it into view, and if they never scrolled
                the rail at all it would never appear.
              */}
              {products.map((product, i) => (
                <li
                  key={product.id}
                  className="w-[63vw] shrink-0 snap-start sm:w-[38vw] lg:w-[calc((100%-3rem)/3)]"
                >
                  <ProductCard product={product} priority={i < 2} compact />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 05 · PLANT-BASED BANNER ────────────────────────────────────── */}
      <section className="section-sm shell">
        <div className="grid grid-cols-1 overflow-hidden border border-rule bg-secondary/35 lg:grid-cols-2">
          {/* No photograph for this slot yet, so the placeholder stands in. */}
          <ComingSoon className="min-h-[16rem] border-0 lg:min-h-[22rem]" />

          <div className="relative flex flex-col justify-center gap-5 p-8 sm:p-12">
            <Reveal>
              <p className="label text-primary/70">{t.plantBased.badge}</p>
              <h2 className="mt-5 max-w-[20ch] font-display text-display-xs leading-[1.15] tracking-editorial text-primary">
                {t.plantBased.headline}
              </h2>
              <p className="mt-4 max-w-[44ch] text-body-sm leading-relaxed text-foreground/70">
                {t.plantBased.body}
              </p>
              <Link
                href={`/${locale}/about`}
                className="label mt-8 inline-flex min-h-[48px] items-center bg-primary px-7 text-primary-foreground transition-opacity hover:opacity-85"
              >
                {t.plantBased.cta}
              </Link>
            </Reveal>

            {/* The seal, as a stamp in the corner. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 right-8 hidden h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border border-primary/30 text-center xl:flex"
            >
              <span className="label-sm text-primary/70">{t.plantBased.sealTop}</span>
              <Leaf className="h-4 w-4 text-primary" strokeWidth={1.25} />
              <span className="label-sm text-primary/70">{t.plantBased.sealBottom}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 06 · WHY CHOOSE ────────────────────────────────────────────── */}
      <section className="section-sm shell pb-[clamp(3.5rem,7vw,7rem)]">
        <Reveal>
          <h2 className="text-center font-display text-display-xs tracking-editorial text-primary">
            {t.whyChoose.title}
          </h2>
          <Ornament />
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {reasons.map((reason, i) => (
            <li key={reason.title}>
              <Reveal delay={i * 0.07}>
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/45">
                    <reason.icon className="h-6 w-6 text-primary" strokeWidth={1.25} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-body text-body-md font-semibold text-foreground">
                      {reason.title}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-body-sm leading-relaxed text-foreground/65">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** The small ruled leaf that sits under each section title in the design. */
function Ornament() {
  return (
    <span aria-hidden="true" className="mt-5 flex items-center justify-center gap-3">
      <span className="h-px w-14 bg-rule" />
      <Leaf className="h-3.5 w-3.5 text-primary/50" strokeWidth={1.25} />
      <span className="h-px w-14 bg-rule" />
    </span>
  );
}
