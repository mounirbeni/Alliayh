"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * Segment error boundary.
 *
 * Without one, any thrown error in a page replaced the whole document with
 * Next.js's unstyled default screen — no navigation, no branding, no way back.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dictionary: t, locale } = useLocaleStore();

  useEffect(() => {
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 gap-8">
      <span className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <AlertTriangle className="h-9 w-9" aria-hidden="true" />
      </span>

      <div className="space-y-3 max-w-md">
        <h1 className="font-headline text-3xl md:text-4xl tracking-tight">{t.errors.title}</h1>
        <p className="text-muted-foreground italic leading-relaxed">{t.errors.description}</p>
        {error.digest && (
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
            {t.errors.digest}: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={reset}
          className="rounded-full bg-primary hover:bg-primary/90 uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 gap-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.errors.retry}
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-primary/20 uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8"
        >
          <Link href={`/${locale}`}>{t.errors.backHome}</Link>
        </Button>
      </div>
    </div>
  );
}
