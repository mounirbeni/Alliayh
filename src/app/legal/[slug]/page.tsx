import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the destructured slug to resolve the promise legally per NextJS 15 patterns
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const formattedTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-black/20 p-8 md:p-16 rounded-[4rem] border border-primary/10 shadow-lg">
            <h1 className="font-headline text-5xl tracking-tight mb-12 uppercase">{formattedTitle}</h1>
            
            <div className="space-y-8 text-muted-foreground font-body leading-relaxed text-sm">
              <p className="italic">
                Effective Date: October 2026. 
              </p>
              
              <section className="space-y-4">
                 <h2 className="font-headline text-xl text-foreground mt-8">1. Introduction to our {formattedTitle}</h2>
                 <p>
                   Welcome to Lueur Skin by Alliyah. These documents govern your use of our platform and access to our bespoke skincare collections. By accessing or shopping within our archives, you agree to be bound by these provisions designed to protect your aura and privacy.
                 </p>
              </section>

               <section className="space-y-4">
                 <h2 className="font-headline text-xl text-foreground mt-8">2. Digital Standards</h2>
                 <p>
                   All content represented here remains the intellectual property of Lueur Skin. We enforce strict digital encryption methods to guarantee your data and personal typologies remain strictly confidential.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="font-headline text-xl text-foreground mt-8">3. Modifications</h2>
                 <p>
                   We reserve the right, at our sole discretion, to modify or replace these guidelines at any time. We recommend periodic review to align your usage with our latest protective measures.
                 </p>
              </section>

              <div className="pt-12 mt-12 border-t border-primary/10">
                <Link href="/" className="text-primary hover:underline font-bold text-xs uppercase tracking-widest">
                  Return to Sanctuary
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
