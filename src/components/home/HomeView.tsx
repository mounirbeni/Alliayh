"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import {
  DrawRule,
  Magnetic,
  Marquee,
  MaskReveal,
  ParallaxFrame,
  Reveal,
} from '@/components/motion/Editorial';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import type { Product } from '@/lib/catalog';

/**
 * Home.
 *
 * Rebuilt as an editorial sequence rather than a stack of rounded cards:
 *
 *   1. a full-bleed hero whose headline rises out of its own mask,
 *   2. a marquee that turns the value props into a moving rule,
 *   3. a balanced philosophy split over a full-width pillar index,
 *   4. the collection as a numbered catalogue,
 *   5. testimonials as pull-quotes, not cards,
 *   6. an inverted closing panel for the advisor.
 *
 * The palette is untouched. What changed is the typography, the grid, and the
 * decision to use hairlines and negative space where the old design used
 * shadows and radius.
 */
export function HomeView({ products }: { products: Product[] }) {
  const { dictionary: t, locale } = useLocaleStore();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const values = [
    t.values.crueltyFree,
    t.values.labTested,
    t.values.freeShipping,
    t.values.authentic,
  ];

  const pillars = [
    { title: t.philosophy.botanical, desc: t.philosophy.botanicalDesc },
    { title: t.philosophy.clinical, desc: t.philosophy.clinicalDesc },
    { title: t.philosophy.luminous, desc: t.philosophy.luminousDesc },
    { title: t.philosophy.barrier, desc: t.philosophy.barrierDesc },
  ];

  return (
    <>
      {/* ── 01 · HERO ──────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative -mt-[var(--header-height)] flex min-h-[100svh] items-end overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale: heroScale, opacity: heroFade }}
        >
          <Image
            src="/products/glow-tea-front.jpg"
            alt={t.hero.heroImageAlt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover duotone-strong"
          />
          {/*
            Scrim. The hero image is light, so the copy needs a floor it can be
            read against rather than a decorative wash — the midpoint is pulled
            up to 45% and weighted so the whole lower half, where the headline
            and subtitle sit, stays dark enough for AA contrast. The top stays
            near-transparent so the photograph still reads.
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(343_71%_8%/0.94)] via-[hsl(343_71%_8%/0.68)] via-45% to-[hsl(343_71%_8%/0.12)]" />
        </motion.div>

        {/*
          On mobile the tab bar is pinned to the bottom edge, so the hero has to
          clear it — otherwise the secondary call to action sits underneath it.
        */}
        <div className="shell relative z-10 w-full pb-[calc(var(--mobile-nav-height)+2.5rem)] pt-[calc(var(--header-height)+3rem)] md:pb-[clamp(3rem,7vw,6rem)]">
          <Reveal>
            <p className="label text-[hsl(var(--secondary))]">{t.hero.badge}</p>
          </Reveal>

          <h1 className="mt-6 font-display text-display-lg tracking-tightest text-[hsl(var(--primary-foreground))]">
            <MaskReveal delay={0.1}>{t.hero.headline1}</MaskReveal>
            <MaskReveal delay={0.2}>
              <span className="wonk text-[hsl(var(--secondary))]">{t.hero.headline2}</span>
            </MaskReveal>
          </h1>

          <div className="mt-10 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
            <Reveal delay={0.35} className="md:col-span-5">
              <p className="max-w-prose text-lede text-[hsl(var(--primary-foreground))]/90">
                {t.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.45} className="md:col-span-7 md:justify-self-end">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <Magnetic>
                  <Link
                    href={`/${locale}/products`}
                    className="group inline-flex items-center gap-3 border-b border-[hsl(var(--primary-foreground))]/40 pb-2 label text-[hsl(var(--primary-foreground))] transition-colors hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))]"
                  >
                    {t.hero.ctaShop}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-400 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Magnetic>

                <Magnetic>
                  <Link
                    href={`/${locale}/advisor`}
                    className="group inline-flex items-center gap-3 border-b border-transparent pb-2 label text-[hsl(var(--primary-foreground))]/70 transition-colors hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))]"
                  >
                    {t.hero.ctaStory}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-400 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 02 · MARQUEE ───────────────────────────────────────────────── */}
      <section aria-label={t.values.crueltyFree} className="rule-b bg-primary py-5 text-[hsl(var(--primary-foreground))]">
        <Marquee>
          {values.map((value) => (
            <span key={value} className="flex items-center">
              <span className="label whitespace-nowrap px-8">{value}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current opacity-50" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── 03 · PHILOSOPHY ────────────────────────────────────────────── */}
      {/*
        Two balanced columns, then the pillars full width beneath them.
        This was a 5/7 split with a sticky left column: the text ran out after
        ~600px while the right column carried an image plus the whole pillar
        list, leaving roughly 1100px of empty page beside it. Nothing about that
        void read as considered — it read as unfinished.
      */}
      <section className="section shell">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="label text-foreground/45">{t.philosophy.badge}</p>
            </Reveal>

            <h2 className="mt-6 font-display text-display-md tracking-tightest">
              <MaskReveal>{t.philosophy.headline1}</MaskReveal>
              <MaskReveal delay={0.08}>
                <span className="wonk text-primary">{t.philosophy.headline2}</span>
              </MaskReveal>
            </h2>

            <Reveal delay={0.15}>
              <blockquote className="mt-10 max-w-prose border-l border-primary/30 pl-6 font-display text-lede italic text-foreground/70">
                {t.philosophy.quote}
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            {/*
              A packshot on a white sweep, so it is contained on a tinted plate
              rather than cropped to fill. `object-cover` in a tall frame sliced
              the lid off the jar.
            */}
            <ParallaxFrame className="aspect-square w-full rule-t rule-b rule-l rule-r bg-white" amount={9}>
              <Image
                src="/products/sea-moss-front.jpg"
                alt={t.philosophy.philosophyImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain duotone p-8"
              />
            </ParallaxFrame>
          </div>
        </div>

        {/* Pillars as a ruled index across the full measure. */}
        <dl className="mt-[clamp(3.5rem,7vw,7rem)] grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.06}>
              <div className="h-full pt-6 rule-t">
                <span aria-hidden="true" className="numeral block text-label text-foreground/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt className="mt-4 font-display text-display-xs leading-[1.1] tracking-editorial">
                  {pillar.title}
                </dt>
                <dd className="mt-3 pb-8 text-body-sm text-foreground/60">{pillar.desc}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ── 04 · THE COLLECTION ────────────────────────────────────────── */}
      <section className="section shell">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
          <div>
            <Reveal>
              <p className="label text-foreground/45">{t.bestSellers.badge}</p>
            </Reveal>
            <h2 className="mt-5 font-display text-display-md tracking-tightest">
              <MaskReveal>
                {t.bestSellers.headline1} <span className="wonk text-primary">{t.bestSellers.headline2}</span>
              </MaskReveal>
            </h2>
          </div>

          <Reveal delay={0.1}>
            <Link
              href={`/${locale}/products`}
              className="group inline-flex items-center gap-3 border-b border-rule pb-2 label transition-colors hover:border-primary hover:text-primary"
            >
              {t.bestSellers.viewAll}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-400 ease-editorial group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>

        <DrawRule className="mb-12" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.07} className="h-full">
              <ProductCard product={product} index={i} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 05 · PULL QUOTES ───────────────────────────────────────────── */}
      <section className="section bg-muted/40 grain relative">
        <div className="shell relative z-10">
          <Reveal>
            <p className="label text-center text-foreground/45">{t.testimonials.badge}</p>
          </Reveal>

          <h2 className="mt-6 text-center font-display text-display-md tracking-tightest">
            <MaskReveal>
              {t.testimonials.headline1}{' '}
              <span className="wonk text-primary">{t.testimonials.headline2}</span>
            </MaskReveal>
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
            {t.testimonials.reviews.map((review, i) => (
              <Reveal key={review.name} delay={i * 0.1}>
                <figure className="flex h-full flex-col">
                  <span aria-hidden="true" className="font-display text-display-sm leading-none text-primary/25">
                    &ldquo;
                  </span>
                  <blockquote className="-mt-4 flex-1 font-display text-lede italic leading-relaxed text-foreground/80">
                    {review.text}
                  </blockquote>
                  <figcaption className="mt-6 pt-4 rule-t">
                    <span className="label block">{review.name}</span>
                    <span className="label-sm mt-2 block text-foreground/45">{review.location}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 · ADVISOR ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-[hsl(var(--primary-foreground))] grain">
        <div className="shell relative z-10 grid grid-cols-1 items-center gap-12 py-[clamp(4rem,8vw,8rem)] lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="label text-[hsl(var(--secondary))]">{t.advisorCta.badge}</p>
            </Reveal>

            <h2 className="mt-6 font-display text-display-md tracking-tightest">
              <MaskReveal>{t.advisorCta.headline1}</MaskReveal>
              <MaskReveal delay={0.08}>
                <span className="wonk text-[hsl(var(--secondary))]">{t.advisorCta.headline2}</span>
              </MaskReveal>
            </h2>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-prose text-body-lg text-[hsl(var(--primary-foreground))]/70">
                {t.advisorCta.description}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <Magnetic>
                <Link
                  href={`/${locale}/advisor`}
                  className="group mt-10 inline-flex items-center gap-3 border-b border-[hsl(var(--primary-foreground))]/40 pb-2 label transition-colors hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))]"
                >
                  {t.advisorCta.cta}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-400 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </Link>
              </Magnetic>
            </Reveal>
          </div>

          {/*
            The photograph is a packshot on a white sweep. Dropped straight onto
            the burgundy it read as a white rectangle someone forgot to mask —
            and `object-cover` cropped the pouch on top of that. Framing it as a
            deliberate light plate inset into the panel is honest about what the
            asset is, and looks intended rather than composited by accident.
          */}
          <Reveal delay={0.1}>
            <ParallaxFrame
              className="aspect-square w-full border border-[hsl(var(--secondary))]/25 bg-white"
              amount={8}
            >
              <Image
                src="/products/glow-tea-front.jpg"
                alt={t.advisorCta.advisorImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain duotone p-8"
              />
            </ParallaxFrame>
          </Reveal>
        </div>
      </section>
    </>
  );
}
