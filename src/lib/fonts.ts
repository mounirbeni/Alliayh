/**
 * Typography.
 *
 * The palette is fixed; the type is not. Prata + Montserrat read as a competent
 * template — a static display serif and a geometric sans that every second
 * storefront uses. This pairing is chosen to give the brand a voice:
 *
 *   Fraunces — a variable "old-style" serif with an optical-size axis and a
 *   WONK axis that reintroduces the calligraphic quirks digital type usually
 *   sands off. At display sizes it is unmistakably editorial; at small sizes
 *   the optical axis keeps it readable. This is the brand's signature.
 *
 *   Instrument Sans — a slightly condensed neo-grotesque. It gets out of the
 *   way of the serif, sets tightly in the small uppercase labels this design
 *   leans on, and holds up in long product copy.
 *
 * Both are variable and self-hosted through next/font: two files, no
 * render-blocking request, and a size-adjusted fallback so nothing shifts.
 */
import { Fraunces, Instrument_Sans } from 'next/font/google';

export const fontDisplay = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
  // No `weight` — that is what keeps this a variable font, which in turn is
  // what makes the extra axes available. `SOFT` rounds the terminals and `WONK`
  // enables the swashed forms; `opsz` is driven per-step in globals.css so
  // display sizes get the high-contrast cut and small text stays legible.
  // Together they are what stop this reading as a generic Georgia substitute.
  axes: ['SOFT', 'WONK', 'opsz'],
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const fontBody = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

/** Class list applied to <html> so the CSS variables resolve everywhere. */
export const fontVariables = `${fontDisplay.variable} ${fontBody.variable}`;
