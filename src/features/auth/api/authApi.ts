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
    const payload = response.data.data;
    
    // Map numeric UserType to role string
    const userTypeRaw = payload.user.role ?? (payload.user as any).userType ?? 'Family';
    let resolvedRole = userTypeRaw;
    const rawVal = userTypeRaw as any;
    if (rawVal === 0 || rawVal === '0') resolvedRole = 'Admin';
    else if (rawVal === 1 || rawVal === '1') resolvedRole = 'Family';
    else if (rawVal === 2 || rawVal === '2') resolvedRole = 'Association';
    else if (rawVal === 3 || rawVal === '3') resolvedRole = 'Donor';
    
    payload.user.role = resolvedRole.toString();
    
    return payload;
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
 * Register new Donor
 */
export async function registerDonor(data: import('../types').RegisterDonorRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.auth.registerDonor,
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

        let resolvedRole = userData.userType ?? userData.role ?? 'Family';
        
        // Handle C# Enum serialization where Admin=0, Family=1, Association=2, Donor=3
        if (resolvedRole === 0 || resolvedRole === '0') resolvedRole = 'Admin';
        else if (resolvedRole === 1 || resolvedRole === '1') resolvedRole = 'Family';
        else if (resolvedRole === 2 || resolvedRole === '2') resolvedRole = 'Association';
        else if (resolvedRole === 3 || resolvedRole === '3') resolvedRole = 'Donor';

        const authUser: AuthUser = {
            id: userData.id,
            email: userData.email,
            name: (userData.firstName && userData.lastName) 
                ? `${userData.firstName} ${userData.lastName}` 
                : (userData.name || userData.firstName || 'مستخدم'),
            role: resolvedRole.toString(),
            isVerified: userData.isVerified || false
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
