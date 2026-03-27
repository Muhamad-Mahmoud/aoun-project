import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/lib/api/config';
import { getAuthCookieOptions } from '@/lib/security/authCookies';

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    return response;
}

export async function POST() {
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
