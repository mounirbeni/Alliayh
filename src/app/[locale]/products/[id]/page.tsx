"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/app/lib/products";
import { dictionaries } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { formatCurrency, formatMessage, formatNumber } from "@/i18n/format";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCartStore } from "@/store/cart-store";
import { localizedPath } from "@/lib/locale-path";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  if (!isValidLocale(locale)) notFound();

  const dictionary = dictionaries[locale];
  const localizedProduct = dictionary.products.items[id as keyof typeof dictionary.products.items];
  const product = PRODUCTS.find((entry) => entry.id === id);
  const placeholder = useMemo(
    () => PlaceHolderImages.find((item) => item.id === product?.image),
    [product?.image],
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { toast } = useToast();

  if (!product) notFound();

  const baseImage = placeholder?.imageUrl || "/lueur-placeholder.svg";
  const gallery = [baseImage, baseImage, baseImage, baseImage];

  const related = PRODUCTS.filter((p) => p.id !== id).slice(0, 3);

  function handleAddToBag() {
    addItem({
      id: product!.id,
      image: gallery[0],
      name: localizedProduct.name,
      price: product!.price,
    });
    setAdded(true);
    toast({ title: dictionary.nav.addToBag, description: localizedProduct.name });
    setTimeout(() => setAdded(false), 2000);
    openCart();
  }

  const pt = locale === "pt-PT";

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={localizedPath("/", locale)} className="hover:text-primary transition">
          {pt ? "Início" : "Home"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={localizedPath("/products", locale)} className="hover:text-primary transition">
          {dictionary.nav.collection}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{localizedProduct.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
            <Image
              src={gallery[selectedImage]}
              alt={localizedProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                  selectedImage === idx ? "border-primary" : "border-primary/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={formatMessage(dictionary.a11y.selectProductImage, { index: idx + 1 })}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/60">
            {localizedProduct.category}
          </span>
          <h1 className="mt-2 font-headline text-5xl">{localizedProduct.name}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{localizedProduct.description}</p>
          <p className="mt-5 text-3xl font-semibold text-primary">{formatCurrency(product.price, locale)}</p>

          {/* Benefits pills */}
          {localizedProduct.benefits && (
            <div className="mt-5 flex flex-wrap gap-2">
              {localizedProduct.benefits.map((b: string) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-secondary/30 px-3 py-1 text-xs text-foreground/70"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary/60" />
                  {b}
                </span>
              ))}
            </div>
          )}

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="ingredients">
              <AccordionTrigger>{dictionary.products.details.ingredients}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {localizedProduct.ingredients.map((ingredient: string) => (
                    <li key={ingredient} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary/40" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="usage">
              <AccordionTrigger>{dictionary.products.details.usage}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {localizedProduct.usage}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 space-y-2 rounded-2xl border border-primary/10 p-5">
            <p className="text-sm font-medium">{dictionary.products.details.reviewsTitle}</p>
            <p className="text-sm text-muted-foreground">
              {formatMessage(dictionary.products.details.reviewsSummary, {
                count: formatNumber(product.reviewsCount, locale),
                rating: product.rating,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky add to bag bar */}
      <div className="sticky bottom-3 mt-10 flex items-center justify-between rounded-2xl border border-primary/15 bg-background/95 p-3 shadow-lg backdrop-blur">
        <div>
          <p className="text-sm text-muted-foreground">{localizedProduct.name}</p>
          <p className="font-semibold">{formatCurrency(product.price, locale)}</p>
        </div>
        <Button
          className="rounded-full min-w-[140px] transition"
          onClick={handleAddToBag}
        >
          {added ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {pt ? "Adicionado" : "Added"}
            </span>
          ) : (
            dictionary.nav.addToBag
          )}
        </Button>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-primary/10 pt-14">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/60">
            {pt ? "Completa o Ritual" : "Complete the Ritual"}
          </p>
          <h2 className="mt-2 font-headline text-4xl">
            {pt ? "Também pode gostar" : "You may also like"}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
