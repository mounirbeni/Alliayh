import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isValidLocale,
  negotiateLocale,
  splitLocalePath,
} from '@/i18n/config';

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Locale routing.
 *
 * Previously every unprefixed request was redirected to `/pt`, so an English
 * speaker landing on `/` always got Portuguese and had to switch by hand on
 * every visit. The locale is now resolved in order of precedence from:
 *
 *   1. an explicit `NEXT_LOCALE` cookie (written by the language switcher),
 *   2. the browser's `Accept-Language` header,
 *   3. the default locale.
 *
 * The result is echoed back as a cookie and as an `x-locale` header so Server
 * Components can read it without re-parsing the URL.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale: pathLocale } = splitLocalePath(pathname);

  // Already localised — refresh the cookie so the preference sticks.
  if (pathLocale) {
    const response = NextResponse.next();
    response.headers.set('x-locale', pathLocale);
    response.headers.set('x-pathname', pathname);
    if (request.cookies.get(LOCALE_COOKIE)?.value !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        path: '/',
        maxAge: ONE_YEAR,
        sameSite: 'lax',
      });
    }
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isValidLocale(cookieLocale)
    ? cookieLocale
    : negotiateLocale(request.headers.get('accept-language')) || DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, API routes, PWA/SEO assets served from
     * /public, and any path that carries a file extension.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|sw.js|workbox-|icons/|products/|.*\\..*).*)',
  ],
};
