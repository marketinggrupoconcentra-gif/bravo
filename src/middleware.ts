import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware (Edge Runtime)
 *
 * NOTE: Edge Runtime does NOT have access to server-only env vars
 * (process.env.ADMIN_SECRET_KEY is undefined here).
 * Therefore we ONLY check cookie presence at the edge layer.
 * The actual secret comparison happens in:
 *   - requireAdminSession() → for /api/admin/* routes
 *   - /admin page itself    → via the route handler on the server
 */

// Routes that require authentication (non-admin)
const protectedApiRoutes = [
  { path: '/api/leads', methods: ['GET', 'PATCH', 'DELETE'] },
  { path: '/api/cms', methods: ['POST', 'PUT', 'DELETE'] },
  { path: '/api/telemetry', methods: ['GET'] },
  { path: '/api/db-check', methods: ['GET', 'POST'] },
  { path: '/api/google-offline', methods: ['GET', 'POST'] },
  { path: '/api/meta-capi', methods: ['GET'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Protect /admin page routes at the edge (presence check only)
  //    Full secret validation is done server-side in each admin API handler.
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('bravo_admin_token')?.value;
    if (!token || token.length < 6) {
      return NextResponse.redirect(new URL('/acceso', request.url));
    }
  }

  // 2. /api/admin/* — pass through to route handlers which do full auth
  //    (requireAdminSession uses server-side env vars correctly)
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // 3. Other protected API routes — presence check at edge
  if (pathname.startsWith('/api/')) {
    const isProtected = protectedApiRoutes.some((route) =>
      pathname.startsWith(route.path) && route.methods.includes(method)
    );

    if (isProtected) {
      const token = request.cookies.get('bravo_admin_token')?.value;
      const authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

      if (!token && !bearerToken) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
