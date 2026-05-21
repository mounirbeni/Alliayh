import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { LegalSection } from "@/components/layout/LegalContent";
import { LegalContent } from "@/components/layout/LegalContent";

const content: Record<string, { title: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    title: "Terms & Conditions",
    lastUpdated: "Last updated: 1 May 2025",
    sections: [
      {
        heading: "1. Acceptance",
        body: [
          "By accessing lueur.skin or placing an order, you agree to these Terms & Conditions. If you do not agree, please do not use the platform.",
        ],
      },
      {
        heading: "2. Products and Pricing",
        body: [
          "All prices are displayed in Euros (€) and include applicable VAT. We reserve the right to amend prices at any time. The price applicable to your order is that confirmed at checkout.",
          "Product descriptions and images are provided for illustrative purposes. Minor variations may occur due to photography and screen calibration.",
        ],
      },
      {
        heading: "3. Order Process",
        body: [
          "An order constitutes an offer to purchase. Acceptance occurs when we send an order confirmation email. We reserve the right to refuse any order in cases of stock unavailability or pricing errors.",
          "You must be at least 18 years of age to place an order.",
        ],
      },
      {
        heading: "4. Payment",
        body: [
          "Payment is processed securely via our PCI-DSS compliant payment provider. We accept major credit and debit cards. Card details are never stored on our servers.",
        ],
      },
      {
        heading: "5. Delivery",
        body: [
          "Standard delivery within the EU: 3–5 business days. Express: 1–2 business days. Free standard delivery on orders above €75.",
          "Delivery times are estimates. We are not liable for delays caused by carriers or customs.",
        ],
      },
      {
        heading: "6. Returns and Refunds",
        body: [
          "You have the right to withdraw from a purchase within 14 days of delivery under EU consumer law. Products must be returned unused, in their original sealed packaging.",
          "To initiate a return, contact concierge@lueur.skin. Refunds are processed within 14 days of receiving the returned goods.",
        ],
      },
      {
        heading: "7. Intellectual Property",
        body: [
          "All content on lueur.skin, including text, images, brand names, and formulation descriptions, is the intellectual property of Lueur Skin by Alliyah. Unauthorised reproduction is prohibited.",
        ],
      },
      {
        heading: "8. Governing Law",
        body: [
          "These terms are governed by Portuguese law. Disputes shall be resolved before the competent courts of Portugal, without prejudice to EU consumer protection provisions.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Termos e Condicoes",
    lastUpdated: "Ultima atualizacao: 1 de maio de 2025",
    sections: [
      {
        heading: "1. Aceitacao",
        body: [
          "Ao aceder a lueur.skin ou efetuar uma encomenda, aceita os presentes Termos e Condicoes. Se nao concordar, nao utilize a plataforma.",
        ],
      },
      {
        heading: "2. Produtos e Precos",
        body: [
          "Todos os precos sao apresentados em Euros (€) e incluem IVA aplicavel. Reservamo-nos o direito de alterar precos a qualquer momento.",
          "As descricoes e imagens de produtos sao meramente ilustrativas. Podem ocorrer variacoes menores.",
        ],
      },
      {
        heading: "3. Processo de Encomenda",
        body: [
          "Uma encomenda constitui uma oferta de compra. A aceitacao ocorre quando enviamos um email de confirmacao.",
          "Deve ter pelo menos 18 anos para efetuar uma encomenda.",
        ],
      },
      {
        heading: "4. Pagamento",
        body: [
          "O pagamento e processado de forma segura atraves do nosso fornecedor conforme PCI-DSS. Os dados do cartao nunca sao armazenados.",
        ],
      },
      {
        heading: "5. Entrega",
        body: [
          "Entrega standard na UE: 3 a 5 dias uteis. Expresso: 1 a 2 dias uteis. Entrega standard gratuita em encomendas acima de €75.",
        ],
      },
      {
        heading: "6. Devolucoes e Reembolsos",
        body: [
          "Tem direito a desistir de uma compra no prazo de 14 dias apos a entrega. Os produtos devem ser devolvidos sem uso, na embalagem original selada.",
          "Para iniciar uma devolucao, contacte concierge@lueur.skin. Reembolsos em 14 dias apos recepcao.",
        ],
      },
      {
        heading: "7. Propriedade Intelectual",
        body: [
          "Todo o conteudo de lueur.skin e propriedade intelectual da Lueur Skin by Alliyah. A reproducao nao autorizada e proibida.",
        ],
      },
      {
        heading: "8. Lei Aplicavel",
        body: [
          "Estes termos sao regidos pela lei portuguesa. Os litigios serao resolvidos perante os tribunais competentes de Portugal.",
        ],
      },
    ],
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = content[locale] ?? content["en"];
  return <LegalContent {...page} />;
}
