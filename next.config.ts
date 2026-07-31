import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
});

/**
 * Security headers.
 *
 * The Content-Security-Policy is deliberately permissive about inline styles
 * (Tailwind and Radix inject them) but locks down script and frame origins.
 * `'unsafe-eval'` is only allowed in development, where React refresh needs it.
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Firebase Auth talks to Google's identity endpoints from the browser. With a
 * bare `connect-src 'self'` every sign-in is blocked by the policy before it
 * leaves the page, so these origins have to be allowed explicitly.
 *
 * Stripe needs nothing here: hosted checkout is a top-level navigation, not a
 * fetch, so it is unaffected by connect-src.
 */
const FIREBASE_CONNECT_SRC = [
  'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com',
  'https://firebaseinstallations.googleapis.com',
];

/** The auth domain hosts the iframe Firebase uses to persist auth state. */
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const FIREBASE_FRAME_SRC = authDomain ? [`https://${authDomain}`] : [];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${FIREBASE_CONNECT_SRC.join(' ')}`,
  `frame-src 'self' ${FIREBASE_FRAME_SRC.join(' ')}`.trim(),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // Stripe's hosted checkout is reached by navigation, but keep form posts to
  // our own origin.
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Build-time correctness is enforced again. Type and lint errors used to be
  // suppressed here, which let broken code reach production unnoticed.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },

  images: {
    // All product imagery is served locally from /public/products/.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    // Tree-shake the icon and animation barrels instead of pulling in the
    // whole package on every route that imports a single symbol.
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/products/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
