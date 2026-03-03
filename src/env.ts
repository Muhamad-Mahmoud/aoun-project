import { z } from 'zod';

const envSchema = z.object({
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').default('default_build_secret'),
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

// Validate environment variables - only throw error if strictly necessary
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    if (process.env.NODE_ENV === 'production') {
        console.warn(
            '⚠️ Missing production environment variables. Using defaults for build stage.',
            parsed.error.flatten().fieldErrors
        );
    } else {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors
        );
        throw new Error('Invalid environment variables');
    }
}

export const env = parsed.data || {
    JWT_SECRET: process.env.JWT_SECRET || 'default_build_secret',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8000',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
