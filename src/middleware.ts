import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, PUBLIC_ROUTES } from '@/shared/constants/routes';
import { env } from '@/env';

/**
 * Middleware for route protection and authentication
 */
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    const pathname = request.nextUrl.pathname;

    // 1. API Proxy Logic (Improved with direct fetch for better external proxying)
    if (pathname.startsWith('/api/proxy')) {
        const targetPath = pathname.replace('/api/proxy', '');
        const baseUrl = env.NEXT_PUBLIC_API_URL || 'https://aoun-api.runasp.net';
        const targetUrl = `${baseUrl}${targetPath}${request.nextUrl.search}`;
        
        console.log(`[Proxy Log] ${request.method} ${pathname} -> ${targetUrl}`);

        const requestHeaders = new Headers(request.headers);
        ['host', 'cookie', 'origin', 'referer', 'connection', 'content-length'].forEach((header) => {
            requestHeaders.delete(header);
        });

        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token.value}`);
        }

        try {
            const fetchOptions: RequestInit = {
                method: request.method,
                headers: requestHeaders,
                cache: 'no-store',
            };

            if (!['GET', 'HEAD'].includes(request.method)) {
                // For POST/PUT requests, we need to pass the body
                fetchOptions.body = request.body;
                // @ts-ignore
                fetchOptions.duplex = 'half';
            }

            const response = await fetch(targetUrl, fetchOptions);
            
            // For streaming response back
            const responseHeaders = new Headers(response.headers);
            
            // Don't forward sensitive backend headers
            responseHeaders.delete('set-cookie');
            responseHeaders.delete('content-encoding'); // Let Next.js handle compression

            return new NextResponse(response.body, {
                status: response.status,
                headers: responseHeaders,
            });
        } catch (error) {
            console.error('[Proxy Error]', error);
            return NextResponse.json(
                { message: 'فشل الاتصال بالخادم (Proxy Error)', error: String(error) },
                { status: 502 }
            );
        }
    }

    // CSRF Protection: Verify Origin for state-changing requests (Page routes)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        const host = request.headers.get('host');

        const isInternalRequest = (origin && origin.includes(host || '')) ||
            (referer && referer.includes(host || ''));

        if (!isInternalRequest && process.env.NODE_ENV === 'production') {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid origin' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // 2. Route Protection Logic
    const isAuthPage = pathname.startsWith(ROUTES.AUTH.LOGIN) ||
        pathname.startsWith(ROUTES.AUTH.REGISTER) ||
        pathname.startsWith(ROUTES.AUTH.FORGOT_PASSWORD) ||
        pathname.startsWith(ROUTES.AUTH.RESET_PASSWORD) ||
        pathname.startsWith(ROUTES.AUTH.VERIFY_CODE);

    const isPublicPage = PUBLIC_ROUTES.some(route => pathname === route);
    const isProtectedPage = !isPublicPage && !pathname.startsWith('/api') && !pathname.startsWith('/_next');

    const isAuthenticated = !!token;

    if (isProtectedPage && !isAuthenticated) {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD.HOME, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};
