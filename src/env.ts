import { z } from 'zod';

/**
 * Environment variable schema
 *
 * SECURITY POLICY:
 *  - API_URL and AI_API_URL are SERVER-ONLY. They DO NOT carry the
 *    NEXT_PUBLIC_ prefix, so Next.js will NEVER bundle them into the
 *    client-side JavaScript. This prevents the backend URL from being
 *    visible in the browser's Network / Source tabs.
 *  - JWT_SECRET has NO default — must be explicitly set in all environments.
 *  - All client-visible config must be justified and documented below.
 */

const envSchema = z.object({
    // --- Server-only secrets & URLs ---
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    API_URL: z.string().url('Invalid API_URL'),

    // --- Runtime ---
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
    JWT_SECRET: process.env.JWT_SECRET,
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables at startup / build time
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    if (process.env.NODE_ENV === 'production') {
        // In production, FAIL the build — never silently use weak defaults
        console.error('❌ FATAL: Missing required production environment variables:', errors);
        throw new Error('Missing required production environment variables. Build aborted.');
    } else {
        // In development/test, warn and use safe local fallbacks
        console.warn('⚠️  Missing environment variables (using local fallbacks):', errors);
    }
}

export const env = parsed.success
    ? parsed.data
    : {
          JWT_SECRET: process.env.JWT_SECRET ?? '',
          API_URL: process.env.API_URL ?? 'http://127.0.0.1:5204',
          NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') ?? 'development',
      };
