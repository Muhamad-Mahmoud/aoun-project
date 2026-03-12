/**
 * Authentication API Service
 * Handles all authentication-related API calls directly to the Backend API
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiError, ApiResponse } from '@/lib/api/types';
import { logger } from '@/lib/logger';
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

function isUnauthorizedError(error: unknown): error is ApiError {
    return typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        (error as ApiError).statusCode === 401;
}

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
    if (typeof window !== 'undefined') {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            throw {
                message: payload?.message || 'Failed to refresh session',
                statusCode: response.status,
                errors: payload?.errors,
            } satisfies ApiError;
        }

        const payload = await response.json().catch(() => null);
        return payload?.token;
    }

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
    try {
        const response = await apiClient.get(API_ENDPOINTS.auth.me);
        const responseData = response.data as any;
        const userData = responseData?.data?.data || responseData?.data || responseData;

        if (!userData || !userData.id) {
            logger.warn('getCurrentUser returned an invalid payload', responseData);
            return null;
        }

        const authUser: AuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name || userData.firstName || 'مستخدم',
            role: userData.userType || userData.role || 'Family'
        };

        return authUser;
    } catch (error) {
        if (isUnauthorizedError(error)) {
            return null;
        }

        logger.error('getCurrentUser API call failed', error);
        throw error;
    }
}

/**
 * Check if user is authenticated (Server/Client boundary safe via token presence checking)
 */
export async function isAuthenticated(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const response = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
        });

        if (!response.ok) {
            return false;
        }

        const payload = await response.json().catch(() => null);
        return Boolean(payload?.authenticated);
    } catch {
        return false;
    }
}

