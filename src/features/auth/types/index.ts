/**
 * Authentication Types
 */

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    token: string;
    refreshToken?: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone?: string;
    userType?: 'individual' | 'organization';
}

export interface RegisterResponse {
    message: string;
    userId: string;
}

export interface ResetPasswordData {
    email: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Re-export register types
export * from './register';
