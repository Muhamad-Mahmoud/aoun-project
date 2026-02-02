/**
 * Client-Side Rate Limiter
 * Lightweight in-memory throttling for sensitive operations
 * Prevents basic brute-force attacks without server load
 */

interface RateLimitEntry {
    attempts: number;
    resetAt: number;
}

// In-memory storage (cleared on page refresh - intentional)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Configuration for rate limiting
 */
const RATE_LIMIT_CONFIG = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
};

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (e.g., email, IP)
 * @param maxAttempts - Override default max attempts
 * @returns true if allowed, false if blocked
 */
export function checkRateLimit(
    identifier: string,
    maxAttempts: number = RATE_LIMIT_CONFIG.maxAttempts
): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No previous attempts or window expired
    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(identifier, {
            attempts: 1,
            resetAt: now + RATE_LIMIT_CONFIG.windowMs,
        });
        return true;
    }

    // Within window, check attempts
    if (entry.attempts >= maxAttempts) {
        return false; // Blocked
    }

    // Increment attempts
    entry.attempts++;
    rateLimitStore.set(identifier, entry);
    return true;
}

/**
 * Get remaining attempts for an identifier
 */
export function getRemainingAttempts(identifier: string): number {
    const entry = rateLimitStore.get(identifier);
    if (!entry || Date.now() > entry.resetAt) {
        return RATE_LIMIT_CONFIG.maxAttempts;
    }
    return Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - entry.attempts);
}

/**
 * Get time until reset (in seconds)
 */
export function getResetTime(identifier: string): number {
    const entry = rateLimitStore.get(identifier);
    if (!entry || Date.now() > entry.resetAt) {
        return 0;
    }
    return Math.ceil((entry.resetAt - Date.now()) / 1000);
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export function resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Clear all rate limit data (cleanup)
 */
export function clearAllRateLimits(): void {
    rateLimitStore.clear();
}
