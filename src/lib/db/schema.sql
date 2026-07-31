-- Lueur Skin — database schema.
--
-- Plain Postgres, no extensions beyond pgcrypto, so it runs unchanged on any
-- provider or on a Postgres you host yourself.
--
-- Apply with:  npm run db:migrate
--          or: psql "$DATABASE_URL" -f src/lib/db/schema.sql
--
-- Every statement is idempotent, so re-running it is safe.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────
-- Orders
--
-- Keyed by the Stripe Checkout Session id. That is what makes the webhook
-- idempotent across instances: a replayed event collides on the primary key
-- and the INSERT is discarded rather than counting the sale twice.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  session_id        TEXT PRIMARY KEY,
  reference         TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('pending','paid','fulfilled','cancelled','refunded')),
  email             TEXT,
  locale            TEXT NOT NULL,
  currency          TEXT NOT NULL,
  -- Money in minor units (cents). Integers cannot drift the way floats do.
  subtotal_cents    INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  shipping_cents    INTEGER NOT NULL CHECK (shipping_cents >= 0),
  total_cents       INTEGER NOT NULL CHECK (total_cents >= 0),
  lines             JSONB  NOT NULL,
  shipping_address  JSONB,
  is_demo           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL,
  recorded_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order history is looked up by the signed-in customer's address, matched
-- case-insensitively.
CREATE INDEX IF NOT EXISTS orders_email_created_idx
  ON orders (LOWER(email), created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Inventory
--
-- Units sold per product. The catalog declares opening stock; this records what
-- has left. Updated with an atomic UPDATE so concurrent sales cannot overwrite
-- each other the way a read-modify-write would.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  product_id  TEXT PRIMARY KEY,
  sold        INTEGER NOT NULL DEFAULT 0 CHECK (sold >= 0),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Users
--
-- `password_hash` holds a self-describing scrypt string (algorithm, cost
-- parameters, salt, hash). No plaintext or reversible form of a password is
-- ever stored, and the cost parameters live with the hash so they can be
-- raised later without invalidating existing accounts.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL,
  password_hash  TEXT NOT NULL,
  name           TEXT,
  -- Local default; the authoritative address for an order is on the order.
  shipping_address TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email addresses are case-insensitive in practice; this makes that a database
-- guarantee rather than an application convention two callers might disagree on.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (LOWER(email));

-- ─────────────────────────────────────────────────────────────────────────────
-- Sessions
--
-- Only the SHA-256 of the session token is stored. A read of this table
-- therefore does not let an attacker impersonate anyone — the raw token exists
-- solely in the customer's HttpOnly cookie.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent  TEXT
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions (expires_at);
