/**
 * Admin Session Management — Bravo México
 *
 * ARCHITECTURE:
 *   ADMIN_SECRET_KEY validates the password at login.
 *   After validation, a short-lived SESSION TOKEN is generated (HMAC-SHA256 signed).
 *   The SESSION TOKEN — NOT the secret — is stored in the HttpOnly cookie.
 *   Every private route handler verifies the token's HMAC signature server-side.
 *
 * Middleware performs preliminary access filtering only.
 * Private route handlers MUST validate admin session server-side via requireAdminSession().
 *
 * SESSION_SECRET env var is used for signing (separate from ADMIN_SECRET_KEY).
 * Falls back to ADMIN_SECRET_KEY if SESSION_SECRET is not set (acceptable for single-admin setups).
 */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "bravo_admin_token";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function getSigningKey(): string {
  const key = process.env.SESSION_SECRET || process.env.ADMIN_SECRET_KEY;
  if (!key) throw new Error("SESSION_SECRET or ADMIN_SECRET_KEY must be set");
  return key;
}

/**
 * Creates a signed session token.
 * Format: `{payload}.{hmac}`
 * Payload: base64url-encoded JSON { sub, iat, exp }
 */
export function createSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      sub: randomBytes(16).toString("hex"), // random session ID
      iat: now,
      exp: now + SESSION_TTL_SECONDS,
      v: 1,
    })
  ).toString("base64url");

  const signingKey = getSigningKey();
  const sig = createHmac("sha256", signingKey).update(payload).digest("base64url");

  return `${payload}.${sig}`;
}

/**
 * Verifies a session token.
 * Returns true if valid and not expired, false otherwise.
 */
export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payload, sig] = parts;
    const signingKey = getSigningKey();
    const expectedSig = createHmac("sha256", signingKey)
      .update(payload)
      .digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

    // Check expiry
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    if (data.exp < now) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Server-side admin session guard.
 * Call this at the TOP of every private route handler.
 *
 * Usage:
 *   const authError = await requireAdminSession();
 *   if (authError) return authError;
 *
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAdminSession(): Promise<NextResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null; // authenticated
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/**
 * Returns the identity label for audit logs.
 */
export function getAdminIdentityLabel(): string {
  return "Administrador del Sistema";
}

/**
 * Allowed admin emails (explicit allowlist — no permissive substring matching).
 * Configure ADMIN_EMAIL env var to override the default.
 */
export function isAllowedAdminEmail(email: string): boolean {
  const envEmail = process.env.ADMIN_EMAIL;
  const allowlist = envEmail
    ? envEmail.split(",").map((e) => e.trim().toLowerCase())
    : ["admin@bravo.mx", "admin@bravocredito.com"];

  return allowlist.includes(email.trim().toLowerCase());
}

export { COOKIE_NAME, SESSION_TTL_SECONDS };
