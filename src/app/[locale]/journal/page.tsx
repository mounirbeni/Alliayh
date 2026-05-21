import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/config";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const t = dictionary.journal;

  return (
    <div>
      <section className="bg-gradient-to-b from-secondary/20 to-background px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.kicker}</p>
          <h1 className="mt-3 font-headline text-5xl md:text-7xl">{t.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{t.subtitle}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          {t.articles.map((article, idx) => (
            <article
              key={idx}
              className="group flex flex-col rounded-3xl border border-primary/10 bg-white/70 p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 aspect-video overflow-hidden rounded-2xl bg-secondary/30" />

              <Badge
                variant="secondary"
                className="mb-3 w-fit rounded-full text-xs font-medium"
              >
                {article.category}
              </Badge>

              <h2 className="font-headline text-xl leading-snug transition-colors group-hover:text-primary">
                {article.title}
              </h2>

              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-primary/5 pt-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(new Date(article.date), locale as Locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">{article.readTime}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary transition-gap group-hover:gap-2">
                  {t.readMore}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
