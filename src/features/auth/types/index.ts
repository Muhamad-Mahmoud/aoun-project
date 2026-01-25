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

// Family Registration Payload
export interface RegisterFamilyRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    headNationalId: string;
    password: string;
    confirmPassword: string;
    country: string;
    governorate: string;
    city: string;
    neighborhood: string;
}

// Association Registration Payload
export interface RegisterAssociationRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    country: string;
    city: string;
    governorate: string;
    capacity: number;
    coverageNotes: string;
}

// Union type for internal use if needed
export type RegisterRequest = RegisterFamilyRequest | RegisterAssociationRequest;

// Keeping partial RegisterData for legacy/compatibility if needed, or we can deprecate it.
export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string; // Generic name
    phone?: string;
    userType?: 'individual' | 'organization';
    // ... extendable
}

export interface RegisterResponse {
    message: string;
    userId?: string;
    // API 200 OK usually returns nothing or success message content
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyResetCodeRequest {
    email: string;
    code: string;
}

export interface ResetPasswordRequest {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
}

export interface RefreshTokenRequest {
    token: string;
    refreshToken: string;
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
