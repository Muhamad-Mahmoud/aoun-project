/**
 * Auth Context Provider
 * Manages global authentication state
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, isAuthenticated as checkAuth } from '@/features/auth/api/authApi';
import type { AuthUser } from '@/features/auth/types';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize auth state
        const token = getToken();
        const authenticated = checkAuth();

        // TODO: Decode token to get user info or fetch from API
        // For now, just check if authenticated
        setIsLoading(false);
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
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
