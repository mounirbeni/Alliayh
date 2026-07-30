import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Breadcrumb trail.
 *
 * Deep pages previously offered no way back other than the browser button, and
 * search engines had no hierarchy signal for product URLs. The markup pairs with
 * the `BreadcrumbList` JSON-LD emitted by the same pages.
 */
export function Breadcrumbs({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label={label} className="w-full">
      <ol className="flex flex-wrap items-center gap-2 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2 min-w-0">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-primary truncate max-w-[45vw]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-primary transition-colors truncate">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
