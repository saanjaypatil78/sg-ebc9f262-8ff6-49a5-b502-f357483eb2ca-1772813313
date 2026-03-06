import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Define protected routes and their required roles
  const protectedRoutes = [
    { path: '/dashboard/admin', roles: ['admin'] },
    { path: '/dashboard/vendor', roles: ['vendor'] },
    { path: '/dashboard/client', roles: ['client'] },
    { path: '/dashboard/bdm', roles: ['bdm'] },
  ];

  const path = req.nextUrl.pathname;

  // 1. Check if route is protected
  const protectedRoute = protectedRoutes.find(r => path.startsWith(r.path));

  if (protectedRoute) {
    // 2. Check authentication
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // 3. Check Role Access
    // We assume the role is stored in user_metadata for quick access in middleware
    // In a production app, you might query the profile table or use custom claims
    const userRole = session.user.user_metadata.role || 'client';

    if (!protectedRoute.roles.includes(userRole)) {
       // Redirect to unauthorized or back to their specific dashboard
       // For now, redirect to login to force correct account usage
       return NextResponse.redirect(new URL('/auth/login?error=unauthorized', req.url));
    }
  }

  // 4. Redirect root to dashboard if logged in
  if (path === '/' && session) {
    const role = session.user.user_metadata.role || 'client';
    return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/'
  ],
};