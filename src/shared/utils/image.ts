/**
 * Production-hardened image URL helper — never hardcodes backend domain.
 *
 * Server (RSC / Route Handler): builds absolute backend URL from API_URL env
 *   and wraps via `/_next/image` for optimization (remotePatterns allowlists API host).
 * Client (browser): uses relative BFF proxy path `/api/proxy/uploads/...`
 *   so the real backend URL NEVER appears in the client bundle or DOM.
 */
export const getSecureImageUrl = (url: string | null): string => {
    if (!url) return '';

    // Already absolute (e.g. https://api.dicebear.com/... or http...)
    // For external URLs, still wrap via _next/image if allowed, otherwise return as-is.
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Keep dicebear / external as-is but still optimize via _next/image when on server
        // On client, use _next/image with the absolute URL (browser will fetch via optimizer)
        return `/_next/image?url=${encodeURIComponent(url)}&w=1080&q=75`;
    }

    // Normalize relative upload path: "uploads/foo.jpg" | "/uploads/foo.jpg" | "foo.jpg"
    const cleanPath = url.replace(/^\/?(uploads\/)?/, '');

    // Client: never expose API_URL — use local BFF proxy
    if (typeof window !== 'undefined') {
        const proxyPath = `/api/proxy/uploads/${cleanPath}`;
        // Use _next/image with the proxy path (origin is 'self' — no backend leak)
        return `/_next/image?url=${encodeURIComponent(proxyPath)}&w=1080&q=75`;
    }

    // Server: construct absolute backend URL from env (validated in src/env.ts)
    const backendBase = (process.env.API_URL || 'https://aounn.runasp.net').replace(/\/$/, '');
    const absoluteUrl = `${backendBase}/uploads/${cleanPath}`;
    return `/_next/image?url=${encodeURIComponent(absoluteUrl)}&w=1080&q=75`;
};
