'use server';
/**
 * @fileOverview Catalog-grounded skincare advisor.
 *
 * The previous prompt asked the model to "recommend up to 3 Lueur Skin
 * products" without ever telling it what Lueur Skin sells. With four products
 * in the catalog and none of them named in the prompt, every recommendation was
 * invented: plausible-sounding serums and cleansers that cannot be bought, and
 * no way to link a result to a product page.
 *
 * This version:
 *   - injects the real catalog into the prompt,
 *   - constrains the model to return catalog ids,
 *   - discards any id that is not in the catalog,
 *   - answers in the visitor's language,
 *   - falls back to a deterministic concern match when the model is
 *     unavailable, so the feature degrades instead of erroring.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { getProducts, CONCERNS } from '@/lib/catalog';
import { LOCALES, type Locale } from '@/i18n';

const SkinTypeSchema = z.enum(['oily', 'dry', 'combination', 'sensitive', 'normal']);

const SkincareAdvisorInputSchema = z.object({
  skinType: SkinTypeSchema,
  /** Concern keys from the shared taxonomy — not free text. */
  concerns: z.array(z.enum(CONCERNS)).min(1).max(CONCERNS.length),
  goals: z.array(z.string().min(1).max(60)).max(6),
  locale: z.enum(LOCALES),
});
export type SkincareAdvisorInput = z.infer<typeof SkincareAdvisorInputSchema>;

const RecommendationSchema = z.object({
  productId: z.string().describe('The id of a product from the provided catalog. Never invent one.'),
  reason: z.string().describe("Why this product suits the visitor's profile, in two sentences."),
  usageAdvice: z.string().describe('How to use it for this profile, in one or two sentences.'),
});

const SkincareAdvisorOutputSchema = z.object({
  intro: z.string().describe("One elegant sentence summarising the visitor's profile."),
  recommendations: z.array(RecommendationSchema).min(1).max(3),
});
export type SkincareAdvisorOutput = z.infer<typeof SkincareAdvisorOutputSchema>;

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

const advisorPrompt = ai.definePrompt({
  name: 'skincareAdvisorPrompt',
  input: {
    schema: SkincareAdvisorInputSchema.extend({
      catalogJson: z.string(),
      languageName: z.string(),
    }),
  },
  output: { schema: SkincareAdvisorOutputSchema },
  prompt: `You are the lead aesthetician for "Lueur Skin by Alliyah", a botanical skincare and wellness brand.

You may ONLY recommend products from this catalog. Never invent a product, and never
return an id that does not appear here:

{{{catalogJson}}}

Visitor profile
  Skin type: {{{skinType}}}
  Concerns: {{#each concerns}}{{{this}}}, {{/each}}
  Goals: {{#each goals}}{{{this}}}, {{/each}}

Instructions
1. Write every field in {{{languageName}}}.
2. Recommend between one and three products, most relevant first. Fewer strong
   matches is better than three padded ones.
3. "productId" must be copied exactly from the catalog above.
4. Reference the visitor's actual concerns and the product's real ingredients and
   benefits. Do not claim to treat medical conditions.
5. Tone: elegant, warm, precise. No hard selling.`,
});

/**
 * Deterministic matcher used when the model is unreachable or unusable.
 * Scores each product by concern overlap, then by rating.
 */
function fallbackRecommendations(input: SkincareAdvisorInput): AdvisorResult {
  const products = getProducts(input.locale);

  const ranked = products
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

const advisorFlow = ai.defineFlow(
  {
    name: 'skincareAdvisorFlow',
    inputSchema: SkincareAdvisorInputSchema,
    outputSchema: SkincareAdvisorOutputSchema,
  },
  async (input) => {
    const products = getProducts(input.locale);

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

    const { output } = await advisorPrompt({
      ...input,
      catalogJson,
      languageName: LANGUAGE_NAMES[input.locale],
    });

    if (!output) throw new Error('Advisor returned no output');
    return output;
  },
);

/**
 * Public entry point. Always resolves: on any model failure the deterministic
 * matcher answers instead, so the page never reaches a dead end.
 */
export async function skincareAdvisor(rawInput: unknown): Promise<AdvisorResult> {
  const input = SkincareAdvisorInputSchema.parse(rawInput);
  const byId = new Map(getProducts(input.locale).map((product) => [product.id, product]));

  try {
    const output = await advisorFlow(input);

    // Drop anything the model invented rather than rendering a broken link.
    const resolved = output.recommendations
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

    return { intro: output.intro, recommendations: resolved, usedFallback: false };
  } catch (error) {
    console.error('[advisor] falling back to deterministic matching:', error);
    return fallbackRecommendations(input);
  }
}
