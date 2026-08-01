"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * Placeholder for a slot whose artwork does not exist yet.
 *
 * Deliberately not an image file. A component scales to any slot without a
 * second asset per aspect ratio, costs no network request, follows the theme,
 * and — because it carries real text rather than a picture of text — stays
 * legible to screen readers and translates with the rest of the site.
 *
 * It is styled as a proper part of the system (ruled frame, house mark, small
 * caps label) so an unfilled slot reads as intentional rather than broken.
 */
export function ComingSoon({
  className,
  label,
  markClassName,
}: {
  className?: string;
  /** Overrides the default "Coming soon" caption. */
  label?: string;
  markClassName?: string;
}) {
  const { dictionary: t } = useLocaleStore();
  const caption = label ?? t.common.comingSoon;

  return (
    <div
      role="img"
      aria-label={caption}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 overflow-hidden',
        'border border-rule bg-secondary/30 dark:bg-muted',
        className,
      )}
    >
      <Image
        src="/brand/lueur-mark.png"
        alt=""
        width={640}
        height={587}
        aria-hidden="true"
        className={cn('h-auto w-[22%] max-w-[8rem] min-w-[3rem] opacity-40', markClassName)}
      />
      <span aria-hidden="true" className="label text-primary/55">
        {caption}
      </span>
    </div>
  );
}
