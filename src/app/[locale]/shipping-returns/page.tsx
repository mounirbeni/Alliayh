import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { LegalSection } from "@/components/layout/LegalContent";
import { LegalContent } from "@/components/layout/LegalContent";

const content: Record<string, { title: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    title: "Shipping & Returns",
    lastUpdated: "Last updated: 1 May 2025",
    sections: [
      {
        heading: "Shipping Zones",
        body: [
          "We ship to all countries within the European Union. For international shipping outside the EU, please contact concierge@lueur.skin before placing your order.",
        ],
      },
      {
        heading: "Delivery Times",
        body: [
          "Standard delivery: 3–5 business days from dispatch.",
          "Express delivery: 1–2 business days from dispatch.",
          "Orders placed before 2pm GMT on a business day are dispatched the same day. Orders placed after 2pm or on weekends/public holidays are dispatched the next business day.",
        ],
      },
      {
        heading: "Shipping Costs",
        body: [
          "Standard delivery: €4.90 for orders below €75. Free for orders of €75 or above.",
          "Express delivery: €9.90 regardless of order value.",
          "Shipping costs and estimated delivery dates are confirmed at checkout before payment.",
        ],
      },
      {
        heading: "Order Tracking",
        body: [
          "A tracking number is sent via email once your order has been dispatched. You can track your parcel on the carrier's website using this number.",
        ],
      },
      {
        heading: "Returns Policy",
        body: [
          "You have 30 days from the date of delivery to return any unopened, sealed product for a full refund. Products must be returned in their original packaging, unused, and in a resaleable condition.",
          "To initiate a return, email concierge@lueur.skin with your order number. We will provide a prepaid return label for orders within Portugal. Return shipping costs for orders outside Portugal are at the customer's expense.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "We offer exchanges for products that are returned within 30 days. If you received a damaged or incorrect item, contact us within 48 hours of delivery and we will arrange a replacement at no cost.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Refunds are processed within 14 days of receiving the returned goods, using the original payment method. We will notify you by email when the refund has been issued.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Politica de Envios e Devolucoes",
    lastUpdated: "Ultima atualizacao: 1 de maio de 2025",
    sections: [
      {
        heading: "Zonas de Envio",
        body: [
          "Enviamos para todos os paises da Uniao Europeia. Para envios internacionais fora da UE, contacte concierge@lueur.skin antes de efetuar a encomenda.",
        ],
      },
      {
        heading: "Prazos de Entrega",
        body: [
          "Entrega standard: 3 a 5 dias uteis apos expedicao.",
          "Entrega expresso: 1 a 2 dias uteis apos expedicao.",
          "Encomendas efetuadas antes das 14h de um dia util sao expedidas no mesmo dia. Encomendas apos as 14h ou em fins de semana sao expedidas no proximo dia util.",
        ],
      },
      {
        heading: "Custos de Envio",
        body: [
          "Entrega standard: 4,90€ para encomendas abaixo de 75€. Gratuita para encomendas de 75€ ou mais.",
          "Entrega expresso: 9,90€ independentemente do valor.",
          "Os custos de envio e prazos estimados sao confirmados no checkout antes do pagamento.",
        ],
      },
      {
        heading: "Rastreamento de Encomendas",
        body: [
          "Um numero de rastreamento e enviado por email apos expedicao. Pode rastrear a sua encomenda no site da transportadora com este numero.",
        ],
      },
      {
        heading: "Politica de Devolucoes",
        body: [
          "Tem 30 dias a partir da data de entrega para devolver qualquer produto nao aberto e selado para reembolso total. Os produtos devem ser devolvidos na embalagem original, sem uso e em condicoes de revenda.",
          "Para iniciar uma devolucao, envie um email para concierge@lueur.skin com o numero da sua encomenda.",
        ],
      },
      {
        heading: "Trocas",
        body: [
          "Oferecemos trocas para produtos devolvidos no prazo de 30 dias. Se recebeu um artigo danificado ou incorreto, contacte-nos nas 48 horas apos entrega.",
        ],
      },
      {
        heading: "Reembolsos",
        body: [
          "Os reembolsos sao processados no prazo de 14 dias apos recepcao dos produtos devolvidos, atraves do metodo de pagamento original.",
        ],
      },
    ],
  },
};

export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = content[locale] ?? content["en"];
  return <LegalContent {...page} />;
}
