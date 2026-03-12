export const AUTH_COOKIE_KEYS = ['auth_token', 'refresh_token'] as const;

export type AuthCookieKey = typeof AUTH_COOKIE_KEYS[number];

export function assertAuthCookieKey(key: string): asserts key is AuthCookieKey {
    if (!AUTH_COOKIE_KEYS.includes(key as AuthCookieKey)) {
        throw new Error(`Invalid token key: "${key}". Allowed keys: ${AUTH_COOKIE_KEYS.join(', ')}`);
    }
}

export function getAuthCookieOptions() {
    const isSecure = process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_COOKIES !== 'true';

    return {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    };
}
