"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/app/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface ProductWithCategory extends Product {
  category: string;
}

interface ProductsGridProps {
  products: ProductWithCategory[];
  categories: string[];
  locale: Locale;
  dictionary: Dictionary;
  filterAllLabel: string;
}

export function ProductsGrid({ products, categories, locale, dictionary, filterAllLabel }: ProductsGridProps) {
  const [active, setActive] = useState(filterAllLabel);

  const filtered = active === filterAllLabel
    ? products
    : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter strip */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] transition",
              active === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/20 text-foreground/60 hover:border-primary/50 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted-foreground">
          {filtered.length} {locale === "pt-PT" ? "produto" + (filtered.length !== 1 ? "s" : "") : "product" + (filtered.length !== 1 ? "s" : "")}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            dictionary={dictionary}
          />
        ))}
      </div>
    </div>
  );
}
