"use client";

import { use } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidLocale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const plans = [
  {
    key: "starter",
    icon: Sparkles,
    price: { en: "Free", pt: "Grátis" },
    billing: null,
    badge: null,
    features: {
      en: [
        "1 online store",
        "Up to 20 products",
        "Basic analytics dashboard",
        "AI Skin Advisor (10 queries/mo)",
        "Standard checkout",
        "Community support",
        "Lueur branding",
      ],
      pt: [
        "1 loja online",
        "Até 20 produtos",
        "Dashboard de análise básico",
        "AI Skin Advisor (10 consultas/mês)",
        "Checkout standard",
        "Suporte comunidade",
        "Marca Lueur",
      ],
    },
  },
  {
    key: "growth",
    icon: Zap,
    price: { en: "€49", pt: "€49" },
    billing: { en: "/month", pt: "/mês" },
    badge: { en: "Most popular", pt: "Mais popular" },
    features: {
      en: [
        "3 online stores",
        "Up to 200 products",
        "Advanced analytics & reports",
        "AI Skin Advisor (unlimited)",
        "Custom domain",
        "Discount & promo codes",
        "Email marketing tools",
        "Priority email support",
        "Remove Lueur branding",
      ],
      pt: [
        "3 lojas online",
        "Até 200 produtos",
        "Análise avançada & relatórios",
        "AI Skin Advisor (ilimitado)",
        "Domínio personalizado",
        "Códigos de desconto & promoção",
        "Ferramentas de email marketing",
        "Suporte email prioritário",
        "Remover marca Lueur",
      ],
    },
  },
  {
    key: "elite",
    icon: Crown,
    price: { en: "€199", pt: "€199" },
    billing: { en: "/month", pt: "/mês" },
    badge: null,
    features: {
      en: [
        "Unlimited stores",
        "Unlimited products",
        "Full analytics suite + API",
        "AI Advisor with custom training",
        "White-label platform",
        "Multi-currency & multi-language",
        "Dedicated account manager",
        "SLA 99.9% uptime guarantee",
        "Custom integrations",
        "24/7 priority support",
      ],
      pt: [
        "Lojas ilimitadas",
        "Produtos ilimitados",
        "Suite de análise completa + API",
        "AI Advisor com treino personalizado",
        "Plataforma white-label",
        "Multi-moeda & multi-idioma",
        "Gestor de conta dedicado",
        "SLA 99,9% garantia de uptime",
        "Integrações personalizadas",
        "Suporte prioritário 24/7",
      ],
    },
  },
];

const faqs = {
  en: [
    {
      q: "Can I switch plans at any time?",
      a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle.",
    },
    {
      q: "Is there a free trial for paid plans?",
      a: "Absolutely. All paid plans include a 14-day free trial — no credit card required.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, Mastercard, Amex) as well as SEPA direct debit for EU customers.",
    },
    {
      q: "Can I use my own domain?",
      a: "Custom domains are available on Growth and Elite plans. Simply point your DNS to our platform and we handle the SSL certificate automatically.",
    },
  ],
  pt: [
    {
      q: "Posso mudar de plano a qualquer momento?",
      a: "Sim. Pode fazer upgrade ou downgrade a qualquer momento. Os upgrades têm efeito imediato; os downgrades aplicam-se no início do próximo ciclo de faturação.",
    },
    {
      q: "Existe um período de teste gratuito para planos pagos?",
      a: "Sim. Todos os planos pagos incluem 14 dias de teste gratuito — sem cartão de crédito necessário.",
    },
    {
      q: "Que métodos de pagamento aceitam?",
      a: "Aceitamos todos os principais cartões de crédito (Visa, Mastercard, Amex) e débito direto SEPA para clientes da UE.",
    },
    {
      q: "Posso usar o meu próprio domínio?",
      a: "Os domínios personalizados estão disponíveis nos planos Growth e Elite. Basta apontar o seu DNS para a nossa plataforma e tratamos automaticamente do certificado SSL.",
    },
  ],
};

