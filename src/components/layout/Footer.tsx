
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";

export function Footer({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const pt = locale === "pt-PT";

  const explore = [
    { href: "/products", label: dictionary.nav.collection },
    { href: "/advisor", label: dictionary.nav.advisor },
    { href: "/about", label: pt ? "A Nossa História" : "Our Story" },
    { href: "/journal", label: dictionary.nav.journal },
    { href: "/pricing", label: pt ? "Preços" : "Pricing" },
  ];

  const account = [
    { href: "/account", label: pt ? "A minha conta" : "My account" },
    { href: "/auth/login", label: pt ? "Entrar" : "Sign in" },
    { href: "/auth/register", label: pt ? "Criar conta" : "Create account" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const support = [
    { href: "/faq", label: dictionary.footer.faq },
    { href: "/contact", label: dictionary.footer.contact },
    { href: "/shipping-returns", label: dictionary.footer.shipping },
    { href: "/accessibility", label: dictionary.footer.accessibility },
  ];

  const legal = [
    { href: "/privacy", label: dictionary.footer.privacy },
    { href: "/terms", label: dictionary.footer.terms },
    { href: "/cookies", label: dictionary.footer.cookies },
  ];

  return (
    <footer className="border-t border-primary/10 bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-headline text-3xl text-primary">{dictionary.brand.name}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {dictionary.brand.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {dictionary.brand.description}
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "TK", "PT"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-[10px] font-semibold text-primary/60 transition hover:border-primary/60 hover:text-primary cursor-pointer"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50">
              {pt ? "Explorar" : "Explore"}
            </p>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(item.href, locale)}
                    className="text-sm text-foreground/70 transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50">
              {pt ? "Conta" : "Account"}
            </p>
            <ul className="space-y-3">
              {account.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(item.href, locale)}
                    className="text-sm text-foreground/70 transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50">
              {pt ? "Suporte" : "Support"}
            </p>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(item.href, locale)}
                    className="text-sm text-foreground/70 transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50">
              {pt ? "Legal" : "Legal"}
            </p>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(item.href, locale)}
                    className="text-sm text-foreground/70 transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Lueur Skin by Alliyah.{" "}
            {pt ? "Todos os direitos reservados." : "All rights reserved."}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40">
            {pt
              ? "Fórmulas botânicas · Grau clínico · Cruelty free"
              : "Botanical formulas · Clinical grade · Cruelty free"}
          </p>
        </div>
      </div>
    </footer>
  );
}
