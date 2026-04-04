import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JOURNAL_ARTICLES } from '@/app/lib/journal';
import { PRODUCTS } from '@/app/lib/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = JOURNAL_ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center p-4">
        <Navbar />
        <h1 className="text-4xl font-headline mb-4">Article Not Found</h1>
        <Link href="/journal">
          <Button>Back to Journal</Button>
        </Link>
      </div>
    );
  }

  const relatedProductsList = article.relatedProducts 
    ? PRODUCTS.filter(p => article.relatedProducts?.includes(p.id))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Article Hero */}
        <article>
          <header className="pt-24 pb-12 text-center container mx-auto px-4 max-w-4xl space-y-8">
            <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] font-headline uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-3 w-3" /> Back to Journal
            </Link>
            
            <div className="flex items-center justify-center gap-4 text-xs font-headline uppercase tracking-widest text-primary font-bold">
              <span>{article.category}</span>
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              <span>{article.readTime}</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-6xl tracking-tight leading-tight">{article.title}</h1>
            
            <div className="pt-8 flex items-center justify-center gap-6 text-sm">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-headline text-primary font-bold">
                   {article.author[0]}
                 </div>
                 <div className="text-left">
                   <div className="font-headline uppercase tracking-widest text-xs font-bold">{article.author}</div>
                   <div className="text-[10px] text-muted-foreground uppercase">{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                 </div>
               </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="container mx-auto px-4 mb-16">
            <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-[3rem] overflow-hidden shadow-xl border border-primary/10">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Prose */}
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="prose prose-lg dark:prose-invert prose-headings:font-headline prose-headings:font-normal prose-h3:text-3xl prose-h3:mt-12 prose-a:text-primary prose-a:font-bold prose-p:font-body prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:italic w-full max-w-none">
              {/* To handle the multiline string from our mock data properly, we can split by double newlines to make paragraphs, and check for headings */}
              {typeof article.content === 'string' ? (
                article.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
                  }
                  return <p key={i}>{paragraph}</p>;
                })
              ) : (
                article.content
              )}
            </div>
            
            {/* Share / Footer */}
            <div className="mt-16 pt-8 border-t border-primary/10 flex items-center justify-between">
               <span className="font-headline uppercase tracking-widest text-sm">Share this ritual</span>
               <div className="flex gap-4">
                 <button className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/5 transition-colors">X</button>
                 <button className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/5 transition-colors">in</button>
               </div>
            </div>
          </div>
        </article>

        {/* Shop the Ritual (Related Products) */}
        {relatedProductsList.length > 0 && (
          <section className="mt-32 pt-24 border-t border-primary/10 bg-primary/5">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 space-y-4">
                <span className="text-primary font-luxury text-sm">Curated for this article</span>
                <h2 className="font-headline text-fluid-h2 tracking-tighter uppercase">Shop The Ritual</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {relatedProductsList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
