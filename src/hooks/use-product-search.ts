"use client";

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n';

export interface SearchHit {
  id: string;
  name: string;
  categoryLabel: string;
  price: number;
  image: string;
  imageAlt: string;
  href: string;
  inStock: boolean;
}

/**
 * Debounced product search against `/api/search`.
 *
 * In-flight requests are aborted when the query changes, so a fast typist never
 * sees results from an earlier keystroke overwrite the current ones.
 */
export function useProductSearch(query: string, locale: Locale, delay = 200) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const data = (await response.json()) as { results: SearchHit[] };
        setResults(data.results);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale, delay]);

  return { results, isSearching };
}
