import 'server-only';
import type { JSONValue } from 'postgres';
import { getDb } from '@/lib/db/client';
import { toLocale } from '@/i18n';
import type { InventoryStore, Order, OrderAddress, OrderLine, OrderStatus, OrderStore } from './types';

/**
 * Postgres-backed persistence.
 *
 * Money is stored in minor units as integers. Keeping euros as a float in the
 * database invites the classic 38.249999999 problem; converting at the boundary
 * means arithmetic on the stored value is always exact.
 */

const toCents = (value: number) => Math.round(value * 100);
const fromCents = (value: number) => Math.round(value) / 100;

interface OrderRow {
  session_id: string;
  reference: string;
  status: string;
  email: string | null;
  locale: string;
  currency: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  lines: OrderLine[];
  shipping_address: OrderAddress | null;
  is_demo: boolean;
  created_at: Date;
}

function rowToOrder(row: OrderRow): Order {
  return {
    sessionId: row.session_id,
    reference: row.reference,
    status: row.status as OrderStatus,
    email: row.email,
    locale: toLocale(row.locale),
    currency: row.currency,
    lines: row.lines,
    subtotal: fromCents(row.subtotal_cents),
    shipping: fromCents(row.shipping_cents),
    total: fromCents(row.total_cents),
    shippingAddress: row.shipping_address,
    isDemo: row.is_demo,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class PostgresOrderStore implements OrderStore {
  async get(sessionId: string): Promise<Order | null> {
    const rows = await getDb()<OrderRow[]>`
      SELECT * FROM orders WHERE session_id = ${sessionId} LIMIT 1
    `;
    return rows[0] ? rowToOrder(rows[0]) : null;
  }

  async recordPaid(order: Order): Promise<{ created: boolean }> {
    // ON CONFLICT DO NOTHING makes this idempotent across every instance: a
    // replayed webhook collides on the primary key and inserts no row, so
    // `created` is false and the caller knows not to move stock again.
    const rows = await getDb()<{ session_id: string }[]>`
      INSERT INTO orders (
        session_id, reference, status, email, locale, currency,
        subtotal_cents, shipping_cents, total_cents,
        lines, shipping_address, is_demo, created_at
      ) VALUES (
        ${order.sessionId},
        ${order.reference},
        ${order.status},
        ${order.email},
        ${order.locale},
        ${order.currency},
        ${toCents(order.subtotal)},
        ${toCents(order.shipping)},
        ${toCents(order.total)},
        ${getDb().json(order.lines as unknown as JSONValue)},
        ${order.shippingAddress ? getDb().json(order.shippingAddress as unknown as JSONValue) : null},
        ${order.isDemo},
        ${order.createdAt}
      )
      ON CONFLICT (session_id) DO NOTHING
      RETURNING session_id
    `;

    return { created: rows.length > 0 };
  }

  async listByEmail(email: string, limit = 20): Promise<Order[]> {
    const normalised = email.trim().toLowerCase();
    if (!normalised) return [];

    const rows = await getDb()<OrderRow[]>`
      SELECT * FROM orders
      WHERE LOWER(email) = ${normalised}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(rowToOrder);
  }
}

export class PostgresInventoryStore implements InventoryStore {
  async recordSale(lines: OrderLine[]): Promise<void> {
    if (lines.length === 0) return;

    const db = getDb();

    // One transaction, and each product's counter is incremented by the
    // database rather than read into the application first. Two simultaneous
    // sales of the same product both land.
    await db.begin(async (sql) => {
      for (const line of lines) {
        await sql`
          INSERT INTO inventory (product_id, sold, updated_at)
          VALUES (${line.productId}, ${line.quantity}, NOW())
          ON CONFLICT (product_id)
          DO UPDATE SET sold = inventory.sold + ${line.quantity}, updated_at = NOW()
        `;
      }
    });
  }

  async soldQuantities(): Promise<Record<string, number>> {
    const rows = await getDb()<{ product_id: string; sold: number }[]>`
      SELECT product_id, sold FROM inventory
    `;

    const result: Record<string, number> = {};
    for (const row of rows) result[row.product_id] = Number(row.sold);
    return result;
  }
}
