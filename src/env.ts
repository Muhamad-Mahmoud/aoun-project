import { z } from 'zod';

/**
 * Environment variable schema — PRODUCTION HARDENED
 *
 * SECURITY POLICY (NON-NEGOTIABLE):
 *  - API_URL, AI_API_URL, AI_API_KEY, JWT_SECRET are SERVER-ONLY.
 *    They DO NOT carry the NEXT_PUBLIC_ prefix, so Next.js will NEVER
 *    bundle them into client-side JavaScript. The browser only ever talks
 *    to `/api/proxy` (BFF pattern); the real backend URL is invisible in
 *    Network/Source tabs.
 *  - JWT_SECRET has NO default — must be explicitly set in all environments.
 *  - `NEXT_PUBLIC_` is ONLY allowed for explicitly public, non-secret values
 *    (SITE_URL). If you add a NEXT_PUBLIC_ variable, you MUST document why
 *    it is safe to expose.
 *  - Build FAILS in production if required secrets are missing — never
 *    silently fall back to weak defaults.
 */

// Helper: non-empty URL with strict validation
const urlSchema = z.string().url();

const envSchema = z.object({
    // --- Server-only secrets & URLs (NEVER exposed to client) ---
    JWT_SECRET: z
        .string()
        .min(32, 'JWT_SECRET must be at least 32 characters — generate with: openssl rand -base64 32'),
    API_URL: urlSchema.describe('Base URL of the .NET REST API (server-only)'),
    AI_API_URL: urlSchema
        .optional()
        .describe('Base URL of the AI/Python backend (server-only)'),
    AI_API_KEY: z
        .string()
        .min(1, 'AI_API_KEY must be non-empty if set')
        .optional()
        .describe('Optional API key for AI backend (server-only)'),

    // --- App URL (used for metadata, sitemap, robots) ---
    // Prefer server-only APP_URL / SITE_URL, fall back to NEXT_PUBLIC_SITE_URL only for legacy.
    APP_URL: urlSchema.optional(),
    SITE_URL: urlSchema.optional(),
    NEXT_PUBLIC_SITE_URL: urlSchema.optional(),

    // --- Runtime ---
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    ALLOW_INSECURE_COOKIES: z
        .enum(['true', 'false'])
        .optional()
        .describe('Set to "true" only for local HTTP dev (never in production)'),
});

// Resolve app URL with priority: APP_URL > SITE_URL > NEXT_PUBLIC_SITE_URL > default
function resolveAppUrl(): string | undefined {
    return (
        process.env.APP_URL ||
        process.env.SITE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        undefined
    );
}

const processEnv = {
    JWT_SECRET: process.env.JWT_SECRET,
    API_URL: process.env.API_URL,
    AI_API_URL: process.env.AI_API_URL,
    AI_API_KEY: process.env.AI_API_KEY,
    APP_URL: process.env.APP_URL,
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    ALLOW_INSECURE_COOKIES: process.env.ALLOW_INSECURE_COOKIES,
};

// SECURITY: Detect accidental NEXT_PUBLIC leak of secrets
const leakedVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_AI_API_URL', 'NEXT_PUBLIC_JWT_SECRET', 'NEXT_PUBLIC_AI_API_KEY']
    .filter((k) => process.env[k] !== undefined);

if (leakedVars.length > 0) {
    console.error(
        `❌ SECURITY VIOLATION: Found secret leaked via NEXT_PUBLIC prefix: ${leakedVars.join(', ')}. ` +
            `These MUST be server-only (without NEXT_PUBLIC_). ` +
            `Browser must use /api/proxy — see src/lib/api/config.ts`,
    );
    if (process.env.NODE_ENV === 'production') {
        throw new Error(`NEXT_PUBLIC secret leak detected: ${leakedVars.join(', ')} — build aborted.`);
    }
}

// Validate environment variables at startup / build time
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    if (process.env.NODE_ENV === 'production') {
        // In production, FAIL the build — never silently use weak defaults
        console.error('❌ FATAL: Missing/invalid required production environment variables:', errors);
        console.error(
            'Hint: Copy .env.example -> .env.local and fill real values. ' +
                'Never commit .env.local — it is gitignored.',
        );
        throw new Error('Missing required production environment variables. Build aborted.');
    } else {
        // In development/test, warn and use safe local fallbacks
        console.warn('⚠️  Missing/invalid environment variables (using local fallbacks):', errors);
    }
}

// Resolved, validated env with safe fallbacks only in non-production
const fallbackAppUrl = 'http://127.0.0.1:3000';
const fallbackApiUrl = 'http://127.0.0.1:5204';
const fallbackAiUrl = 'http://127.0.0.1:8000';

export const env = parsed.success
    ? {
          JWT_SECRET: parsed.data.JWT_SECRET,
          API_URL: parsed.data.API_URL,
          AI_API_URL: parsed.data.AI_API_URL ?? fallbackAiUrl,
          AI_API_KEY: parsed.data.AI_API_KEY ?? '',
          // Normalized APP_URL — always prefer server-only
          APP_URL:
              parsed.data.APP_URL ||
              parsed.data.SITE_URL ||
              parsed.data.NEXT_PUBLIC_SITE_URL ||
              (process.env.NODE_ENV === 'production' ? 'https://aounn.runasp.net' : fallbackAppUrl),
          SITE_URL:
              parsed.data.SITE_URL ||
              parsed.data.APP_URL ||
              parsed.data.NEXT_PUBLIC_SITE_URL ||
              (process.env.NODE_ENV === 'production' ? 'https://aounn.runasp.net' : fallbackAppUrl),
          // Public mirror (only if explicitly set) — use sparingly
          NEXT_PUBLIC_SITE_URL: parsed.data.NEXT_PUBLIC_SITE_URL,
          NODE_ENV: parsed.data.NODE_ENV,
          ALLOW_INSECURE_COOKIES: parsed.data.ALLOW_INSECURE_COOKIES,
      }
    : {
          JWT_SECRET: process.env.JWT_SECRET ?? '',
          API_URL: process.env.API_URL ?? fallbackApiUrl,
          AI_API_URL: process.env.AI_API_URL ?? fallbackAiUrl,
          AI_API_KEY: process.env.AI_API_KEY ?? '',
          APP_URL: resolveAppUrl() ?? (process.env.NODE_ENV === 'production' ? 'https://aounn.runasp.net' : fallbackAppUrl),
          SITE_URL: resolveAppUrl() ?? (process.env.NODE_ENV === 'production' ? 'https://aounn.runasp.net' : fallbackAppUrl),
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
          NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') ?? 'development',
          ALLOW_INSECURE_COOKIES: process.env.ALLOW_INSECURE_COOKIES as 'true' | 'false' | undefined,
      };

// Convenience: resolved canonical site URL (always absolute)
export const SITE_URL = env.APP_URL || env.SITE_URL;
export const API_URL = env.API_URL;
export const AI_API_URL = env.AI_API_URL;
