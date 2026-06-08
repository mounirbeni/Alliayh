import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="h-32 w-32 rounded-full border-2 border-primary border-dashed flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <SearchX className="h-10 w-10 text-primary animate-[spin_10s_linear_infinite_reverse]" />
            </div>
          </div>
          
          <h1 className="font-headline text-7xl tracking-tighter text-glow text-primary">404</h1>
          <h2 className="font-headline text-3xl">Aura Not Found</h2>
          
          <p className="text-muted-foreground font-body leading-relaxed max-w-md mx-auto italic">
            The ritual or formulation you are seeking has either been removed or does not exist within our current archives.
          </p>

          <Link href="/products" className="inline-block mt-8">
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-12 h-14 uppercase tracking-widest text-[10px] font-bold shadow-2xl">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
