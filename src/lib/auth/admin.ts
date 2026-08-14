import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Shared admin session guard for all /api/admin/* routes.
 * Uses the same cookie name as the login route: bravo_admin_token.
 * Returns a 401 NextResponse if unauthorized, or null if the request is valid.
 */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("bravo_admin_token")?.value;
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (!secretKey || !token || token !== secretKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // authenticated
}

/**
 * Returns the identity label for audit logs.
 * Uses a neutral role label (no fabricated user identity).
 */
export function getAdminIdentityLabel(): string {
  return "Administrador del Sistema";
}
