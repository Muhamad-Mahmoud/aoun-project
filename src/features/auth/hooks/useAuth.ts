'use client';

/**
 * Auth Hook
 * Core authentication state management hook
 * Now optimized to use global AuthContext
 */

import { useAuthContext } from '@/shared/providers/AuthProvider';

export const useAuth = () => {
    return useAuthContext();
};
