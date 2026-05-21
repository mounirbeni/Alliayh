import { notFound } from "next/navigation";
import { PRODUCTS } from "@/app/lib/products";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { ProductsGrid } from "@/components/products/ProductsGrid";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const pt = locale === "pt-PT";

  const productsWithCategory = PRODUCTS.map((p) => ({
    ...p,
    category: dictionary.products.items[p.id as keyof typeof dictionary.products.items]?.category ?? "",
  }));

  const categories = [
    dictionary.products.filterAll,
    ...Array.from(new Set(productsWithCategory.map((p) => p.category))),
  ];

  return (
    <section>
      {/* Page header */}
      <div className="border-b border-primary/10 bg-background py-14">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/60">
            {pt ? "Produtos" : "Products"}
          </p>
          <h1 className="mt-2 font-headline text-5xl md:text-6xl">{dictionary.nav.collection}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {pt
              ? `${PRODUCTS.length} fórmulas botanicamente precisas`
              : `${PRODUCTS.length} botanically-precise formulas`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <ProductsGrid
          products={productsWithCategory}
          categories={categories}
          locale={locale}
          dictionary={dictionary}
          filterAllLabel={dictionary.products.filterAll}
        />
      </div>
    </section>
  );
}
