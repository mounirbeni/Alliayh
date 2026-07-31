import 'server-only';
import type { InventoryStore, Order, OrderLine, OrderStore } from './types';

/**
 * In-memory adapter.
 *
 * This is the development and single-instance default. It is honest about its
 * limits: state is lost on restart and is not shared between instances, so
 * inventory counts drift once the app is scaled horizontally.
 *
 * Stripe remains the durable record — `getOrder` falls back to retrieving the
 * Checkout Session directly, so a customer refreshing the confirmation page
 * still sees their order even after a deploy wiped this map.
 *
 * To go multi-instance, implement `OrderStore` and `InventoryStore` against
 * Firestore (the project already depends on `firebase` and targets Firebase App
 * Hosting) and swap the two exports at the bottom of this file. Nothing else
 * in the codebase needs to change.
 */

const orders = new Map<string, Order>();
const sold = new Map<string, number>();

class MemoryOrderStore implements OrderStore {
  async get(sessionId: string): Promise<Order | null> {
    return orders.get(sessionId) ?? null;
  }

  async recordPaid(order: Order): Promise<{ created: boolean }> {
    // Idempotency guard: Stripe retries webhooks on any non-2xx, and delivers
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

export const orderStore: OrderStore = new MemoryOrderStore();
export const inventoryStore: InventoryStore = new MemoryInventoryStore();

/** Order references are what the customer quotes in an email; keep them short. */
export function generateOrderReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LUEUR-${random}`;
}
