import 'server-only';
import { GoogleGenAI } from '@google/genai';

/**
 * Gemini client.
 *
 * This replaces Genkit. Genkit was pulling in `@genkit-ai/firebase`, and with it
 * ~74 Firebase packages and 594 modules in total, to serve exactly one prompt
 * with a structured response. Calling the model API directly does the same job
 * with a fraction of the dependency surface and no Firebase anywhere.
 *
 * Lazy, so a deployment without a key falls back to the deterministic matcher
 * instead of failing at import time.
 */

export const GEMINI_MODEL = 'gemini-2.5-flash';

let client: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_GENAI_API_KEY ?? process.env.GEMINI_API_KEY);
}

export function getGemini(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GENAI_API_KEY is not set. The advisor falls back to rule-based matching.');
  }

  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}
