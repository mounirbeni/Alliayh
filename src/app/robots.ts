import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * Crawl directives.
 *
 * Transactional and personal routes are excluded: they hold no indexable
 * content and, in the case of checkout, can carry order state in the URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/cart',
          '/*/checkout',
          '/*/account',
          '/*/wishlist',
          '/*/login',
          '/*/register',
          '/api/',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
