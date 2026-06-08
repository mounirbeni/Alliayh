import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { Toaster } from '@/components/ui/toaster';
import { PromoPopup } from '@/components/layout/PromoPopup';
import { LocaleProvider } from '@/components/layout/LocaleProvider';
import { getDictionary, type Locale, LOCALE_BCP47, isValidLocale, DEFAULT_LOCALE } from '@/i18n';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const t = getDictionary(l);
  
  return {
    title: t.meta.title,
    description: t.meta.description,
    manifest: '/manifest.json',
    keywords: t.meta.keywords.split(', '),
    authors: [{ name: 'Alliyah' }],
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      type: 'website',
      locale: LOCALE_BCP47[l].replace('-', '_'),
      alternateLocale: l === 'pt' ? 'en_GB' : 'pt_PT',
    },
    alternates: {
      languages: {
        'pt-PT': '/pt',
        'en-GB': '/en',
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#781430',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prata&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 pb-mobile-nav md:pb-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider locale={locale}>
            {children}
            <MobileNav />
            <CartDrawer />
            <CookieConsent />
            <PromoPopup />
            <Toaster />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
