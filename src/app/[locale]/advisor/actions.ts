'use server';

import { headers } from 'next/headers';
import { skincareAdvisor, type AdvisorResult } from '@/ai/flows/ai-powered-skincare-advisor-flow';

/**
 * Server action wrapping the advisor flow.
 *
 * The page previously called the Genkit flow straight from a click handler with
 * no validation and no throttling, so a single visitor could drive unbounded
 * model spend by holding down the submit button. Input is validated inside the
 * flow; this layer adds a per-client rate limit.
 *
 * The limiter is in-process and therefore per-instance. It is a guardrail, not a
 * security boundary — move it to a shared store (Redis, Firestore) before
 * running on more than one instance.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

const hits = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [entry, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entry);
    }
  }

  return true;
}

export async function requestRecommendations(input: unknown): Promise<AdvisorResult> {
  const headerList = await headers();
  const client =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'anonymous';

  if (!rateLimit(client)) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  return skincareAdvisor(input);
}
