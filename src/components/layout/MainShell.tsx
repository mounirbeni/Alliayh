import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/compliance/CookieBanner";
import { LangSync } from "@/components/layout/LangSync";
import { Toaster } from "@/components/ui/toaster";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function MainShell({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar locale={locale} dictionary={dictionary} />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <CartDrawer locale={locale} dictionary={dictionary} />
      <CookieBanner dictionary={dictionary} />
      <Toaster />
      <LangSync locale={locale} />
    </div>
  );
}
