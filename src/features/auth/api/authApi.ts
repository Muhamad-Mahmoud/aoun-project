/**
 * Authentication API Service
 * Handles all authentication-related API calls directly to the Backend API
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types'; // You might need to check if this exists/matches
import type {
    LoginCredentials,
    LoginResponse,
    RegisterFamilyRequest,
    RegisterAssociationRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    VerifyResetCodeRequest,
    ResetPasswordRequest,
    RefreshTokenRequest,
    AuthUser,
} from '../types';

/**
 * Login user with credentials
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { email, password } = credentials;
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.auth.login,
        { email, password }
    );
    return response.data.data;
}

/**
 * Register new Family
 */
export async function registerFamily(data: RegisterFamilyRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.auth.registerFamily,
        data
    );
    return response.data.data;
}

/**
 * Register new Association
 */
export async function registerAssociation(data: RegisterAssociationRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.auth.registerAssociation,
        data
    );
    return response.data.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    // If the backend has a logout endpoint to invalidate token
    await apiClient.post(API_ENDPOINTS.auth.logout);
}

/**
 * Request password reset (Forgot Password)
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(
        API_ENDPOINTS.auth.forgotPassword,
        data
    );
}

/**
 * Verify Reset Code
 */
export async function verifyResetCode(data: VerifyResetCodeRequest): Promise<void> {
    await apiClient.post(
        API_ENDPOINTS.auth.verifyResetCode,
        data
    );
}

/**
 * Reset Password with token/code
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(
        API_ENDPOINTS.auth.resetPassword,
        data
    );
}

/**
 * Refresh authentication token
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
        API_ENDPOINTS.auth.refresh,
        data // Backend likely needs the old token/refresh token
    );
    return response.data.data.token;
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    // First check if we have a token - if not, no need to call API
    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            return null;
        }
    }

    try {
        const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.auth.me);

        // Backend might return { data: User } or just User
        // Safe check
        const userData = response.data.data || response.data;

        if (!userData || !userData.id) {
            console.warn('getCurrentUser: Invalid user data received', response.data);
            return null;
        }

        // Map API response to AuthUser format
        // API returns "userType" but we use "role" in the frontend
        const authUser: AuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.userType || userData.role || 'Family' // Map userType to role
        };

        return authUser;
    } catch (error) {
        // console.error('getCurrentUser failed', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    // This should ideally check the store or cookie/local storage existence
    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('auth_token'); // Using sessionStorage now
        return !!token;
    }
    return false;
}

