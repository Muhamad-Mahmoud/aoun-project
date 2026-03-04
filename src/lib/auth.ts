import { jwtVerify } from 'jose';
import { env } from '@/env';
import { logger } from '@/lib/logger';

export async function verifyToken(token: string): Promise<boolean> {
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET);

        // Verify the token signature and expiration
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        logger.error('Token verification failed', error);
        return false;
    }
}