export default function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!isValidLocale(locale)) notFound();

  const pt = locale === "pt-PT";
  const lang = pt ? "pt" : "en";

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="px-4 pt-20 pb-12 text-center">
        <p className="text-luxury text-primary/60 mb-4">
          {pt ? "Planos & Preços" : "Plans & Pricing"}
        </p>
        <h1 className="font-headline text-5xl md:text-7xl leading-tight">
          {pt ? "Escolha o seu plano" : "Choose your plan"}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          {pt
            ? "De loja única a plataforma enterprise — temos um plano para cada fase da sua marca de cosméticos."
            : "From a single store to an enterprise platform — we have a plan for every stage of your cosmetics brand."}
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isPopular = plan.key === "growth";
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-7",
                  isPopular
                    ? "border-primary bg-primary text-primary-foreground shadow-2xl scale-[1.02]"
                    : "border-primary/10 bg-white/80"
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {plan.badge[lang]}
                  </span>
                )}

                <div className={cn(
                  "mb-5 flex h-10 w-10 items-center justify-center rounded-2xl",
                  isPopular ? "bg-primary-foreground/20" : "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", isPopular ? "text-primary-foreground" : "text-primary")} />
                </div>

                <h2 className="font-headline text-2xl capitalize">{plan.key}</h2>

                <div className="mt-3 flex items-end gap-1">
                  <span className="font-headline text-4xl">{plan.price[lang]}</span>
                  {plan.billing && (
                    <span className={cn("mb-1 text-sm", isPopular ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {plan.billing[lang]}
                    </span>
                  )}
                </div>

                <p className={cn("mt-1 text-xs", isPopular ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {plan.key === "starter"
                    ? (pt ? "Para sempre gratuito" : "Free forever")
                    : (pt ? "Faturado mensalmente" : "Billed monthly")}
                </p>

                <div className={cn("my-6 h-px", isPopular ? "bg-primary-foreground/20" : "bg-primary/10")} />

                <ul className="flex-1 space-y-3">
                  {plan.features[lang].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isPopular ? "text-secondary" : "text-primary"
                      )} />
                      <span className={isPopular ? "text-primary-foreground/90" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={cn(
                    "mt-8 rounded-full w-full",
                    isPopular
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  )}
                  variant={isPopular ? "default" : "outline"}
                  size="lg"
                >
                  <Link href={localizedPath("/auth/register", locale)}>
                    {plan.key === "starter"
                      ? (pt ? "Começar grátis" : "Get started free")
                      : (pt ? "Iniciar período de teste" : "Start free trial")}
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-y border-primary/10 bg-secondary/10 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-headline text-3xl">
            {pt ? "Comparação de funcionalidades" : "Feature comparison"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="pb-4 text-left font-medium text-muted-foreground">
                    {pt ? "Funcionalidade" : "Feature"}
                  </th>
                  {["Starter", "Growth", "Elite"].map((p) => (
                    <th key={p} className="pb-4 text-center font-headline text-base">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {[
                  { feature: pt ? "Lojas" : "Stores", values: ["1", "3", "∞"] },
                  { feature: pt ? "Produtos" : "Products", values: ["20", "200", "∞"] },
                  { feature: pt ? "AI Advisor" : "AI Advisor", values: ["10/mês", "∞", "∞ + treino"] },
                  { feature: pt ? "Analytics" : "Analytics", values: ["Básico", "Avançado", "Completo"] },
                  { feature: pt ? "Domínio custom" : "Custom domain", values: ["—", "✓", "✓"] },
                  { feature: pt ? "White-label" : "White-label", values: ["—", "—", "✓"] },
                  { feature: pt ? "API" : "API", values: ["—", "—", "✓"] },
                  { feature: pt ? "Suporte" : "Support", values: [pt ? "Comunidade" : "Community", pt ? "Email" : "Email", "24/7"] },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 text-muted-foreground">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className={cn(
                        "py-3.5 text-center",
                        i === 1 ? "font-semibold text-primary" : ""
                      )}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto max-w-2xl px-4 py-20">
        <h2 className="mb-10 text-center font-headline text-3xl">
          {pt ? "Perguntas frequentes" : "Frequently asked questions"}
        </h2>
        <div className="space-y-6">
          {faqs[lang].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-primary/10 bg-white/60 p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-4 py-20 text-center">
        <p className="text-luxury text-primary-foreground/40 mb-4">
          {pt ? "Comece hoje" : "Get started today"}
        </p>
        <h2 className="font-headline text-4xl text-primary-foreground md:text-5xl">
          {pt ? "Lance a sua loja em minutos" : "Launch your store in minutes"}
        </h2>
        <p className="mt-4 text-sm text-primary-foreground/60">
          {pt ? "Sem cartão de crédito. 14 dias de teste gratuito." : "No credit card required. 14-day free trial."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-8">
            <Link href={localizedPath("/auth/register", locale)}>
              {pt ? "Criar conta gratuita" : "Create free account"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link href={localizedPath("/contact", locale)}>
              {pt ? "Falar com a equipa" : "Talk to the team"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
