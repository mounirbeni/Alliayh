"use client";

import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteShell } from '@/components/layout/SiteShell';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * 404 inside a locale segment.
 *
 * Was hard-coded English and linked to `/products` without the locale prefix,
 * so the recovery link bounced through a redirect. It reads the active locale
 * from context, which `not-found.tsx` cannot receive as a route param.
 */
export default function NotFound() {
  const { dictionary: t, locale } = useLocaleStore();

  return (
    <SiteShell className="selection:bg-primary/10" mainClassName="flex items-center justify-center py-24">
      <div className="shell text-center space-y-8">
        <div className="flex justify-center mb-8">
          <span
            aria-hidden="true"
            className="h-32 w-32 rounded-full border-2 border-primary border-dashed flex items-center justify-center animate-[spin_10s_linear_infinite]"
          >
            <SearchX className="h-10 w-10 text-primary animate-[spin_10s_linear_infinite_reverse]" />
          </span>
        </div>

        <p className="font-headline text-7xl tracking-tighter text-primary">404</p>
        <h1 className="font-headline text-3xl">{t.common.notFound}</h1>

        <p className="text-muted-foreground font-body leading-relaxed max-w-md mx-auto italic">
          {t.common.notFoundDesc}
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 px-12 h-14 uppercase tracking-widest text-[10px] font-bold shadow-2xl"
          >
            <Link href={`/${locale}/products`}>{t.common.products}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-primary/20 px-12 h-14 uppercase tracking-widest text-[10px] font-bold"
          >
            <Link href={`/${locale}`}>{t.common.backToHome}</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
