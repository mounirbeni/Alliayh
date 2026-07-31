import 'server-only';
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Password hashing.
 *
 * Uses scrypt from Node's standard library — a memory-hard KDF, which is what
 * makes GPU and ASIC cracking expensive in a way that plain SHA-2 does not.
 * No third-party dependency is involved.
 *
 * The stored value is self-describing:
 *
 *     scrypt$N$r$p$<salt-base64>$<hash-base64>
 *
 * Carrying the cost parameters with the hash means they can be raised later
 * without invalidating existing accounts: an old hash still verifies against
 * its own parameters, and `needsRehash` tells the caller to upgrade it on the
 * next successful sign-in.
 */

/**
 * `promisify` picks the 3-argument overload, which drops the options object we
 * need for the cost parameters. Typing the promisified function explicitly
 * keeps N/r/p in play.
 */
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

/**
 * Cost parameters: N=2^16, r=8, p=2.
 *
 * This is one of OWASP's listed configurations, equivalent in total work to
 * N=2^17/r=8/p=1 but using half the memory (~64 MB instead of ~128 MB per
 * hash). Memory is the binding constraint in practice: on a serverless runtime
 * with a 256–512 MB limit, a handful of concurrent sign-ins at 128 MB each will
 * exhaust the function before CPU ever becomes the problem.
 *
 * `maxmem` has to be raised past Node's 32 MB default or it refuses the work
 * factor outright.
 */
const N = 2 ** 16;
const R = 8;
const P = 2;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEM = 192 * 1024 * 1024;

/** Bcrypt truncates at 72 bytes; scrypt does not, but a bound stops abuse. */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 200;

export async function hashPassword(password: string): Promise<string> {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error('Password length out of range');
  }

  const salt = randomBytes(SALT_LENGTH);
  const derived = await scryptAsync(password.normalize('NFKC'), salt, KEY_LENGTH, {
    N,
    r: R,
    p: P,
    maxmem: MAX_MEM,
  });

  return ['scrypt', N, R, P, salt.toString('base64'), derived.toString('base64')].join('$');
}

/**
 * Verify a password against a stored hash.
 *
 * Always returns a boolean — never throws on a malformed stored value — so a
 * corrupted row cannot be distinguished from a wrong password by timing or by
 * error type.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

    const [, nRaw, rRaw, pRaw, saltB64, hashB64] = parts;
    const n = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

    const salt = Buffer.from(saltB64!, 'base64');
    const expected = Buffer.from(hashB64!, 'base64');

    const derived = await scryptAsync(password.normalize('NFKC'), salt, expected.length, {
      N: n,
      r,
      p,
      maxmem: MAX_MEM,
    });

    // Constant-time: a byte-by-byte `===` leaks how much of the hash matched.
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** True when a stored hash was produced with weaker parameters than current. */
export function needsRehash(stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return true;
  return Number(parts[1]) < N || Number(parts[2]) < R || Number(parts[3]) < P;
}

/**
 * Burn roughly the time a real verification takes.
 *
 * Called when no account exists for the submitted address. Without it, sign-in
 * returns noticeably faster for unknown addresses than for known ones, which
 * turns the login form into an account-enumeration oracle no matter how careful
 * the error messages are.
 */
export async function fakeVerify(): Promise<void> {
  const salt = randomBytes(SALT_LENGTH);
  await scryptAsync('decoy-password', salt, KEY_LENGTH, { N, r: R, p: P, maxmem: MAX_MEM });
}
