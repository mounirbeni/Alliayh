import 'server-only';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import type { InventoryStore, Order, OrderLine, OrderStore } from './types';

/**
 * Firestore-backed persistence.
 *
 * Two collections:
 *   orders/{sessionId}     — one document per Checkout Session
 *   inventory/{productId}  — { sold: number }, updated with atomic increments
 *
 * Keying orders by the Stripe session id is what makes `recordPaid` idempotent
 * across instances: a webhook replay lands on the same document, and the
 * `create` below fails rather than double-counting a sale. The in-memory
 * adapter could only guarantee that within one process.
 */

const ORDERS = 'orders';
const INVENTORY = 'inventory';

function db(): Firestore {
  return getAdminFirestore();
}

export class FirestoreOrderStore implements OrderStore {
  async get(sessionId: string): Promise<Order | null> {
    const snapshot = await db().collection(ORDERS).doc(sessionId).get();
    return snapshot.exists ? (snapshot.data() as Order) : null;
  }

  async recordPaid(order: Order): Promise<{ created: boolean }> {
    const ref = db().collection(ORDERS).doc(order.sessionId);

    try {
      // `create` throws if the document already exists — the cheapest possible
      // distributed idempotency guard, and it is atomic.
      await ref.create({ ...order, recordedAt: FieldValue.serverTimestamp() });
      return { created: true };
    } catch (error) {
      const code = (error as { code?: number | string }).code;
      // 6 / ALREADY_EXISTS is the expected outcome of a webhook replay.
      if (code === 6 || code === 'already-exists') return { created: false };
      throw error;
    }
  }

  async listByEmail(email: string, limit = 20): Promise<Order[]> {
    const normalised = email.trim().toLowerCase();
    if (!normalised) return [];

    const snapshot = await db()
      .collection(ORDERS)
      .where('emailLower', '==', normalised)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Order);
  }
}

export class FirestoreInventoryStore implements InventoryStore {
  async recordSale(lines: OrderLine[]): Promise<void> {
    if (lines.length === 0) return;

    const batch = db().batch();
    for (const line of lines) {
      const ref = db().collection(INVENTORY).doc(line.productId);
      // `increment` is applied server-side, so concurrent sales of the same
      // product cannot overwrite each other the way a read-modify-write would.
      batch.set(
        ref,
        { sold: FieldValue.increment(line.quantity), updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    }
    await batch.commit();
  }

  async soldQuantities(): Promise<Record<string, number>> {
    const snapshot = await db().collection(INVENTORY).get();
    const result: Record<string, number> = {};

    for (const doc of snapshot.docs) {
      const sold = (doc.data() as { sold?: number }).sold;
      if (typeof sold === 'number') result[doc.id] = sold;
    }

    return result;
  }
}

/** Orders are stored with a lowercased email so `listByEmail` can index it. */
export function withEmailIndex(order: Order): Order & { emailLower: string | null } {
  return { ...order, emailLower: order.email ? order.email.trim().toLowerCase() : null };
}
