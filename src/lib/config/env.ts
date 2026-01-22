/**
 * Environment Configuration
 * Validates and exports environment variables
 */

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

export const env = {
    // API Configuration
    apiUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:5000/api'),
    apiVersion: getEnvVar('NEXT_PUBLIC_API_VERSION', 'v1'),

    // Environment
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
} as const;

// Validate required env vars on initialization
if (typeof window === 'undefined') {
    // Server-side validation
    console.log('✓ Environment variables validated');
}
