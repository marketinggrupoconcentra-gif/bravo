import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedApiRoutes = [
  { path: '/api/leads', methods: ['GET', 'PATCH', 'DELETE'] }, // POST is allowed for the landing page
  { path: '/api/cms', methods: ['POST', 'PUT', 'DELETE'] }, // GET is allowed for the landing page
  { path: '/api/telemetry', methods: ['GET'] }, // POST is allowed for the landing page tracking
  { path: '/api/db-check', methods: ['GET', 'POST'] },
  { path: '/api/google-offline', methods: ['GET', 'POST'] },
  { path: '/api/meta-capi', methods: ['GET'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Check if the route is an admin page route
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('bravo_admin_token')?.value;
    
    // In Edge runtime, we can't easily check against process.env.ADMIN_SECRET_KEY 
    // unless it's available, but Next.js edge env vars are usually available.
    if (!token || token !== process.env.ADMIN_SECRET_KEY) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/acceso', request.url));
    }
  }

  // 2. Check if the route is a protected API route
  if (pathname.startsWith('/api/')) {
    const isProtected = protectedApiRoutes.some((route) => {
      return pathname.startsWith(route.path) && route.methods.includes(method);
    });

    if (isProtected) {
      const token = request.cookies.get('bravo_admin_token')?.value;
      
      // Also allow a bearer token in the Authorization header for server-to-server calls
      const authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      if (token === process.env.ADMIN_SECRET_KEY || bearerToken === process.env.ADMIN_SECRET_KEY) {
        return NextResponse.next();
      }

      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
