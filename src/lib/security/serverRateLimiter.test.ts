import { checkServerRateLimit, __clearServerRateLimits } from './serverRateLimiter';

describe('checkServerRateLimit', () => {
    beforeEach(() => __clearServerRateLimits());

    it('allows up to the limit then blocks', () => {
        const opts = { limit: 3, windowMs: 60_000 };
        expect(checkServerRateLimit('k', opts).allowed).toBe(true);
        expect(checkServerRateLimit('k', opts).allowed).toBe(true);
        const third = checkServerRateLimit('k', opts);
        expect(third.allowed).toBe(true);
        expect(third.remaining).toBe(0);
        const fourth = checkServerRateLimit('k', opts);
        expect(fourth.allowed).toBe(false);
        expect(fourth.resetAfterSec).toBeGreaterThan(0);
    });

    it('isolates buckets per key', () => {
        const opts = { limit: 1, windowMs: 60_000 };
        expect(checkServerRateLimit('a', opts).allowed).toBe(true);
        expect(checkServerRateLimit('a', opts).allowed).toBe(false);
        expect(checkServerRateLimit('b', opts).allowed).toBe(true);
    });
});
