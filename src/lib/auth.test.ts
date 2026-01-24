import { verifyToken } from './auth';
import { env } from '@/env';
// Mock jose
jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

import { jwtVerify } from 'jose';

// Mock dependencies
jest.mock('@/env', () => ({
    env: {
        JWT_SECRET: 'test-secret-must-be-at-least-32-chars-long'
    }
}));

describe('verifyToken', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when jwtVerify succeeds', async () => {
        (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: 'user123' } });

        const result = await verifyToken('valid-token');
        expect(result).toBe(true);
        expect(jwtVerify).toHaveBeenCalled();
    });

    it('should return false when jwtVerify throws', async () => {
        (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        const result = await verifyToken('invalid-token');
        expect(result).toBe(false);
    });

    it('should return false for empty token', async () => {
        const result = await verifyToken('');
        expect(result).toBe(false);
        expect(jwtVerify).not.toHaveBeenCalled();
    });
});
