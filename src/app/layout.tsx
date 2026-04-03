import type {Metadata, Viewport} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'Lueur Skin by Alliyah | Elegance in Skincare',
  description: 'Premium skincare solutions for your unique glow. Experience the luxury of Lueur Skin by Alliyah.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#781430',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          {children}
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
