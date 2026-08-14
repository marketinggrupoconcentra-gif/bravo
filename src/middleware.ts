import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware (Edge Runtime) — Bravo México
 *
 * ARCHITECTURE NOTE:
 * Middleware performs preliminary access filtering ONLY.
 * Private route handlers MUST validate admin session server-side via requireAdminSession().
 * Never trust middleware as the sole authorization barrier for private data or mutations.
 *
 * Reason: Edge Runtime does NOT have access to server-only env vars
 * (process.env.ADMIN_SECRET_KEY / SESSION_SECRET are undefined here).
 * Full session validation happens in Node.js route handlers via @/lib/auth/admin.
 */

// Routes that require an authenticated session for all methods (admin UI)
const ADMIN_PAGE_PREFIX = '/admin';

// Non-admin API routes that require authentication for specific methods
const PROTECTED_API_ROUTES = [
  { path: '/api/leads', methods: ['GET', 'PATCH', 'DELETE'] },
  { path: '/api/cms', methods: ['POST', 'PUT', 'DELETE'] },
  { path: '/api/telemetry', methods: ['GET'] },
  { path: '/api/db-check', methods: ['GET', 'POST'] },
  { path: '/api/google-offline', methods: ['GET', 'POST'] },
  { path: '/api/meta-capi', methods: ['GET', 'POST'] },
  { path: '/api/webhook-test', methods: ['GET', 'POST'] },
];

/** Minimal sanity check on cookie presence at the edge (not a security check). */
function hasCookiePresence(request: NextRequest): boolean {
  const token = request.cookies.get('bravo_admin_token')?.value;
  // A valid signed token will always be at least 40 chars (payload.sig)
  return typeof token === 'string' && token.includes('.') && token.length >= 40;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Admin page routes: redirect to login if no cookie present
  //    Full session validation happens server-side in the admin page/handlers.
  if (pathname.startsWith(ADMIN_PAGE_PREFIX)) {
    if (!hasCookiePresence(request)) {
      return NextResponse.redirect(new URL('/acceso', request.url));
    }
    return NextResponse.next();
  }

  // 2. /api/admin/* — pass through to route handlers for full auth validation
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // 3. Other protected API routes — cookie presence check at edge only
  //    Route handlers will perform full server-side validation.
  if (pathname.startsWith('/api/')) {
    const isProtected = PROTECTED_API_ROUTES.some((route) =>
      pathname.startsWith(route.path) && route.methods.includes(method)
    );

    if (isProtected && !hasCookiePresence(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
