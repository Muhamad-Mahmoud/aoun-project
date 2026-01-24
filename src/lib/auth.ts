import { jwtVerify } from 'jose';
import { env } from '@/env';

export async function verifyToken(token: string): Promise<boolean> {
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET);

        // Verify the token signature and expiration
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}
