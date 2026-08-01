"use client";

import { Leaf, Truck } from 'lucide-react';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * The strip above the masthead.
 *
 * It scrolls away rather than pinning: it carries reassurance, not navigation,
 * so it does not deserve permanent room on a phone screen. The shipping note is
 * held back until there is width for it — at 390px the two messages together
 * wrap into three lines and neither reads.
 */
export function AnnouncementBar() {
  const { dictionary: t } = useLocaleStore();

  return (
    <div className="bg-primary text-[hsl(var(--primary-foreground))]">
      {/* `min-h`, not a fixed height: the promise wraps to two lines at 390px
          and a fixed 2.5rem bar clipped the second one. */}
      <div className="shell flex min-h-10 items-center justify-center gap-8 py-2 sm:justify-between">
        <p className="flex items-center gap-2.5">
          <Leaf className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
          <span className="label-sm text-center leading-relaxed">{t.announcement.promise}</span>
        </p>

        <p className="hidden items-center gap-2.5 sm:flex">
          <Truck className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
          <span className="label-sm whitespace-nowrap">{t.announcement.shipping}</span>
        </p>
      </div>
    </div>
  );
}
