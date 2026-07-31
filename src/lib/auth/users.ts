import 'server-only';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { hashPassword } from './password';

/**
 * User repository.
 *
 * Email is treated as case-insensitive everywhere. The uniqueness constraint is
 * on `LOWER(email)` in the schema, so the database enforces it rather than
 * trusting two call sites to normalise identically.
 */

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  shippingAddress: string | null;
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  shipping_address: string | null;
}

function rowToUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    shippingAddress: row.shipping_address,
  };
}

export function isUserStoreConfigured(): boolean {
  return isDatabaseConfigured();
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const rows = await getDb()<UserRow[]>`
    SELECT * FROM users WHERE LOWER(email) = ${email.trim().toLowerCase()} LIMIT 1
  `;
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const rows = await getDb()<UserRow[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToUser(rows[0]) : null;
}

/**
 * Create an account. Returns null when the address is already taken.
 *
 * The race between "check if it exists" and "insert" is resolved by the unique
 * index, not by the check — two simultaneous registrations for the same address
 * cannot both succeed.
 */
export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<UserRecord | null> {
  const passwordHash = await hashPassword(password);

  const rows = await getDb()<UserRow[]>`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email.trim()}, ${passwordHash}, ${name.trim() || null})
    ON CONFLICT (LOWER(email)) DO NOTHING
    RETURNING *
  `;

  return rows[0] ? rowToUser(rows[0]) : null;
}

/** Replace a stored hash, e.g. after raising the scrypt cost parameters. */
export async function updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
  await getDb()`
    UPDATE users SET password_hash = ${passwordHash}, updated_at = NOW() WHERE id = ${userId}
  `;
}

export async function updateShippingAddress(userId: string, address: string): Promise<void> {
  await getDb()`
    UPDATE users SET shipping_address = ${address}, updated_at = NOW() WHERE id = ${userId}
  `;
}
