import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { LegalSection } from "@/components/layout/LegalContent";
import { LegalContent } from "@/components/layout/LegalContent";

const content: Record<string, { title: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: 1 May 2025",
    sections: [
      {
        heading: "1. Controller",
        body: [
          "Lueur Skin by Alliyah ('we', 'us', 'our') is the controller of the personal data collected on lueur.skin. For data protection enquiries, contact: privacy@lueur.skin.",
        ],
      },
      {
        heading: "2. Data We Collect",
        body: [
          "We collect data you provide directly: name, email address, shipping address, phone number, and payment information when you place an order.",
          "We automatically collect technical data: IP address, browser type, pages visited, referring URLs, and session duration via essential cookies.",
          "If you use the AI Skin Advisor, your skin type, concerns, and goals are processed to generate your recommendation. This data is not stored after the session ends.",
        ],
      },
      {
        heading: "3. Legal Basis (GDPR)",
        body: [
          "Contract performance (Art. 6(1)(b)): processing necessary to fulfil your order.",
          "Legitimate interest (Art. 6(1)(f)): fraud prevention and platform security.",
          "Consent (Art. 6(1)(a)): analytics and marketing cookies, which you may revoke at any time via our Cookie Banner.",
        ],
      },
      {
        heading: "4. How We Use Your Data",
        body: [
          "To process and fulfil your orders, including sending confirmation emails.",
          "To respond to customer service enquiries.",
          "To improve the platform and personalise your experience, subject to consent.",
          "To comply with legal obligations under EU law.",
        ],
      },
      {
        heading: "5. Data Retention",
        body: [
          "Order data is retained for 7 years to comply with Portuguese and EU accounting obligations. Customer account data is deleted within 30 days of account closure upon request.",
        ],
      },
      {
        heading: "6. Your Rights",
        body: [
          "You have the right to: access your data, rectify inaccuracies, request erasure ('right to be forgotten'), restrict processing, data portability, and object to processing.",
          "To exercise these rights, email privacy@lueur.skin. You also have the right to lodge a complaint with the CNPD (Comissão Nacional de Proteção de Dados).",
        ],
      },
      {
        heading: "7. Third Parties",
        body: [
          "We share order data with our logistics and payment providers solely for order fulfilment. We do not sell personal data to third parties.",
          "Our AI recommendation feature uses Google Gemini via the Genkit framework. Input data is transmitted securely and is not used to train AI models.",
        ],
      },
      {
        heading: "8. Cookies",
        body: [
          "Our Cookie Policy provides full details of the cookies we use. You can manage preferences at any time via the cookie banner at the bottom of the page.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Politica de Privacidade",
    lastUpdated: "Ultima atualizacao: 1 de maio de 2025",
    sections: [
      {
        heading: "1. Responsavel pelo Tratamento",
        body: [
          "A Lueur Skin by Alliyah ('nos') e responsavel pelo tratamento dos dados pessoais recolhidos em lueur.skin. Para questoes de privacidade: privacy@lueur.skin.",
        ],
      },
      {
        heading: "2. Dados que Recolhemos",
        body: [
          "Recolhemos dados que nos fornece diretamente: nome, email, morada de envio, telefone e dados de pagamento ao efetuar uma encomenda.",
          "Recolhemos automaticamente dados tecnicos: endereco IP, tipo de navegador, paginas visitadas e duracao da sessao atraves de cookies essenciais.",
          "Se utilizar o Consultor de Pele por IA, o seu tipo de pele, preocupacoes e objetivos sao processados para gerar a sua recomendacao. Estes dados nao sao armazenados apos o fim da sessao.",
        ],
      },
      {
        heading: "3. Base Legal (RGPD)",
        body: [
          "Execucao de contrato (Art. 6.o, n.o 1, alinea b)): processamento necessario para cumprimento da encomenda.",
          "Interesse legitimo (Art. 6.o, n.o 1, alinea f)): prevencao de fraude e seguranca da plataforma.",
          "Consentimento (Art. 6.o, n.o 1, alinea a)): cookies analiticos e de marketing, revogavel a qualquer momento.",
        ],
      },
      {
        heading: "4. Utilizacao dos Dados",
        body: [
          "Para processar e cumprir as suas encomendas, incluindo envio de emails de confirmacao.",
          "Para responder a pedidos de apoio ao cliente.",
          "Para melhorar a plataforma e personalizar a experiencia, sujeito a consentimento.",
          "Para cumprir obrigacoes legais ao abrigo do direito europeu.",
        ],
      },
      {
        heading: "5. Retencao de Dados",
        body: [
          "Os dados de encomenda sao conservados durante 7 anos para cumprimento de obrigacoes contabilisticas. Os dados de conta sao eliminados nos 30 dias seguintes ao fecho da conta, mediante pedido.",
        ],
      },
      {
        heading: "6. Os Seus Direitos",
        body: [
          "Tem direito a: aceder aos seus dados, retificar inexatidoes, solicitar apagamento, restringir o tratamento, portabilidade dos dados e oposicao ao tratamento.",
          "Para exercer estes direitos, contacte privacy@lueur.skin. Pode tambem apresentar reclamacao junto da CNPD.",
        ],
      },
      {
        heading: "7. Terceiros",
        body: [
          "Partilhamos dados de encomenda com os nossos fornecedores de logistica e pagamento exclusivamente para cumprimento da encomenda. Nao vendemos dados pessoais a terceiros.",
          "A funcionalidade de recomendacao por IA utiliza o Google Gemini via framework Genkit. Os dados sao transmitidos de forma segura e nao sao utilizados para treino de modelos de IA.",
        ],
      },
      {
        heading: "8. Cookies",
        body: [
          "A nossa Politica de Cookies fornece todos os detalhes sobre os cookies utilizados. Pode gerir as preferencias a qualquer momento atraves do banner de cookies.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = content[locale] ?? content["en"];
  return <LegalContent {...page} />;
}
