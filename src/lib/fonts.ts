/**
 * Typography — self-hosted via next/font.
 *
 * The typefaces are unchanged (Prata for headlines, Montserrat for body); only
 * the delivery changed. Serving them from our own origin removes two
 * render-blocking requests to fonts.googleapis.com, eliminates the flash of
 * unstyled text and lets Next.js emit a `size-adjust` fallback so the layout
 * does not shift when the webfont lands.
 */
import { Montserrat, Prata } from 'next/font/google';

export const fontBody = Montserrat({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
  // Variable weight axis — matches the 100..900 range the old <link> requested.
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  fallback: ['system-ui', 'sans-serif'],
});

export const fontHeadline = Prata({
  // Prata only publishes these subsets — requesting latin-ext fails the build.
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: '400',
  fallback: ['Georgia', 'serif'],
});

/** Class list applied to <html> so the CSS variables resolve everywhere. */
export const fontVariables = `${fontBody.variable} ${fontHeadline.variable}`;
