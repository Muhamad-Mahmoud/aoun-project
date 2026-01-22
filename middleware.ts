import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and authentication
 */
export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    const pathname = request.nextUrl.pathname;

    // Define route types
    const isAuthPage = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password');
    const isProtectedPage = pathname.startsWith('/profile');

    // Redirect to login if accessing protected page without token
    if (isProtectedPage && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth pages with token
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

/**
 * Middleware configuration
 * Match all routes except:
 * - API routes (/api)
 * - Static files (_next/static)
 * - Images (_next/image)
 * - Favicon
 */
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};
