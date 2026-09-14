import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, PUBLIC_ROUTES } from '@/shared/constants/routes';
import { verifySessionEdge, isSameOriginRequest, getRoleHome, isRoleAllowed } from '@/lib/security/edgeAuth';
import { buildCsp, NONCE_HEADER } from '@/lib/security/csp';
import { checkServerRateLimit, RATE_LIMIT_PRESETS } from '@/lib/security/serverRateLimiter';

function clientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

function withSecurityHeaders(response: NextResponse, nonce: string): NextResponse {
    const isProd = process.env.NODE_ENV === 'production';
    response.headers.set('Content-Security-Policy', buildCsp(nonce, isProd));
    response.headers.set(NONCE_HEADER, nonce);
    return response;
}

function rateLimitedResponse(result: { resetAfterSec: number }): NextResponse {
    return NextResponse.json({ success: false, message: 'Too many requests, please try again later.' }, {
        status: 429,
        headers: {
            'Retry-After': String(result.resetAfterSec),
            'X-RateLimit-Remaining': '0',
        },
    });
}

/**
 * Proxy: edge auth gate + BFF forwarder + dynamic nonce CSP.
 *
 * 1. Generates a per-request CSP nonce (forwarded as `x-nonce`).
 * 2. Applies server-side rate limits to auth endpoints + a general proxy guard.
 * 3. Forwards /api/proxy/* to the .NET API with cookie→Bearer injection.
 * 4. Enforces strict same-origin CSRF checks on mutations (prod).
 * 5. Verifies JWT signature (jose) and enforces role-scoped dashboards.
 */
export async function proxy(request: NextRequest) {
    const nonce = crypto.randomUUID().replace(/-/g, '');
    const token = request.cookies.get('auth_token')?.value;
    const pathname = request.nextUrl.pathname;

    // 1. API Proxy branch — rate-limit sensitive Auth mutations first
    if (pathname.startsWith('/api/proxy')) {
        const targetPath = pathname.replace('/api/proxy', '');
        const isAuthMutation = /\/api\/Auth\/(login|register|forgot-password|verify-reset-code|reset-password|refresh-token)/i.test(
            targetPath,
        );
        const preset = isAuthMutation ? RATE_LIMIT_PRESETS.auth : RATE_LIMIT_PRESETS.proxy;
        const rl = checkServerRateLimit(`proxy:${clientIp(request)}:${isAuthMutation ? 'auth' : 'general'}`, preset);
        if (!rl.allowed) return rateLimitedResponse(rl);

        // All requests go to ASP.NET — YARP routes /api/ai/** to FastAPI internally
        const baseUrl = process.env.API_URL || 'http://127.0.0.1:5204';
        let targetUrl = `${baseUrl}${targetPath}${request.nextUrl.search}`;
        // Fix for Node.js 18+ preferring IPv6 (::1) which breaks local ASP.NET connections
        targetUrl = targetUrl.replace('localhost', '127.0.0.1');

        // Only log proxy target in development — never leak backend URLs in production
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Proxy] ${request.method} ${pathname} -> ${targetUrl}`);
        }

        const requestHeaders = new Headers(request.headers);
        ['host', 'cookie', 'origin', 'referer', 'connection', 'content-length'].forEach((header) => {
            requestHeaders.delete(header);
        });

        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }

        try {
            const fetchOptions: RequestInit = {
                method: request.method,
                headers: requestHeaders,
                cache: 'no-store',
            };

            if (!['GET', 'HEAD'].includes(request.method)) {
                // Read body as ArrayBuffer to prevent empty POST requests (like SignalR negotiate) from hanging
                const bodyBuffer = await request.arrayBuffer();
                if (bodyBuffer.byteLength > 0) {
                    fetchOptions.body = bodyBuffer;
                }
            }

            const response = await fetch(targetUrl, fetchOptions);

            // For streaming response back
            const responseHeaders = new Headers(response.headers);

            // Don't forward sensitive backend headers
            responseHeaders.delete('set-cookie');
            responseHeaders.delete('content-encoding'); // Let Next.js handle compression

            const proxied = new NextResponse(response.body, {
                status: response.status,
                headers: responseHeaders,
            });
            return withSecurityHeaders(proxied, nonce);
        } catch (error) {
            console.error('[Proxy Error]', error);
            return withSecurityHeaders(
                NextResponse.json(
                    { message: 'فشل الاتصال بالخادم (Proxy Error)', error: String(error) },
                    { status: 502 },
                ),
                nonce,
            );
        }
    }

    // CSRF Protection: strict same-origin check for state-changing requests (prod).
    // Exact host comparison — substring matching is bypassable (victim.com.evil.com).
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const ok = isSameOriginRequest(
            request.headers.get('origin'),
            request.headers.get('referer'),
            request.headers.get('host'),
        );
        if (!ok && process.env.NODE_ENV === 'production') {
            return withSecurityHeaders(
                new NextResponse(JSON.stringify({ success: false, message: 'Invalid origin' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }),
                nonce,
            );
        }
    }

    // 2. Route Protection Logic — verify signature, then enforce roles
    const isAuthPage =
        pathname.startsWith(ROUTES.AUTH.LOGIN) ||
        pathname.startsWith(ROUTES.AUTH.REGISTER) ||
        pathname.startsWith(ROUTES.AUTH.FORGOT_PASSWORD) ||
        pathname.startsWith(ROUTES.AUTH.RESET_PASSWORD) ||
        pathname.startsWith(ROUTES.AUTH.VERIFY_CODE);

    const isPublicPage = PUBLIC_ROUTES.some((route) => pathname === route);
    const isProtectedPage = !isPublicPage && !pathname.startsWith('/api') && !pathname.startsWith('/_next');

    const session = await verifySessionEdge(token, process.env.JWT_SECRET);
    const isAuthenticated = session.valid;

    const loginRedirect = (clearCookie: boolean) => {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const res = NextResponse.redirect(loginUrl);
        if (clearCookie && token) {
            res.cookies.delete('auth_token');
            res.cookies.delete('refresh_token');
        }
        return withSecurityHeaders(res, nonce);
    };

    const nextWithNonce = () => {
        const reqHeaders = new Headers(request.headers);
        reqHeaders.set(NONCE_HEADER, nonce);
        const res = NextResponse.next({ request: { headers: reqHeaders } });
        return withSecurityHeaders(res, nonce);
    };

    if (isProtectedPage && !isAuthenticated) {
        // Expired/forged token → bounce to login and drop bad cookies (fail closed).
        return loginRedirect(!!token);
    }

    if (isAuthPage && isAuthenticated) {
        return withSecurityHeaders(NextResponse.redirect(new URL(getRoleHome(session.role), request.url)), nonce);
    }

    // Role-scoped dashboards: non-admin roles stay inside their own prefix.
    if (isAuthenticated && pathname.startsWith('/dashboard') && !isRoleAllowed(pathname, session.role)) {
        return withSecurityHeaders(NextResponse.redirect(new URL(getRoleHome(session.role), request.url)), nonce);
    }

    return nextWithNonce();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};
