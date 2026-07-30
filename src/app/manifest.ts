import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { DEFAULT_LOCALE } from '@/i18n';

/**
 * Web app manifest, generated rather than hand-maintained.
 *
 * The static `public/manifest.json` pointed `start_url` at `/`, which the
 * locale middleware immediately redirects — costing every PWA launch an extra
 * round trip and breaking the installed-app scope check. It also declared
 * `orientation: portrait`, locking rotation on tablets.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.shortName,
    description: 'Premium botanical skincare and wellness rituals by Alliyah.',
    // Point straight at a localised route so the launch does not redirect.
    start_url: `/${DEFAULT_LOCALE}`,
    scope: '/',
    display: 'standalone',
    background_color: SITE.backgroundColor,
    theme_color: SITE.themeColor,
    lang: DEFAULT_LOCALE,
    categories: ['shopping', 'lifestyle', 'health'],
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcuts: [
      { name: 'Collection', url: `/${DEFAULT_LOCALE}/products` },
      { name: 'Skin Advisor', url: `/${DEFAULT_LOCALE}/advisor` },
    ],
  };
}
