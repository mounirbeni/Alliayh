"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import { switchLocaleInPath } from "@/lib/locale-path";
import type { Dictionary } from "@/i18n/dictionaries";

export function LanguageSwitcher({
  currentLocale,
  dictionary,
}: {
  currentLocale: Locale;
  dictionary: Dictionary;
}) {
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-full border border-primary/20 p-1 text-xs">
      {locales.map((locale) => {
        const active = locale === currentLocale;
        const href = switchLocaleInPath(pathname, locale);
        return (
          <Link
            key={locale}
            href={href}
            aria-label={dictionary.language.switchTo.replace("{language}", locale === "pt-PT" ? "PT" : "EN")}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-primary/10"
            }`}
          >
            {active && <Check className="h-3 w-3" />}
            {locale === "pt-PT" ? "PT" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}
