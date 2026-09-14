/**
 * Dynamic Content-Security-Policy builder with per-request nonce.
 *
 * Transitional mode: allows BOTH 'nonce-<n>' and 'unsafe-inline' for
 * script/style so existing inline styles keep working while new code
 * migrates to nonces. Once all inline usage is removed, drop the
 * 'unsafe-inline' fallbacks to get full XSS hardening.
 *
 * The proxy (src/proxy.ts) generates the nonce per request, forwards it as
 * `x-nonce` to Server Components, and sets this CSP header on the response.
 * Duplicate static CSP in next.config would AND-combine with this one
 * (breaking pages), so next.config must NOT emit its own CSP.
 */

export function buildCsp(nonce: string, isProd: boolean): string {
    const connectSrc = isProd ? "connect-src 'self'" : 'connect-src \'self\' http://127.0.0.1:* http://localhost:*';
    const imgSrc = "img-src 'self' data: blob: https://api.dicebear.com";

    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
        `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
        imgSrc,
        "font-src 'self' data:",
        "frame-ancestors 'none'",
        'object-src \'none\'',
        'base-uri \'self\'',
        'form-action \'self\'',
        connectSrc,
        ...(isProd ? ['upgrade-insecure-requests'] : []),
    ].join('; ');
}

export const NONCE_HEADER = 'x-nonce';
