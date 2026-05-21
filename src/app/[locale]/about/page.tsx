import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const t = dictionary.about;

  const brandImage = PlaceHolderImages.find((img) => img.id === "brand-story");

  const valueIcons = ["🌿", "🔬", "🌍"];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background px-4 py-24 text-center">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.kicker}</p>
          <h1 className="mt-4 font-headline text-5xl md:text-7xl">{t.title}</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
          <Image
            src={brandImage?.imageUrl ?? "/lueur-placeholder.svg"}
            alt={t.philosophyTitle}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.philosophyTitle}</p>
          <h2 className="mt-3 font-headline text-4xl">{t.philosophyTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t.philosophyBody}</p>
        </div>
      </section>

      <section className="bg-secondary/20 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-headline text-4xl">{t.valuesTitle}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.values.map((value, idx) => (
              <div
                key={value.title}
                className="rounded-3xl border border-primary/10 bg-white/70 p-8"
              >
                <p className="text-3xl">{valueIcons[idx]}</p>
                <h3 className="mt-4 font-headline text-2xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <div className="container mx-auto max-w-2xl">
          <p className="font-headline text-2xl italic text-primary/80 md:text-3xl">
            {t.closingQuote}
          </p>
        </div>
      </section>
    </div>
  );
}
