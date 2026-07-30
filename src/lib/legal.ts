/**
 * Legal documents.
 *
 * The legal route used to accept *any* slug and render the same English
 * boilerplate with the slug title-cased as the heading — an unbounded URL space
 * that search engines happily indexed as duplicate content, and which showed
 * Portuguese customers English terms. Documents are now an explicit, localised,
 * typed set; anything else 404s.
 *
 * NOTE FOR THE BRAND: this is structured template copy covering the EU/PT
 * baseline (distance selling, GDPR, cookies, accessibility). Have it reviewed by
 * counsel before launch and keep `updated` in step with any revision.
 */
import type { Locale } from '@/i18n';

export const LEGAL_SLUGS = [
  'shipping',
  'terms',
  'privacy',
  'cookies',
  'accessibility',
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  summary: string;
  sections: LegalSection[];
}

/** ISO date of the last substantive revision — surfaced on the page. */
export const LEGAL_UPDATED = '2026-01-15';

const DOCUMENTS: Record<Locale, Record<LegalSlug, LegalDocument>> = {
  en: {
    shipping: {
      slug: 'shipping',
      title: 'Shipping & Delivery',
      summary:
        'How and when your Lueur Skin order reaches you, and what happens if it does not.',
      sections: [
        {
          heading: 'Dispatch times',
          body: [
            'Orders placed before 14:00 WET on a business day are prepared the same day. Orders placed after that, or at the weekend, are prepared on the next business day.',
            'You receive a dispatch confirmation with tracking as soon as the parcel leaves our facility.',
          ],
        },
        {
          heading: 'Delivery estimates',
          body: [
            'Mainland Portugal: 1–3 business days. Madeira and the Azores: 3–5 business days.',
            'European Union: 3–7 business days. Rest of the world: 7–14 business days, subject to customs clearance in the destination country.',
          ],
        },
        {
          heading: 'Shipping costs',
          body: [
            'Standard delivery is free on orders over €50. Below that threshold a flat contribution is calculated at checkout before payment.',
            'Duties and import taxes outside the European Union are the responsibility of the recipient and are not collected by us.',
          ],
        },
        {
          heading: 'Lost or damaged parcels',
          body: [
            'If tracking has not moved for seven business days, or the parcel arrives damaged, contact us within 14 days of the expected delivery date and we will replace or refund the order in full.',
          ],
        },
      ],
    },
    terms: {
      slug: 'terms',
      title: 'Terms of Sale',
      summary:
        'The contract between you and Lueur Skin by Alliyah when you place an order.',
      sections: [
        {
          heading: 'Who you are contracting with',
          body: [
            'Purchases on this site form a contract with Lueur Skin by Alliyah, established in Portugal. Prices are displayed in euros and include VAT at the applicable rate.',
          ],
        },
        {
          heading: 'Orders and acceptance',
          body: [
            'Your order is an offer to buy. The contract is formed when we send the dispatch confirmation, not when payment is authorised.',
            'We may decline an order where a product is out of stock, a price has been listed in error, or we cannot verify the payment or delivery details.',
          ],
        },
        {
          heading: 'Right of withdrawal',
          body: [
            'Consumers in the European Union may withdraw from the contract within 14 days of receiving the goods, without giving a reason. Sealed consumable products cannot be returned once opened, for reasons of health protection and hygiene.',
            'To withdraw, contact us with your order number. We refund the full amount, including standard outbound delivery, within 14 days of receiving the returned goods.',
          ],
        },
        {
          heading: 'Subscriptions',
          body: [
            'Subscription orders renew every 30 days at the discounted price shown at the point of sale. You may cancel at any time from your account before the next renewal, with no penalty.',
          ],
        },
        {
          heading: 'Product claims',
          body: [
            'Our products are food supplements and cosmetic preparations. They are not medicines, they do not diagnose, treat or cure any condition, and nothing on this site is medical advice. Consult a healthcare professional if you are pregnant, breastfeeding, or taking medication.',
          ],
        },
      ],
    },
    privacy: {
      slug: 'privacy',
      title: 'Privacy Policy',
      summary: 'What personal data we process, why, and the rights you hold over it.',
      sections: [
        {
          heading: 'Data we process',
          body: [
            'Order data: name, delivery and billing address, email, telephone and order history. Processed to perform the sales contract.',
            'Account data: email address and password hash, if you choose to create an account. Processed on the basis of your consent, withdrawable by deleting the account.',
            'Skin advisor inputs: the skin type, concerns and goals you select. Processed to generate a recommendation for that session only; we do not build a profile from them.',
          ],
        },
        {
          heading: 'Analytics and marketing',
          body: [
            'Analytics and marketing technologies only run after you accept the corresponding category in the cookie banner. Rejecting them does not degrade the shopping experience.',
          ],
        },
        {
          heading: 'Retention',
          body: [
            'Order records are retained for ten years to meet Portuguese tax and accounting obligations. Account data is deleted within 30 days of an account deletion request. Advisor inputs are discarded at the end of the session.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'You may request access, rectification, erasure, restriction, portability, or object to processing, by writing to the contact address on this site. We respond within one month.',
            'You also have the right to lodge a complaint with the Comissão Nacional de Proteção de Dados (CNPD).',
          ],
        },
      ],
    },
    cookies: {
      slug: 'cookies',
      title: 'Cookie Policy',
      summary: 'The cookies this site sets, and how to change your mind at any time.',
      sections: [
        {
          heading: 'Strictly necessary',
          body: [
            'These keep your bag, your language choice and your consent preferences working. They cannot be switched off because the site cannot function without them, and they never feed advertising.',
          ],
        },
        {
          heading: 'Analytics',
          body: [
            'Aggregated, non-identifying measurement of which pages are read and where journeys break down. Loaded only after you accept the analytics category.',
          ],
        },
        {
          heading: 'Marketing',
          body: [
            'Used to measure the effect of campaigns and to avoid showing the same promotion repeatedly. Loaded only after you accept the marketing category.',
          ],
        },
        {
          heading: 'Changing your choice',
          body: [
            'Your preferences are stored locally in your browser and can be changed at any time from the cookie settings link in the footer. Clearing site data resets the banner.',
          ],
        },
      ],
    },
    accessibility: {
      slug: 'accessibility',
      title: 'Accessibility Statement',
      summary: 'Our commitment to an experience that works for everyone.',
      sections: [
        {
          heading: 'Standard we aim for',
          body: [
            'We target WCAG 2.2 Level AA. That covers keyboard operability, visible focus, colour contrast, text alternatives, and respecting the operating system preference for reduced motion.',
          ],
        },
        {
          heading: 'What we have implemented',
          body: [
            'A skip link on every page, visible focus indicators throughout, dialogs that trap focus and close on Escape, touch targets of at least 44 by 44 pixels, and animation that stops when your system asks for reduced motion.',
          ],
        },
        {
          heading: 'Known limitations',
          body: [
            'Some decorative imagery in editorial articles carries generic alternative text. We are revising it.',
          ],
        },
        {
          heading: 'Contact',
          body: [
            'If any part of this site prevents you from completing what you came to do, write to us and we will provide the information or complete the transaction by another route.',
          ],
        },
      ],
    },
  },
  pt: {
    shipping: {
      slug: 'shipping',
      title: 'Envios e Entregas',
      summary:
        'Como e quando a sua encomenda Lueur Skin chega, e o que fazer se algo correr mal.',
      sections: [
        {
          heading: 'Prazos de expedição',
          body: [
            'As encomendas efetuadas antes das 14:00 (WET) em dia útil são preparadas no próprio dia. As restantes são preparadas no dia útil seguinte.',
            'Receberá a confirmação de expedição com o número de seguimento assim que a encomenda sair das nossas instalações.',
          ],
        },
        {
          heading: 'Prazos de entrega',
          body: [
            'Portugal continental: 1 a 3 dias úteis. Madeira e Açores: 3 a 5 dias úteis.',
            'União Europeia: 3 a 7 dias úteis. Resto do mundo: 7 a 14 dias úteis, sujeito ao desalfandegamento no país de destino.',
          ],
        },
        {
          heading: 'Custos de envio',
          body: [
            'A entrega standard é gratuita em encomendas acima de 50 €. Abaixo desse valor é apresentada uma comparticipação fixa no checkout, antes do pagamento.',
            'Direitos aduaneiros e impostos de importação fora da União Europeia são da responsabilidade do destinatário e não são cobrados por nós.',
          ],
        },
        {
          heading: 'Encomendas extraviadas ou danificadas',
          body: [
            'Se o seguimento não registar movimento durante sete dias úteis, ou se a encomenda chegar danificada, contacte-nos até 14 dias após a data prevista de entrega. Substituímos ou reembolsamos a totalidade da encomenda.',
          ],
        },
      ],
    },
    terms: {
      slug: 'terms',
      title: 'Condições de Venda',
      summary:
        'O contrato entre si e a Lueur Skin by Alliyah quando efetua uma encomenda.',
      sections: [
        {
          heading: 'Com quem contrata',
          body: [
            'As compras neste site formam um contrato com a Lueur Skin by Alliyah, sediada em Portugal. Os preços são apresentados em euros e incluem IVA à taxa aplicável.',
          ],
        },
        {
          heading: 'Encomendas e aceitação',
          body: [
            'A sua encomenda constitui uma proposta de compra. O contrato forma-se no momento em que enviamos a confirmação de expedição, e não quando o pagamento é autorizado.',
            'Podemos recusar uma encomenda se o produto estiver esgotado, se um preço tiver sido publicado por erro, ou se não for possível validar os dados de pagamento ou de entrega.',
          ],
        },
        {
          heading: 'Direito de livre resolução',
          body: [
            'Os consumidores na União Europeia podem resolver o contrato no prazo de 14 dias após a receção dos bens, sem necessidade de indicar motivo. Produtos consumíveis selados não podem ser devolvidos depois de abertos, por razões de proteção da saúde e higiene.',
            'Para exercer este direito, contacte-nos indicando o número da encomenda. Reembolsamos a totalidade do valor, incluindo o custo de envio standard, no prazo de 14 dias após a receção da devolução.',
          ],
        },
        {
          heading: 'Subscrições',
          body: [
            'As subscrições renovam a cada 30 dias ao preço com desconto apresentado no momento da compra. Pode cancelar a qualquer momento na sua conta, antes da renovação seguinte, sem qualquer penalização.',
          ],
        },
        {
          heading: 'Alegações sobre os produtos',
          body: [
            'Os nossos produtos são suplementos alimentares e preparações cosméticas. Não são medicamentos, não diagnosticam, tratam nem curam qualquer condição, e nada neste site constitui aconselhamento médico. Consulte um profissional de saúde se estiver grávida, a amamentar ou a tomar medicação.',
          ],
        },
      ],
    },
    privacy: {
      slug: 'privacy',
      title: 'Política de Privacidade',
      summary:
        'Que dados pessoais tratamos, com que finalidade, e que direitos lhe assistem.',
      sections: [
        {
          heading: 'Dados que tratamos',
          body: [
            'Dados de encomenda: nome, morada de entrega e faturação, email, telefone e histórico de compras. Tratados para execução do contrato de compra e venda.',
            'Dados de conta: endereço de email e palavra-passe cifrada, caso opte por criar conta. Tratados com base no seu consentimento, revogável através da eliminação da conta.',
            'Dados do consultor de pele: o tipo de pele, preocupações e objetivos que seleciona. Utilizados apenas para gerar a recomendação nessa sessão; não construímos perfis a partir deles.',
          ],
        },
        {
          heading: 'Análise e marketing',
          body: [
            'As tecnologias de análise e marketing só são carregadas depois de aceitar a categoria correspondente no banner de cookies. Recusá-las não degrada a experiência de compra.',
          ],
        },
        {
          heading: 'Conservação',
          body: [
            'Os registos de encomendas são conservados durante dez anos para cumprimento das obrigações fiscais e contabilísticas portuguesas. Os dados de conta são eliminados no prazo de 30 dias após pedido de eliminação. Os dados do consultor são descartados no final da sessão.',
          ],
        },
        {
          heading: 'Os seus direitos',
          body: [
            'Pode solicitar acesso, retificação, apagamento, limitação, portabilidade, ou opor-se ao tratamento, escrevendo para o contacto indicado neste site. Respondemos no prazo de um mês.',
            'Tem também o direito de apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD).',
          ],
        },
      ],
    },
    cookies: {
      slug: 'cookies',
      title: 'Política de Cookies',
      summary:
        'Os cookies que este site utiliza e como alterar a sua escolha a qualquer momento.',
      sections: [
        {
          heading: 'Estritamente necessários',
          body: [
            'Mantêm o seu saco de compras, a escolha de idioma e as suas preferências de consentimento. Não podem ser desativados porque o site não funciona sem eles, e nunca alimentam publicidade.',
          ],
        },
        {
          heading: 'Análise',
          body: [
            'Medição agregada e não identificativa das páginas lidas e dos pontos em que os percursos são interrompidos. Só são carregados depois de aceitar a categoria de análise.',
          ],
        },
        {
          heading: 'Marketing',
          body: [
            'Utilizados para medir o efeito das campanhas e evitar mostrar repetidamente a mesma promoção. Só são carregados depois de aceitar a categoria de marketing.',
          ],
        },
        {
          heading: 'Alterar a sua escolha',
          body: [
            'As suas preferências ficam guardadas localmente no navegador e podem ser alteradas a qualquer momento a partir da ligação de definições de cookies no rodapé. Limpar os dados do site repõe o banner.',
          ],
        },
      ],
    },
    accessibility: {
      slug: 'accessibility',
      title: 'Declaração de Acessibilidade',
      summary: 'O nosso compromisso com uma experiência utilizável por todos.',
      sections: [
        {
          heading: 'Norma que seguimos',
          body: [
            'Trabalhamos para o nível AA das WCAG 2.2. Isso abrange operação por teclado, foco visível, contraste de cor, alternativas textuais e respeito pela preferência do sistema por movimento reduzido.',
          ],
        },
        {
          heading: 'O que já está implementado',
          body: [
            'Ligação para saltar para o conteúdo em todas as páginas, indicadores de foco visíveis, janelas de diálogo que retêm o foco e fecham com Escape, áreas de toque de pelo menos 44 por 44 píxeis, e animações que param quando o sistema pede movimento reduzido.',
          ],
        },
        {
          heading: 'Limitações conhecidas',
          body: [
            'Algumas imagens decorativas em artigos editoriais têm texto alternativo genérico. Estamos a rever esse conteúdo.',
          ],
        },
        {
          heading: 'Contacto',
          body: [
            'Se alguma parte deste site o impedir de concluir o que pretendia, escreva-nos: fornecemos a informação ou concluímos a transação por outra via.',
          ],
        },
      ],
    },
  },
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export function getLegalDocument(
  slug: string,
  locale: Locale,
): LegalDocument | undefined {
  return isLegalSlug(slug) ? DOCUMENTS[locale][slug] : undefined;
}

export function getLegalDocuments(locale: Locale): LegalDocument[] {
  return LEGAL_SLUGS.map((slug) => DOCUMENTS[locale][slug]);
}
