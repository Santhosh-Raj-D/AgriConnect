import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/buyer/dashboard',
  '/farmer/dashboard',
  '/admin/dashboard',
  '/store'
];

const AUTH_PATHS = ['/login', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('agri_session')?.value;

  // 1. Check if the user is attempting to access a protected route
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute && !sessionCookie) {
    // Redirect unauthenticated user to login page
    const loginUrl = new URL('/login', request.url);
    // Remember the page they wanted to visit
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Check if logged-in user is trying to access auth pages (login/signup)
  const isAuthRoute = AUTH_PATHS.some((path) => pathname === path);
  if (isAuthRoute && sessionCookie) {
    // Redirect already authenticated users to the storefront
    return NextResponse.redirect(new URL('/store', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, and various image assets (png, svg, jpg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)',
  ],
};
