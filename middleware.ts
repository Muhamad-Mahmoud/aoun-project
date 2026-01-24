import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ROUTES, PROTECTED_ROUTES } from '@/shared/constants/routes';
import { env } from '@/env';

/**
 * Middleware for route protection and authentication
 */
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    const pathname = request.nextUrl.pathname;

    // CSRF Protection: Verify Origin for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        const host = request.headers.get('host');

        // Allow if origin matches host, or referer starts with app URL
        // In production, this should be stricter. 
        const isInternalRequest = (origin && origin.includes(host || '')) ||
            (referer && referer.includes(host || ''));

        if (!isInternalRequest && process.env.NODE_ENV === 'production') {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid origin' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // 1. API Proxy Logic
    if (pathname.startsWith('/api/proxy')) {
        // Strip the /api/proxy prefix
        const targetPath = pathname.replace('/api/proxy', '');
        const targetUrl = `${env.NEXT_PUBLIC_API_URL}${targetPath}${request.nextUrl.search}`;

        const requestHeaders = new Headers(request.headers);

        // Add Authorization header if token exists
        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token.value}`);
        }

        // Forward the request to the backend
        return NextResponse.rewrite(new URL(targetUrl), {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // 2. Route Protection Logic

    // Define route types
    const isAuthPage = pathname.startsWith(ROUTES.AUTH.LOGIN) ||
        pathname.startsWith(ROUTES.AUTH.REGISTER) ||
        pathname.startsWith(ROUTES.AUTH.FORGOT_PASSWORD);

    const isProtectedPage = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // Verify token
    let isValidToken = false;
    if (token) {
        isValidToken = await verifyToken(token.value);
    }

    // Redirect to login if accessing protected page without valid token
    if (isProtectedPage && !isValidToken) {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth pages with token
    if (isAuthPage && isValidToken) {
        return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }

    return NextResponse.next();
}

/**
 * Middleware configuration
 * Original matcher excluded all api routes. We now include /api/proxy but exclude other api routes to avoid loops or unnecessary processing?
 * Actually, we need to match /api/proxy explicitly.
 * Matcher: Include /api/proxy, and the usual pages. Exclude /api/auth (handled by Next.js app router directly without middleware interference, assuming no protection needed there).
 */
export const config = {
    matcher: [
        // Match all request paths except for the ones starting with:
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico (favicon file)
        // - public files (files with extensions)
        // But we DO want to match /api/proxy, so we can't exclude all /api.
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};
