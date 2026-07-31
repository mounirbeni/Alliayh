/**
 * Client-facing operations that will eventually hit a real backend.
 *
 * This module used to hold product reads behind `await delay(800)` — a
 * hand-written stall in front of a local array — and an `api.auth.login()` that
 * returned a hard-coded user for any non-empty email and password. Reads now go
 * through `@/lib/catalog` on the server, and authentication is Firebase's job
 * (`@/lib/store/useAuthStore`). What remains is the work that is genuinely
 * asynchronous and not yet backed by a service.
 */

/** Stand-in latency for the call that will become a real network request. */
const SIMULATED_LATENCY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitReview(
  productId: string,
  rating: number,
  comment: string,
): Promise<{ success: boolean }> {
  await delay(SIMULATED_LATENCY_MS);
  if (!productId || rating < 1 || rating > 5 || comment.trim().length < 10) {
    throw new Error('Invalid review');
  }
  return { success: true };
}
