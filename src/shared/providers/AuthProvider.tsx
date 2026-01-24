/**
 * Auth Context Provider
 * Manages global authentication state
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout as logoutApi } from '@/features/auth/api/authApi';
import type { AuthUser } from '@/features/auth/types';
import { logger } from '@/lib/logger';
import { ROUTES } from '@/shared/constants/routes';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    updateUser: (user: AuthUser | null) => void;
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
            await logoutApi();
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            router.push(ROUTES.AUTH.LOGIN);
        } catch (error) {
            logger.error('Logout failed', error);
        }
    }, [router]);

    const updateUser = useCallback((newUser: AuthUser | null) => {
        setUser(newUser);
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
