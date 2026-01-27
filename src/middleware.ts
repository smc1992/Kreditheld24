import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes - they handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Admin Routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoggedIn && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isAdminLoginPage && isLoggedIn) {
    // Optional: Check role here if needed, but for now redirect to admin dashboard
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Portal Routes
  const isPortalRoute = pathname.startsWith('/portal');
  const isPortalPublicRoute = pathname === '/portal/login' || pathname === '/portal/register' || pathname === '/portal/reset-password';

  if (isPortalRoute && !isLoggedIn && !isPortalPublicRoute) {
    return NextResponse.redirect(new URL('/portal/login', req.url));
  }

  if ((pathname === '/portal/login' || pathname === '/portal/register') && isLoggedIn) {
    return NextResponse.redirect(new URL('/portal', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
