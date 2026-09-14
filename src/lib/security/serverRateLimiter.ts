interface Bucket {
    count: number;
    resetAt: number;
}

const store = new Map<string, Bucket>();

function cleanup(now: number) {
    if (store.size < 500) return;
    for (const [k, v] of store) {
        if (now > v.resetAt) store.delete(k);
    }
}

export interface ServerRateLimitOptions {
    /** Max requests per window. */
    limit: number;
    /** Window in ms. */
    windowMs: number;
}

export interface ServerRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAfterSec: number;
}

/**
 * Server-side token-bucket rate limiter (per-process memory).
 * This is the ENFORCING limiter — the client helper in rateLimiter.ts is UX-only
 * and must never be trusted for security.
 *
 * NOTE: on multi-instance deployments (Vercel/RunAsp scaled out) use a shared
 * store (Upstash Redis / .NET throttling). This in-memory bucket protects a
 * single Node instance and composes with backend throttling.
 */
export function checkServerRateLimit(key: string, opts: ServerRateLimitOptions): ServerRateLimitResult {
    const now = Date.now();
    cleanup(now);
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + opts.windowMs });
        return { allowed: true, remaining: Math.max(0, opts.limit - 1), resetAfterSec: Math.ceil(opts.windowMs / 1000) };
    }

    if (entry.count >= opts.limit) {
        return { allowed: false, remaining: 0, resetAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    store.set(key, entry);
    return { allowed: true, remaining: Math.max(0, opts.limit - entry.count), resetAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
}

/** Test-only: clear all buckets. */
export function __clearServerRateLimits() {
    store.clear();
}

/** Presets for sensitive routes. */
export const RATE_LIMIT_PRESETS = {
    /** Login / refresh / password recovery: 5 attempts / 15 min per IP (mirrors client UX helper). */
    auth: { limit: 5, windowMs: 15 * 60 * 1000 },
    /** General API proxy abuse guard: 120 req / min per IP. */
    proxy: { limit: 120, windowMs: 60 * 1000 },
} as const;
