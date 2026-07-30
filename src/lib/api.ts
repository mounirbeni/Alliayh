/**
 * Client-facing operations that will eventually hit a real backend.
 *
 * Product reads used to live here behind `await delay(800)` — a hand-written
 * 800 ms stall in front of a local array — which forced every product surface
 * into a spinner and made the collection page unindexable. Reads now go through
 * `@/lib/catalog` synchronously on the server. What remains here is the work
 * that is genuinely asynchronous.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  defaultShippingAddress: string;
}

/** Stand-in latency for the calls that will become real network requests. */
const SIMULATED_LATENCY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(email: string, password: string): Promise<UserProfile> {
  await delay(SIMULATED_LATENCY_MS);
  if (!email || !password) throw new Error('Invalid credentials');

  return {
    id: 'user_123',
    name: email.split('@')[0] ?? 'Guest',
    email,
    defaultShippingAddress: '',
  };
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<UserProfile> {
  await delay(SIMULATED_LATENCY_MS);
  if (!name || !email || !password) throw new Error('Invalid input');

  return { id: 'user_124', name, email, defaultShippingAddress: '' };
}

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

/** Namespaced form, kept for existing call sites. */
export const api = {
  auth: { login, register },
  reviews: { submitReview },
};
