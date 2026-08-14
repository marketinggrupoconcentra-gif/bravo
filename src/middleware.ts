import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedApiRoutes = [
  { path: '/api/leads', methods: ['GET', 'PATCH', 'DELETE'] }, // POST is allowed for form submission
  { path: '/api/cms', methods: ['POST', 'PUT', 'DELETE'] }, // GET is allowed for public rendering
  { path: '/api/telemetry', methods: ['GET'] }, // POST is allowed for tracking
  { path: '/api/db-check', methods: ['GET', 'POST'] },
  { path: '/api/google-offline', methods: ['GET', 'POST'] },
  { path: '/api/meta-capi', methods: ['GET'] },
  // All /api/admin/* routes require authentication for ALL methods
  { path: '/api/admin/', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Protect admin page routes (redirect to login)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('bravo_admin_token')?.value;
    if (!token || token !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.redirect(new URL('/acceso', request.url));
    }
  }

  // 2. Protect admin API routes (all methods under /api/admin/)
  if (pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('bravo_admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (
      token !== process.env.ADMIN_SECRET_KEY &&
      bearerToken !== process.env.ADMIN_SECRET_KEY
    ) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 3. Check other protected API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin/')) {
    const isProtected = protectedApiRoutes.some((route) => {
      return (
        route.path !== '/api/admin/' &&
        pathname.startsWith(route.path) &&
        route.methods.includes(method)
      );
    });

    if (isProtected) {
      const token = request.cookies.get('bravo_admin_token')?.value;
      const authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      if (
        token !== process.env.ADMIN_SECRET_KEY &&
        bearerToken !== process.env.ADMIN_SECRET_KEY
      ) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
