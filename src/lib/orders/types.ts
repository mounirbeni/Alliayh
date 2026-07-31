/**
 * Order domain.
 *
 * Deliberately provider-agnostic. Stripe is the durable record of a paid order
 * (a Checkout Session holds the line items, the customer and the shipping
 * address), and this layer is what the application reads and writes so that
 * swapping in Firestore, Postgres or an ERP later touches one adapter rather
 * than every page.
 */
import type { Locale } from '@/i18n';

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  /** Unit price actually charged, in euros. */
  unitPrice: number;
  quantity: number;
  isSubscription: boolean;
}

export interface OrderAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  /** Human-facing reference shown to the customer. */
  reference: string;
  /** Stripe Checkout Session id, or a demo id when payments are unconfigured. */
  sessionId: string;
  status: OrderStatus;
  email: string | null;
  locale: Locale;
  currency: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: OrderAddress | null;
  createdAt: string;
  /** True when no payment was actually taken (no Stripe key configured). */
  isDemo: boolean;
}

/**
 * Persistence port.
 *
 * `recordPaid` must be idempotent: Stripe retries webhooks, and a replayed
 * `checkout.session.completed` must not decrement stock twice.
 */
export interface OrderStore {
  get(sessionId: string): Promise<Order | null>;
  recordPaid(order: Order): Promise<{ created: boolean }>;
  listByEmail(email: string, limit?: number): Promise<Order[]>;
}

/** Units sold per product, used to adjust the catalog's declared stock. */
export interface InventoryStore {
  recordSale(lines: OrderLine[]): Promise<void>;
  soldQuantities(): Promise<Record<string, number>>;
}
