import { defaultLocale, localizedRoutes, type InternalRoute, type Locale } from "@/i18n/config";

export function localizedPath(pathname: string, locale: Locale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const matchedRoute = (Object.keys(localizedRoutes) as InternalRoute[]).find((route) => {
    if (route === "/") return normalized === "/";
    return normalized === route || normalized.startsWith(`${route}/`);
  });

  if (!matchedRoute) {
    return `/${locale}${normalized === "/" ? "" : normalized}`;
  }

  const localizedBase = localizedRoutes[matchedRoute][locale];
  const suffix = normalized.slice(matchedRoute.length);
  return `/${locale}${localizedBase === "/" ? "" : localizedBase}${suffix}`;
}

export function switchLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${defaultLocale}`;
  }

  const [, ...rest] = segments;
  const currentPath = `/${rest.join("/")}` || "/";
  const matchedInternalRoute = (Object.keys(localizedRoutes) as InternalRoute[]).find((route) => {
    const values = Object.values(localizedRoutes[route]) as string[];
    if (values.includes(currentPath)) return true;
    return values.some((value) => value !== "/" && currentPath.startsWith(`${value}/`));
  });

  if (!matchedInternalRoute) {
    return `/${locale}${currentPath === "/" ? "" : currentPath}`;
  }

  const localizedBase = localizedRoutes[matchedInternalRoute][locale];
  const sourceValues = Object.values(localizedRoutes[matchedInternalRoute]) as string[];
  const sourceBase = sourceValues.find(
    (value) => currentPath === value || (value !== "/" && currentPath.startsWith(`${value}/`)),
  );
  const suffix = sourceBase && currentPath.startsWith(sourceBase) ? currentPath.slice(sourceBase.length) : "";

  return `/${locale}${localizedBase === "/" ? "" : localizedBase}${suffix}`;
}
