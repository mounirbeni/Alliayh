import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { LegalSection } from "@/components/layout/LegalContent";
import { LegalContent } from "@/components/layout/LegalContent";

const content: Record<string, { title: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    title: "Cookie Policy",
    lastUpdated: "Last updated: 1 May 2025",
    sections: [
      {
        heading: "What Are Cookies",
        body: [
          "Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and improve your experience.",
        ],
      },
      {
        heading: "Essential Cookies",
        body: [
          "These cookies are strictly necessary for the platform to function and cannot be disabled. They include: session management, cart persistence, and security tokens.",
          "Legal basis: Legitimate interest (GDPR Art. 6(1)(f)).",
        ],
      },
      {
        heading: "Analytics Cookies",
        body: [
          "We use anonymised analytics to understand how visitors interact with the site. These cookies are only activated if you explicitly accept them via the cookie banner.",
          "Legal basis: Consent (GDPR Art. 6(1)(a)).",
        ],
      },
      {
        heading: "Marketing Cookies",
        body: [
          "Marketing cookies enable us to show relevant advertising on third-party platforms. They are disabled by default and only activated with your explicit consent.",
        ],
      },
      {
        heading: "Managing Your Preferences",
        body: [
          "You can change your cookie preferences at any time by clicking the Cookie Preferences button in the footer or revisiting the banner. You may also clear cookies via your browser settings.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Politica de Cookies",
    lastUpdated: "Ultima atualizacao: 1 de maio de 2025",
    sections: [
      {
        heading: "O Que Sao Cookies",
        body: [
          "Os cookies sao pequenos ficheiros de texto colocados no seu dispositivo quando visita um website. Ajudam o site a lembrar as suas preferencias e melhorar a sua experiencia.",
        ],
      },
      {
        heading: "Cookies Essenciais",
        body: [
          "Estes cookies sao estritamente necessarios para o funcionamento da plataforma e nao podem ser desativados. Incluem: gestao de sessao, persistencia do carrinho e tokens de seguranca.",
          "Base legal: Interesse legitimo (RGPD, Art. 6.o, n.o 1, al. f)).",
        ],
      },
      {
        heading: "Cookies Analiticos",
        body: [
          "Utilizamos analitica anonimizada para compreender como os visitantes interagem com o site. Estes cookies so sao ativados se aceitar explicitamente atraves do banner de cookies.",
          "Base legal: Consentimento (RGPD, Art. 6.o, n.o 1, al. a)).",
        ],
      },
      {
        heading: "Cookies de Marketing",
        body: [
          "Os cookies de marketing permitem-nos mostrar publicidade relevante em plataformas de terceiros. Estao desativados por predefinicao e so sao ativados com o seu consentimento explicito.",
        ],
      },
      {
        heading: "Gerir as Suas Preferencias",
        body: [
          "Pode alterar as suas preferencias de cookies a qualquer momento clicando no banner de cookies ou atraves das definicoes do seu navegador.",
        ],
      },
    ],
  },
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = content[locale] ?? content["en"];
  return <LegalContent {...page} />;
}
