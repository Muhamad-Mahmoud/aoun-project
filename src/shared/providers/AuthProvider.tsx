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
import { setSecureToken, removeSecureToken } from '@/lib/security/tokenStorage';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    updateUser: (user: AuthUser | null) => void;
    login: (token: string, refreshToken?: string, user?: AuthUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    initialIsAuthenticated?: boolean;
    initialUser?: AuthUser | null;
}

export function AuthProvider({ children, initialIsAuthenticated = false, initialUser = null }: AuthProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(initialUser);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
    const [isLoading, setIsLoading] = useState(initialIsAuthenticated && initialUser === null);

    const clearAuthState = useCallback(async () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        await removeSecureToken('auth_token');
        await removeSecureToken('refresh_token');
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            if (!initialIsAuthenticated) {
                setIsLoading(false);
                return;
            }

            if (initialIsAuthenticated && initialUser) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const currentUser = await getCurrentUser();

                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } else {
                    logger.warn('getCurrentUser returned null - clearing auth state');
                    await clearAuthState();
                }
            } catch (error) {
                logger.error('Failed to initialize auth', error);
                setUser(null);
                setToken(null);
                setIsAuthenticated(initialIsAuthenticated);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [clearAuthState, initialIsAuthenticated, initialUser]);

    const logout = useCallback(async () => {
        try {
            await logoutApi().catch(err => logger.warn('Logout API failed', err));
        } finally {
            await clearAuthState();
            router.push(ROUTES.AUTH.LOGIN);
        }
    }, [clearAuthState, router]);

    const login = useCallback(async (token: string, refreshToken?: string, loginUser?: AuthUser) => {
        try {
            await setSecureToken('auth_token', token);
            if (refreshToken) {
                await setSecureToken('refresh_token', refreshToken);
            }

            setToken(token);
            setIsAuthenticated(true);

            if (loginUser) {
                setUser(loginUser);
                return;
            }

            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                return;
            }

            throw new Error('Login completed without a usable user profile');
        } catch (e) {
            await clearAuthState();
            logger.error("Login Error inside provider", e);
            throw e;
        }
    }, [clearAuthState]);

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
