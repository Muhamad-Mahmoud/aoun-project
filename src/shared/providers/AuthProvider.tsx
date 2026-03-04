/**
 * Auth Context Provider
 * Manages global authentication state
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout as logoutApi } from '@/features/auth/api/authApi';
import type { AuthUser } from '@/features/auth/types';
import { logger } from '@/lib/logger';
import { ROUTES } from '@/shared/constants/routes';
import { setSecureToken, getSecureToken, removeSecureToken } from '@/lib/security/tokenStorage';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    updateUser: (user: AuthUser | null) => void;
    login: (token: string, refreshToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Add explicit state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setIsLoading(true);
                const currentUser = await getCurrentUser();

                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                logger.error('Failed to initialize auth', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const logout = useCallback(async () => {
        try {
            // Attempt to notify backend, but don't block cleanup if it fails
            await logoutApi().catch(err => logger.warn('Logout API failed', err));
        } catch (error) {
            // Ignore errors here
        } finally {
            // ALWAYS cleanup client state
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);

            // Clear storage using secure async functions (HttpOnly cookies removed via Server Actions)
            await removeSecureToken('auth_token');
            await removeSecureToken('refresh_token');

            router.push(ROUTES.AUTH.LOGIN);
        }
    }, [router]);

    const login = useCallback(async (token: string, refreshToken?: string) => {
        try {
            // 1. Store tokens using encrypted storage
            await setSecureToken('auth_token', token);
            if (refreshToken) {
                await setSecureToken('refresh_token', refreshToken);
            }
            setToken(token);
            setIsAuthenticated(true);

            // 2. Fetch full user profile
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If fetching user fails, we might be in weird state. 
                // But generally better to have auth state true and try.
                logger.warn('Login successful but failed to fetch user details');
            }
        } catch (e) {
            logger.error("Login Error inside provider", e);
        }
    }, []);

    const updateUser = useCallback((newUser: AuthUser | null) => {
        setUser(newUser);
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated,
        isLoading,
        logout,
        updateUser,
        login,
    }), [user, token, isAuthenticated, isLoading, logout, updateUser, login]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
