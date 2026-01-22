'use client';

/**
 * Auth Hook
 * Core authentication state management hook
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isAuthenticated, logout as logoutApi } from '../api/authApi';
import { logger } from '@/lib/logger';
import type { AuthState, AuthUser } from '../types';

export const useAuth = () => {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = () => {
            const token = getToken();
            const authenticated = isAuthenticated();

            setAuthState({
                user: null, // TODO: Decode user from token or fetch from API
                token,
                isAuthenticated: authenticated,
                isLoading: false,
            });
        };

        initAuth();
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            router.push('/login');
        } catch (error) {
            logger.error('Logout failed', error);
        }
    }, [router]);

    const updateUser = useCallback((user: AuthUser | null) => {
        setAuthState(prev => ({
            ...prev,
            user,
        }));
    }, []);

    return {
        ...authState,
        logout,
        updateUser,
    };
};
