import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Toaster } from '@/components/ui/toaster';
import { PromoPopup } from '@/components/layout/PromoPopup';
import { LocaleProvider } from '@/components/layout/LocaleProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { fontVariables } from '@/lib/fonts';
import { SITE, absoluteUrl } from '@/lib/site';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/seo';
import { getDictionary, isValidLocale, LOCALES, type Locale } from '@/i18n';

type LayoutParams = { params: Promise<{ locale: string }> };

/** Pre-render both language trees at build time instead of per request. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    // `metadataBase` is what turns the relative URLs below into absolute ones;
    // without it Next.js warns and social cards resolve to nothing.
    metadataBase: new URL(SITE.url),
    title: {
      default: t.meta.title,
      template: `%s | ${SITE.name}`,
    },
    description: t.meta.description,
    applicationName: SITE.legalName,
    manifest: '/manifest.webmanifest',
    keywords: t.meta.keywords.split(',').map((keyword) => keyword.trim()),
    authors: [{ name: SITE.founder }],
    creator: SITE.founder,
    publisher: SITE.legalName,
    formatDetection: { telephone: false, address: false, email: false },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/icons/icon-192x192.png', sizes: '192x192' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      type: 'website',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      siteName: SITE.legalName,
      url: absoluteUrl(`/${locale}`),
      images: [{ url: absoluteUrl('/products/glow-tea-front.jpg'), width: 1200, height: 630 }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SITE.backgroundColor },
    { media: '(prefers-color-scheme: dark)', color: SITE.themeColor },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = getDictionary(typedLocale);

  return (
    <html lang={typedLocale} dir="ltr" className={fontVariables} suppressHydrationWarning>
      <body className="font-body antialiased selection:bg-primary/20 pb-mobile-nav md:pb-0">
        {/* Keyboard users can jump past the navigation on every page. */}
        <a href="#main-content" className="skip-link">
          {t.a11y.skipToContent}
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider locale={typedLocale}>
            <AuthProvider>
              {children}
              <MobileNav />
              <CartDrawer />
              <CookieConsent />
              <PromoPopup />
              <Toaster />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
        <JsonLd data={[organizationJsonLd(typedLocale), webSiteJsonLd(typedLocale)]} />
      </body>
    </html>
  );
}
