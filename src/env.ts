import { z } from 'zod';

const envSchema = z.object({
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    NEXT_PUBLIC_API_URL: z.string().url('Invalid NEXT_PUBLIC_API_URL'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error(
        '❌ Invalid environment variables:',
        parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;
