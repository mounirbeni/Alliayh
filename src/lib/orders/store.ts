import 'server-only';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FirestoreInventoryStore, FirestoreOrderStore, withEmailIndex } from './firestore';
import type { InventoryStore, Order, OrderLine, OrderStore } from './types';

/**
 * Persistence selection.
 *
 * Firestore is used whenever credentials are present; otherwise the in-memory
 * adapters below keep the storefront working for a contributor without a
 * Firebase project. The in-memory pair is honest about its limits — state is
 * lost on restart and is not shared between instances — so it is a development
 * convenience, never the production path.
 */

const orders = new Map<string, Order>();
const sold = new Map<string, number>();

class MemoryOrderStore implements OrderStore {
  async get(sessionId: string): Promise<Order | null> {
    return orders.get(sessionId) ?? null;
  }

  async recordPaid(order: Order): Promise<{ created: boolean }> {
    // Idempotency guard: Stripe retries webhooks on any non-2xx and delivers
    // at-least-once even on success. Re-recording must be a no-op.
    if (orders.has(order.sessionId)) return { created: false };

    orders.set(order.sessionId, order);
    return { created: true };
  }

  async listByEmail(email: string, limit = 20): Promise<Order[]> {
    const normalised = email.trim().toLowerCase();
    return [...orders.values()]
      .filter((order) => order.email?.toLowerCase() === normalised)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
}

class MemoryInventoryStore implements InventoryStore {
  async recordSale(lines: OrderLine[]): Promise<void> {
    for (const line of lines) {
      sold.set(line.productId, (sold.get(line.productId) ?? 0) + line.quantity);
    }
  }

  async soldQuantities(): Promise<Record<string, number>> {
    return Object.fromEntries(sold);
  }
}

/**
 * Adds the lowercased email index Firestore queries need, then delegates.
 * Wrapping keeps that storage detail out of the domain type.
 */
class IndexedOrderStore implements OrderStore {
  constructor(private readonly inner: OrderStore) {}

  get(sessionId: string) {
    return this.inner.get(sessionId);
  }

  recordPaid(order: Order) {
    return this.inner.recordPaid(withEmailIndex(order));
  }

  listByEmail(email: string, limit?: number) {
    return this.inner.listByEmail(email, limit);
  }
}

const usingFirestore = isFirebaseAdminConfigured();

if (!usingFirestore && process.env.NODE_ENV === 'production') {
  console.warn(
    '[orders] No Firebase credentials found — orders and inventory are being kept in memory. ' +
      'They will be lost on restart and are not shared between instances. See .env.example.',
  );
}

export const orderStore: OrderStore = usingFirestore
  ? new IndexedOrderStore(new FirestoreOrderStore())
  : new MemoryOrderStore();

export const inventoryStore: InventoryStore = usingFirestore
  ? new FirestoreInventoryStore()
  : new MemoryInventoryStore();

/** True when orders survive a restart. Surfaced in diagnostics and the README. */
export const isPersistent = usingFirestore;

/** Order references are what the customer quotes in an email; keep them short. */
export function generateOrderReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LUEUR-${random}`;
}
