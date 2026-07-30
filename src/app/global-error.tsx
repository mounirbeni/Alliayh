"use client";

import { useEffect } from 'react';

/**
 * Last-resort boundary for failures in the root layout itself, where no
 * provider — including the locale context — is available. It renders its own
 * <html> shell and uses the brand palette inline, since the stylesheet may not
 * have loaded either.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="pt">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#fdf2fa',
          color: '#3d0a19',
          fontFamily: 'Montserrat, system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontFamily: 'Prata, Georgia, serif', fontSize: '2rem', margin: 0 }}>
          Algo correu menos bem
        </h1>
        <p style={{ maxWidth: '32rem', lineHeight: 1.7, opacity: 0.8, margin: 0 }}>
          Ocorreu um erro inesperado. Tente novamente. <br />
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '0.9rem 2.25rem',
            background: '#781430',
            color: '#fdf2fa',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            cursor: 'pointer',
          }}
        >
          Tentar novamente / Try again
        </button>
      </body>
    </html>
  );
}
