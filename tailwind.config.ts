import type { Config } from 'tailwindcss';

/**
 * Design tokens.
 *
 * The colour scale is unchanged — it is the brand. Everything above it has been
 * rebuilt: an editorial type scale, a radius scale that is mostly sharp with
 * one signature curve, and easings with actual character instead of `ease-out`.
 */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Fraunces for anything that carries the brand's voice.
        display: ['var(--font-display)', 'Georgia', 'serif'],
        // Instrument Sans for everything that has to be read, not admired.
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        // Kept so any straggling `font-headline` still resolves to the display face.
        headline: ['var(--font-display)', 'Georgia', 'serif'],
        code: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /**
       * Fluid editorial scale. Every step is a clamp, so there are no
       * breakpoint jumps — the page reflows continuously.
       */
      fontSize: {
        micro: ['0.625rem', { lineHeight: '1', letterSpacing: '0.24em' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        lede: ['clamp(1.125rem, 0.6vw + 1rem, 1.5rem)', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
        'display-xs': ['clamp(1.5rem, 1.5vw + 1rem, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2rem, 2.5vw + 1rem, 3.25rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2.75rem, 5vw + 1rem, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3.5rem, 9vw, 9rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(4rem, 14vw, 15rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
      },

      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        /** Hairline rule colour — the design leans on thin lines, not boxes. */
        rule: 'hsl(var(--rule))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      /**
       * Mostly sharp. The old design applied a 2.5rem blob to everything, which
       * flattens hierarchy — when every element is equally soft, none reads as
       * deliberate. One large curve is reserved as a signature.
       */
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: 'var(--radius)',
        xl: '1.5rem',
        signature: '2.5rem',
        full: '9999px',
      },

      /** Named easings, so motion is consistent rather than ad hoc per component. */
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
        wipe: 'cubic-bezier(0.77, 0, 0.175, 1)',
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms',
        900: '900ms',
        1200: '1200ms',
      },

      letterSpacing: {
        tightest: '-0.045em',
        editorial: '-0.03em',
        wide: '0.08em',
        wider: '0.14em',
        widest: '0.2em',
        mega: '0.32em',
      },

      maxWidth: {
        prose: '68ch',
        editorial: '90rem',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        /** Type rises out of its own overflow mask. */
        'mask-up': {
          from: { transform: 'translateY(110%) rotate(2deg)' },
          to: { transform: 'translateY(0) rotate(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'draw-rule': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.06)', opacity: '0.8' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'mask-up': 'mask-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee: 'marquee 42s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        'draw-rule': 'draw-rule 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        breathe: 'breathe 9s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
