import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

/**
 * The page frame: navigation, a landmark `<main>` and the footer.
 *
 * Every route used to repeat this scaffolding by hand, which is how several
 * pages ended up without a `<main>` landmark and none of them had an anchor for
 * the skip link. Centralising it guarantees one — and only one — `main` per
 * document, with a stable `#main-content` target.
 */
export function SiteShell({
  children,
  className,
  mainClassName,
}: {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
}) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background', className)}>
      <Navbar />
      <main id="main-content" tabIndex={-1} className={cn('flex-1 w-full', mainClassName)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
