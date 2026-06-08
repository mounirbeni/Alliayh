'use server';
/**
 * @fileOverview An AI-powered skincare advisor that recommends Lueur Skin by Alliyah products based on user input.
 *
 * - skincareAdvisor - A function that handles the skincare product recommendation process.
 * - SkincareAdvisorInput - The input type for the skincareAdvisor function.
 * - SkincareAdvisorOutput - The return type for the skincareAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const SkincareAdvisorInputSchema = z.object({
  skinConcerns: z.array(z.string()).describe('A list of the user\'s primary skin concerns (e.g., "acne", "dryness", "fine lines").'),
  skinType: z.enum(['oily', 'dry', 'combination', 'sensitive', 'normal']).describe('The user\'s skin type.'),
  goals: z.array(z.string()).describe('A list of the user\'s desired skincare goals (e.g., "reduce wrinkles", "even skin tone", "deep hydration").'),
});
export type SkincareAdvisorInput = z.infer<typeof SkincareAdvisorInputSchema>;

// Output Schema
const ProductRecommendationSchema = z.object({
  productName: z.string().describe('The name of the recommended Lueur Skin product.'),
  description: z.string().describe('A concise description of the product and its key features.'),
  benefits: z.string().describe('The main benefits the product offers for the user\'s skin concerns and goals.'),
  usageInstructions: z.string().describe('Brief instructions on how to use the product.'),
});

const SkincareAdvisorOutputSchema = z.object({
  recommendations: z.array(ProductRecommendationSchema).describe('An array of personalized Lueur Skin by Alliyah product recommendations.'),
});
export type SkincareAdvisorOutput = z.infer<typeof SkincareAdvisorOutputSchema>;

/**
 * Provides personalized Lueur Skin product recommendations based on user's skin concerns, skin type, and goals.
 * @param input - The user's skincare profile.
 * @returns An object containing an array of recommended Lueur Skin products.
 */
export async function skincareAdvisor(input: SkincareAdvisorInput): Promise<SkincareAdvisorOutput> {
  return skincareAdvisorFlow(input);
}

// Genkit Prompt
const skincareAdvisorPrompt = ai.definePrompt({
  name: 'skincareAdvisorPrompt',
  input: { schema: SkincareAdvisorInputSchema },
  output: { schema: SkincareAdvisorOutputSchema },
  prompt: `You are an expert aesthetician for "Lueur Skin by Alliyah," a premium skincare brand known for elegance, clinical efficacy, and botanical luxury. 

Your task is to provide personalized product recommendations from the Lueur Skin collection based on the user's profile.

Consider the following information about the user:
Skin Type: {{{skinType}}}
Skin Concerns: {{#each skinConcerns}}- {{{this}}}
{{/each}}
Skincare Goals: {{#each goals}}- {{{this}}}
{{/each}}

Based on this information, recommend up to 3 Lueur Skin products that would best address the user's needs. 

Guidelines:
1. Use an elegant, sophisticated, and encouraging tone.
2. Ensure the recommendations are specific to the Lueur Skin by Alliyah brand.
3. For each recommendation, provide the product name, a description, key benefits, and usage instructions.`,
});

// Genkit Flow
const skincareAdvisorFlow = ai.defineFlow(
  {
    name: 'skincareAdvisorFlow',
    inputSchema: SkincareAdvisorInputSchema,
    outputSchema: SkincareAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await skincareAdvisorPrompt(input);
    return output!;
  }
);
