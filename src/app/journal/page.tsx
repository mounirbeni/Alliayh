import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JOURNAL_ARTICLES } from '@/app/lib/journal';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function JournalPage() {
  const featuredArticle = JOURNAL_ARTICLES[0];
  const gridArticles = JOURNAL_ARTICLES.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 md:py-32 bg-primary/5 text-center px-4">
          <div className="container mx-auto max-w-3xl space-y-6">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center text-primary shadow-lg border border-primary/10">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <h1 className="font-headline text-fluid-h1 tracking-tighter uppercase">The Journal</h1>
            <p className="text-muted-foreground font-body text-lg italic leading-relaxed max-w-2xl mx-auto">
              A curated space for botanical wisdom, mindful beauty rituals, and the science of true radiance.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          {/* Featured Article */}
          <div className="mb-24 relative rounded-[3rem] overflow-hidden bg-white dark:bg-black/20 border border-primary/10 shadow-sm flex flex-col lg:flex-row group cursor-pointer transition-all hover:shadow-xl">
            <Link href={`/journal/${featuredArticle.slug}`} className="absolute inset-0 z-10" aria-label={`Read ${featuredArticle.title}`}></Link>
            <div className="relative w-full lg:w-3/5 aspect-[4/3] lg:aspect-auto h-auto lg:min-h-[500px]">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[10s] ease-out"
                priority
              />
            </div>
            <div className="w-full lg:w-2/5 p-8 md:p-16 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4 text-xs font-headline uppercase tracking-widest text-primary font-bold">
                <span>{featuredArticle.category}</span>
                <span className="w-1 h-1 rounded-full bg-primary/50" />
                <span>{featuredArticle.readTime}</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl leading-tight group-hover:text-primary transition-colors">{featuredArticle.title}</h2>
              <p className="text-muted-foreground italic leading-relaxed text-lg">
                {featuredArticle.excerpt}
              </p>
              <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
                <span className="text-sm font-headline uppercase tracking-widest font-bold">{featuredArticle.author}</span>
                <span className="text-xs text-muted-foreground">{new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Grid Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {gridArticles.map((article) => (
              <div key={article.slug} className="group cursor-pointer">
                <Link href={`/journal/${article.slug}`}>
                  <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-6 bg-primary/5">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-headline uppercase tracking-widest text-primary font-bold">
                      <span>{article.category}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/50" />
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-headline text-3xl leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground italic line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
