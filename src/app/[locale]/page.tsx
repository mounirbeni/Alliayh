import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/app/lib/products";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { ProductCard } from "@/components/products/ProductCard";
import { localizedPath } from "@/lib/locale-path";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Star } from "lucide-react";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;

  const dictionary = await getDictionary(locale);
  const bestSellers = PRODUCTS.slice(0, 4);
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-skin");
  const brandImage = PlaceHolderImages.find((img) => img.id === "brand-story");

  const pillars = [
    { label: locale === "pt-PT" ? "100% Botânico" : "100% Botanical" },
    { label: locale === "pt-PT" ? "Grau Clínico" : "Clinical Grade" },
    { label: locale === "pt-PT" ? "Certificado UE" : "EU Certified" },
    { label: locale === "pt-PT" ? "Cruelty Free" : "Cruelty Free" },
    { label: locale === "pt-PT" ? "Neutro em Carbono" : "Carbon Neutral" },
  ];

  const marqueeText =
    locale === "pt-PT"
      ? "· Entrega gratuita acima de €75 · Testado por dermatologistas · Sem crueldade · Envio neutro em carbono · Fórmulas botânicas · "
      : "· Free delivery over €75 · Dermatologist tested · Cruelty free · Carbon-neutral shipping · Botanical formulas · ";

  return (
    <div className="overflow-x-hidden">
      {/* ── Announcement Marquee ── */}
      <div className="overflow-hidden border-b border-primary/10 bg-primary py-2.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-0 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground/90"
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage?.imageUrl ?? "/products/hero.svg"}
            alt="Lueur Skin"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        <div className="relative container mx-auto px-6 py-20 md:px-12">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">
              {dictionary.home.kicker}
            </p>
            <h1 className="mt-5 font-headline text-6xl leading-[0.95] text-white md:text-8xl">
              {dictionary.home.title.split(",").map((part, i) => (
                <span key={i} className="block">
                  {part.trim()}
                  {i < dictionary.home.title.split(",").length - 1 ? "," : ""}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-sm text-base leading-relaxed text-white/70">
              {dictionary.home.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-primary hover:bg-white/92 hover:text-primary"
              >
                <Link href={localizedPath("/products", locale)}>
                  {dictionary.home.cta}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 px-8 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={localizedPath("/advisor", locale)}>
                  {dictionary.nav.advisor}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="h-10 w-[1px] bg-white/50" />
        </div>
      </section>

      {/* ── Pillars strip ── */}
      <section className="border-y border-primary/10 bg-background">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-primary/10 md:grid-cols-5">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="flex items-center justify-center px-4 py-5 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/70">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/60">
              {locale === "pt-PT" ? "Mais Vendidos" : "Best Sellers"}
            </p>
            <h2 className="mt-1 font-headline text-4xl md:text-5xl">
              {dictionary.home.bestSellersTitle}
            </h2>
          </div>
          <Link
            href={localizedPath("/products", locale)}
            className="group hidden items-center gap-2 text-sm font-medium text-primary md:flex"
          >
            {locale === "pt-PT" ? "Ver Coleção" : "View Collection"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href={localizedPath("/products", locale)}>
              {locale === "pt-PT" ? "Ver Coleção" : "View Collection"}
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Philosophy Editorial ── */}
      <section className="relative overflow-hidden bg-foreground py-28">
        <div className="absolute inset-0 opacity-5">
          <Image
            src={brandImage?.imageUrl ?? "/products/brand.svg"}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative container mx-auto grid items-center gap-12 px-6 md:grid-cols-2 md:px-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-primary-foreground/40">
              {locale === "pt-PT" ? "Nossa Filosofia" : "Our Philosophy"}
            </p>
            <h2 className="mt-4 font-headline text-5xl text-primary-foreground md:text-6xl">
              {dictionary.home.philosophyTitle}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-primary-foreground/60">
              {dictionary.home.philosophyText}
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-full border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={localizedPath("/about", locale)}>
                {locale === "pt-PT" ? "A Nossa História" : "Our Story"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={brandImage?.imageUrl ?? "/products/brand.svg"}
              alt="Lueur Skin philosophy"
              fill
              className="object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="container mx-auto px-4 py-20">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-primary/60">
          {locale === "pt-PT" ? "Clientes" : "Clients"}
        </p>
        <h2 className="mt-2 text-center font-headline text-4xl">
          {dictionary.home.testimonialsTitle}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {dictionary.home.testimonialNames.map((name, i) => (
            <div
              key={name}
              className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-white/70 p-7"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground italic">
                &ldquo;{dictionary.home.testimonialText}&rdquo;
              </p>
              <p className="mt-5 text-sm font-semibold text-foreground">
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journal Preview ── */}
      <section className="border-t border-primary/10 bg-secondary/15 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary/60">
                {dictionary.journal.kicker}
              </p>
              <h2 className="mt-1 font-headline text-4xl">
                {dictionary.journal.title}
              </h2>
            </div>
            <Link
              href={localizedPath("/journal", locale)}
              className="group hidden items-center gap-2 text-sm font-medium text-primary md:flex"
            >
              {locale === "pt-PT" ? "Ver Todos" : "View All"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dictionary.journal.articles.map((article, idx) => (
              <article
                key={idx}
                className="group rounded-3xl border border-primary/10 bg-white/80 p-6"
              >
                <div className="mb-4 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/60 to-primary/10" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/60">
                  {article.category}
                </span>
                <h3 className="mt-2 font-headline text-xl leading-snug transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(new Date(article.date), locale as Locale)}</span>
                  <span>{article.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-foreground px-4 py-20">
        <div className="container mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-primary-foreground/40">
            {locale === "pt-PT" ? "Comunidade" : "Community"}
          </p>
          <h2 className="mt-3 font-headline text-4xl text-primary-foreground md:text-5xl">
            {locale === "pt-PT" ? "Entre no Ritual" : "Join the Ritual"}
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/55">
            {locale === "pt-PT"
              ? "Receba primeiros acessos, rituais sazonais e ciência da pele directamente no seu email."
              : "Early access to new formulas, seasonal rituals, and skin science — delivered to your inbox."}
          </p>
          <NewsletterForm locale={locale} />
          <p className="mt-4 text-xs text-primary-foreground/30">
            {locale === "pt-PT"
              ? "Sem spam. Cancele quando quiser."
              : "No spam. Unsubscribe at any time."}
          </p>
        </div>
      </section>
    </div>
  );
}
