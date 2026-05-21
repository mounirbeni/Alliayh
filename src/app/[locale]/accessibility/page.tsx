import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { LegalSection } from "@/components/layout/LegalContent";
import { LegalContent } from "@/components/layout/LegalContent";

const content: Record<string, { title: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    title: "Accessibility",
    lastUpdated: "Last updated: 1 May 2025",
    sections: [
      {
        heading: "Our Commitment",
        body: [
          "Lueur Skin by Alliyah is committed to ensuring digital accessibility for people with disabilities. We aim to continually improve the user experience for everyone and apply relevant accessibility standards.",
        ],
      },
      {
        heading: "Standards",
        body: [
          "We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible to people with disabilities.",
        ],
      },
      {
        heading: "Keyboard Navigation",
        body: [
          "All interactive elements on this site — including navigation menus, product cards, cart controls, and forms — are fully accessible via keyboard navigation.",
          "Focus indicators are visible on all interactive elements. Tab order follows a logical reading sequence.",
        ],
      },
      {
        heading: "Screen Readers",
        body: [
          "The site uses semantic HTML, ARIA labels, and meaningful alt text on all images. Interactive controls include descriptive labels for screen reader compatibility.",
        ],
      },
      {
        heading: "Colour and Contrast",
        body: [
          "Text colours are chosen to meet WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text). The site does not rely on colour alone to convey meaning.",
        ],
      },
      {
        heading: "Language",
        body: [
          "The page language is programmatically set on all pages and updated when switching between English and Portuguese.",
        ],
      },
      {
        heading: "Known Issues",
        body: [
          "We are aware that product image galleries currently use placeholder images. Real product photography with descriptive alt text will be added in a future update.",
        ],
      },
      {
        heading: "Feedback",
        body: [
          "If you experience any accessibility barriers or have suggestions for improvement, please contact us at concierge@lueur.skin. We aim to respond within 5 business days.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Acessibilidade",
    lastUpdated: "Ultima atualizacao: 1 de maio de 2025",
    sections: [
      {
        heading: "O Nosso Compromisso",
        body: [
          "A Lueur Skin by Alliyah compromete-se a garantir acessibilidade digital para pessoas com deficiencia. Procuramos melhorar continuamente a experiencia do utilizador e aplicar normas de acessibilidade relevantes.",
        ],
      },
      {
        heading: "Normas",
        body: [
          "Procuramos cumprir as Diretrizes de Acessibilidade para Conteudo da Web (WCAG) 2.1 ao nivel AA.",
        ],
      },
      {
        heading: "Navegacao por Teclado",
        body: [
          "Todos os elementos interativos do site sao totalmente acessiveis por teclado. Os indicadores de foco sao visiveis em todos os elementos interativos.",
        ],
      },
      {
        heading: "Leitores de Ecra",
        body: [
          "O site utiliza HTML semantico, etiquetas ARIA e texto alternativo significativo em todas as imagens.",
        ],
      },
      {
        heading: "Cor e Contraste",
        body: [
          "As cores do texto cumprem os requisitos de contraste WCAG AA. O site nao depende exclusivamente da cor para transmitir informacao.",
        ],
      },
      {
        heading: "Idioma",
        body: [
          "O idioma da pagina e definido programaticamente em todas as paginas e atualizado ao alternar entre ingles e portugues.",
        ],
      },
      {
        heading: "Contacto",
        body: [
          "Se encontrar barreiras de acessibilidade ou tiver sugestoes, contacte-nos em concierge@lueur.skin. Respondemos no prazo de 5 dias uteis.",
        ],
      },
    ],
  },
};

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = content[locale] ?? content["en"];
  return <LegalContent {...page} />;
}
