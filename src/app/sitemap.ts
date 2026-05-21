import type { MetadataRoute } from "next";
import { locales, localizedRoutes } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { PRODUCTS } from "@/app/lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://lueur.skin";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.keys(localizedRoutes) as (keyof typeof localizedRoutes)[];

  const staticEntries: MetadataRoute.Sitemap = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${localizedPath(route, locale)}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : route === "/products" ? 0.9 : 0.7,
    })),
  );

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${localizedPath(`/products/${product.id}`, locale)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...productEntries];
}
