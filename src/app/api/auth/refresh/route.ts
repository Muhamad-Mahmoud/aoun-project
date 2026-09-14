import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/config';
import { getAuthCookieOptions } from '@/lib/security/authCookies';
import { checkServerRateLimit, RATE_LIMIT_PRESETS } from '@/lib/security/serverRateLimiter';

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    return response;
}

export async function POST(request: NextRequest) {
    // ENFORCING server-side rate limit (client helper is UX-only, never trusted).
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const rl = checkServerRateLimit(`auth:refresh:${ip}`, RATE_LIMIT_PRESETS.auth);
    if (!rl.allowed) {
        return NextResponse.json(
            { message: 'Too many attempts, please try again later.' },
            { status: 429, headers: { 'Retry-After': String(rl.resetAfterSec) } },
        );
    }

    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value ?? '';
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) {
            return clearAuthCookies(
                NextResponse.json(
                    { message: 'Missing refresh token' },
                    { status: 401 }
                )
            );
        }

        const backendResponse = await fetch(`${process.env.API_URL}${API_ENDPOINTS.auth.refresh}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                token: authToken,
                refreshToken,
            }),
            cache: 'no-store',
        });

        const payload = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            const response = NextResponse.json(
                payload ?? { message: 'Failed to refresh session' },
                { status: backendResponse.status }
            );

            if (backendResponse.status === 401) {
                return clearAuthCookies(response);
            }

            return response;
        }

        const responseData = payload?.data ?? payload;
        const nextToken = responseData?.token;
        const nextRefreshToken = responseData?.refreshToken;

        if (!nextToken || typeof nextToken !== 'string') {
            return NextResponse.json(
                { message: 'Refresh endpoint returned an invalid token payload' },
                { status: 502 }
            );
        }

        const response = NextResponse.json(
            { token: nextToken, refreshToken: nextRefreshToken ?? null },
            { status: 200 }
        );

        response.cookies.set('auth_token', nextToken, getAuthCookieOptions());

        if (typeof nextRefreshToken === 'string' && nextRefreshToken.length > 0) {
            response.cookies.set('refresh_token', nextRefreshToken, getAuthCookieOptions());
        }

        return response;
    } catch {
        return NextResponse.json(
            { message: 'Failed to refresh session' },
            { status: 502 }
        );
    }
}
