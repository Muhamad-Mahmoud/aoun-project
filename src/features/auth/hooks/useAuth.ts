'use client';

/**
 * Auth Hook
 * Core authentication state management hook
 * Now optimized to use global AuthContext
 */

import { useAuthContext } from '@/shared/providers/AuthProvider';
import { registerDonor as apiRegisterDonor } from '../api/authApi';

export const useAuth = () => {
    const context = useAuthContext();
    return {
        ...context,
        registerDonor: apiRegisterDonor,
    };
};
