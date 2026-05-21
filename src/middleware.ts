import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isValidLocale, localizedRoutes, type InternalRoute } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (!first || !isValidLocale(first)) {
    const url = request.nextUrl.clone();
    const suffix = pathname === "/" ? "" : pathname;
    url.pathname = `/${defaultLocale}${suffix}`;
    return NextResponse.redirect(url);
  }

  const locale = first;
  const routePath = `/${segments.slice(1).join("/")}` || "/";
  const internalRoute =
    (Object.keys(localizedRoutes) as InternalRoute[]).find((route) => {
      const values = Object.values(localizedRoutes[route]) as string[];
      if (values.includes(routePath)) return true;
      return values.some((value) => value !== "/" && routePath.startsWith(`${value}/`));
    }) ?? null;

  if (internalRoute) {
    const sourceValues = Object.values(localizedRoutes[internalRoute]) as string[];
    const sourceBase = sourceValues.find(
      (value) => routePath === value || (value !== "/" && routePath.startsWith(`${value}/`)),
    );
    const suffix = sourceBase && routePath.startsWith(sourceBase) ? routePath.slice(sourceBase.length) : "";
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${locale}${internalRoute === "/" ? "" : internalRoute}${suffix}`;

    if (rewriteUrl.pathname !== pathname) {
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
