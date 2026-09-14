import { env } from '@/env';
import { logger } from '@/lib/logger';
import { verifySessionEdge, type UserRole } from '@/lib/security/edgeAuth';

export async function verifyToken(token: string): Promise<boolean> {
    if (!token) return false;

    try {
        const session = await verifySessionEdge(token, env.JWT_SECRET);
        return session.valid;
    } catch (error) {
        logger.error('Token verification failed', error);
        return false;
    }
}

/** Verify + return normalized role (single call for server components/route handlers). */
export async function verifySession(token: string): Promise<{ valid: boolean; role: UserRole }> {
    if (!token) return { valid: false, role: 'unknown' };
    try {
        const session = await verifySessionEdge(token, env.JWT_SECRET);
        return { valid: session.valid, role: session.role };
    } catch (error) {
        logger.error('Session verification failed', error);
        return { valid: false, role: 'unknown' };
    }
}
