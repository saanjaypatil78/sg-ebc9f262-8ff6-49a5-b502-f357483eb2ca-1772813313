import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Define protected routes and their required roles
  const protectedRoutes = [
    { path: '/dashboard/admin', roles: ['admin', 'super_admin'] },
    { path: '/dashboard/vendor', roles: ['vendor'] },
    { path: '/dashboard/client', roles: ['client', 'investor', 'franchise_partner'] },
    { path: '/dashboard/bdm', roles: ['bdm'] },
  ];

  const path = request.nextUrl.pathname;

  // 1. Check if route is protected
  const protectedRoute = protectedRoutes.find(r => path.startsWith(r.path));

  if (protectedRoute) {
    // 2. Check authentication
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 3. Check Role Access
    const userRole = session.user.user_metadata.role || 'client';

    // Allow super_admin to access everything (optional, but good for debugging)
    if (userRole === 'super_admin') return response;

    if (!protectedRoute.roles.includes(userRole)) {
       // Redirect to unauthorized or back to their specific dashboard
       // Redirect to login with error for clarity
       return NextResponse.redirect(new URL('/auth/login?error=unauthorized', request.url));
    }
  }

  // 4. Redirect root to dashboard if logged in
  if (path === '/' && session) {
    const role = session.user.user_metadata.role || 'client';
    let target = '/dashboard/client';
    
    if (role === 'admin' || role === 'super_admin') target = '/dashboard/admin';
    else if (role === 'vendor') target = '/dashboard/vendor';
    else if (role === 'bdm') target = '/dashboard/bdm';
    else if (role === 'investor' || role === 'franchise_partner') target = '/dashboard/client'; // Reuse client dash for now

    return NextResponse.redirect(new URL(target, request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};