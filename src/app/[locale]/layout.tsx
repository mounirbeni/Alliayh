import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale as Locale);

  return {
    title: dictionary.seo.title,
    description: dictionary.seo.description,
    openGraph: {
      title: dictionary.seo.ogTitle,
      description: dictionary.seo.ogDescription,
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  return <MainShell locale={locale} dictionary={dictionary}>{children}</MainShell>;
}
