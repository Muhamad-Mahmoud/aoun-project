import { z } from 'zod';

/**
 * Environment variable schema
 * JWT_SECRET has NO default — must be explicitly set in all environments.
 */
const envSchema = z.object({
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    NEXT_PUBLIC_API_URL: z.string().url('Invalid NEXT_PUBLIC_API_URL').default('http://localhost:3000'),
    NEXT_PUBLIC_AI_API_URL: z.string().url('Invalid NEXT_PUBLIC_AI_API_URL').default('http://127.0.0.1:8000'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL,
    NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    if (process.env.NODE_ENV === 'production') {
        // In production, FAIL the build — never silently use weak defaults
        console.error('❌ FATAL: Missing required production environment variables:', errors);
        throw new Error('Missing required production environment variables. Build aborted.');
    } else {
        // In development/test, warn but allow fallback for non-secret vars
        console.warn('⚠️ Missing environment variables:', errors);
    }
}

export const env = parsed.data ?? {
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL ?? 'http://127.0.0.1:8000',
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') ?? 'development',
};
