'use server';
/**
 * @fileOverview Catalog-grounded skincare advisor.
 *
 * The original prompt asked the model to "recommend up to 3 Lueur Skin
 * products" without ever telling it what Lueur Skin sells. With four products
 * in the catalog and none named in the prompt, every recommendation was
 * invented: plausible serums and cleansers that cannot be bought, with no way
 * to link a result to a product page.
 *
 * This version injects the real catalog, constrains the model to catalog ids,
 * discards anything it invents anyway, answers in the visitor's language, and
 * falls back to a deterministic concern match when the model is unavailable —
 * so the feature degrades instead of erroring.
 */

import { Type } from '@google/genai';
import { z } from 'zod';
import { GEMINI_MODEL, getGemini, isGeminiConfigured } from '@/lib/ai/gemini';
import { getProducts, CONCERNS } from '@/lib/catalog';
import { LOCALES, type Locale } from '@/i18n';

const SkincareAdvisorInputSchema = z.object({
  skinType: z.enum(['oily', 'dry', 'combination', 'sensitive', 'normal']),
  /** Concern keys from the shared taxonomy — not free text. */
  concerns: z.array(z.enum(CONCERNS)).min(1).max(CONCERNS.length),
  goals: z.array(z.string().min(1).max(60)).max(6),
  locale: z.enum(LOCALES),
});
export type SkincareAdvisorInput = z.infer<typeof SkincareAdvisorInputSchema>;

/** Validates whatever the model returns before any of it is trusted. */
const ModelOutputSchema = z.object({
  intro: z.string().min(1).max(400),
  recommendations: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        reason: z.string().min(1).max(600),
        usageAdvice: z.string().min(1).max(600),
      }),
    )
    .min(1)
    .max(3),
});

/** A recommendation joined to the real product record, ready to render. */
export interface ResolvedRecommendation {
  productId: string;
  reason: string;
  usageAdvice: string;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  price: number;
  href: string;
  inStock: boolean;
}

export interface AdvisorResult {
  intro: string;
  recommendations: ResolvedRecommendation[];
  /** True when the deterministic matcher answered instead of the model. */
  usedFallback: boolean;
}

const LANGUAGE_NAMES: Record<Locale, string> = {
  pt: 'European Portuguese (pt-PT)',
  en: 'British English (en-GB)',
};

const FALLBACK_INTRO: Record<Locale, string> = {
  pt: 'Com base no seu tipo de pele e nas preocupações indicadas, selecionámos os rituais da coleção que melhor correspondem ao seu perfil.',
  en: 'Based on your skin type and the concerns you selected, we have matched the rituals in the collection that fit your profile most closely.',
};

/**
 * Response schema handed to the model.
 *
 * Gemini enforces this server-side, so the reply is already shaped correctly —
 * there is no JSON-in-a-code-fence to parse out of prose. It is still validated
 * with zod afterwards, because a schema-constrained reply is not the same as a
 * trustworthy one.
 */
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    intro: {
      type: Type.STRING,
      description: "One elegant sentence summarising the visitor's profile.",
    },
    recommendations: {
      type: Type.ARRAY,
      minItems: '1',
      maxItems: '3',
      items: {
        type: Type.OBJECT,
        properties: {
          productId: {
            type: Type.STRING,
            description: 'An id copied exactly from the provided catalog. Never invent one.',
          },
          reason: {
            type: Type.STRING,
            description: "Why this product suits the visitor's profile, in two sentences.",
          },
          usageAdvice: {
            type: Type.STRING,
            description: 'How to use it for this profile, in one or two sentences.',
          },
        },
        required: ['productId', 'reason', 'usageAdvice'],
      },
    },
  },
  required: ['intro', 'recommendations'],
};

function buildPrompt(input: SkincareAdvisorInput, catalogJson: string): string {
  return `You are the lead aesthetician for "Lueur Skin by Alliyah", a botanical skincare and wellness brand.

You may ONLY recommend products from this catalog. Never invent a product, and never
return an id that does not appear here:

${catalogJson}

Visitor profile
  Skin type: ${input.skinType}
  Concerns: ${input.concerns.join(', ')}
  Goals: ${input.goals.join(', ') || '(none stated)'}

Instructions
1. Write every field in ${LANGUAGE_NAMES[input.locale]}.
2. Recommend between one and three products, most relevant first. Fewer strong
   matches is better than three padded ones.
3. "productId" must be copied exactly from the catalog above.
4. Reference the visitor's actual concerns and the product's real ingredients and
   benefits. Do not claim to treat medical conditions.
5. Tone: elegant, warm, precise. No hard selling.`;
}

/**
 * Deterministic matcher used when the model is unreachable or unusable.
 * Scores each product by concern overlap, then by rating.
 */
function fallbackRecommendations(input: SkincareAdvisorInput): AdvisorResult {
  const ranked = getProducts(input.locale)
    .map((product) => ({
      product,
      score: product.concerns.filter((concern) => input.concerns.includes(concern)).length,
    }))
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .filter((entry, index) => entry.score > 0 || index === 0)
    .slice(0, 3);

  return {
    intro: FALLBACK_INTRO[input.locale],
    usedFallback: true,
    recommendations: ranked.map(({ product }) => ({
      productId: product.id,
      reason: `${product.tagline}. ${product.benefits.slice(0, 2).join('. ')}.`,
      usageAdvice: product.usage,
      name: product.name,
      tagline: product.tagline,
      image: product.image,
      imageAlt: product.imageAlt,
      price: product.price,
      href: product.href,
      inStock: product.inStock,
    })),
  };
}

/**
 * Public entry point. Always resolves: on any model failure the deterministic
 * matcher answers instead, so the page never reaches a dead end.
 */
export async function skincareAdvisor(rawInput: unknown): Promise<AdvisorResult> {
  const input = SkincareAdvisorInputSchema.parse(rawInput);
  const products = getProducts(input.locale);
  const byId = new Map(products.map((product) => [product.id, product]));

  if (!isGeminiConfigured()) return fallbackRecommendations(input);

  try {
    // Only the fields the model needs to reason with — not the whole record.
    const catalogJson = JSON.stringify(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.categoryLabel,
        description: product.description,
        benefits: product.benefits,
        keyIngredients: product.ingredients,
        addresses: product.concerns,
        usage: product.usage,
        priceEur: product.price,
        inStock: product.inStock,
      })),
      null,
      2,
    );

    const response = await getGemini().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(input, catalogJson),
      config: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return fallbackRecommendations(input);

    const parsed = ModelOutputSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      console.error('[advisor] model output failed validation:', parsed.error.issues);
      return fallbackRecommendations(input);
    }

    // Drop anything the model invented rather than rendering a broken link.
    const resolved = parsed.data.recommendations
      .map((recommendation): ResolvedRecommendation | null => {
        const product = byId.get(recommendation.productId);
        if (!product) return null;
        return {
          productId: product.id,
          reason: recommendation.reason,
          usageAdvice: recommendation.usageAdvice,
          name: product.name,
          tagline: product.tagline,
          image: product.image,
          imageAlt: product.imageAlt,
          price: product.price,
          href: product.href,
          inStock: product.inStock,
        };
      })
      .filter((entry): entry is ResolvedRecommendation => entry !== null);

    if (resolved.length === 0) return fallbackRecommendations(input);

    return { intro: parsed.data.intro, recommendations: resolved, usedFallback: false };
  } catch (error) {
    console.error('[advisor] falling back to deterministic matching:', error);
    return fallbackRecommendations(input);
  }
}
