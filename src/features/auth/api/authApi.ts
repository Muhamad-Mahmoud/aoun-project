/**
 * Authentication API Service
 * Handles all authentication-related API calls to the .NET backend
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    ResetPasswordData,
} from '../types';

/**
 * Login user with credentials
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.auth.login,
        credentials
    );

    const { token, refreshToken, user } = response.data.data;

    // Store tokens
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
        }
    }

    return response.data.data;
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.auth.register,
        data
    );

    return response.data.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
        // Clear tokens regardless of API call success
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        }
    }
}

/**
 * Request password reset
 */
export async function resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post<ApiResponse>(
        API_ENDPOINTS.auth.resetPassword,
        data
    );
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
        : null;

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await apiClient.post<ApiResponse<{ token: string }>>(
        API_ENDPOINTS.auth.refresh,
        { refreshToken }
    );

    const newToken = response.data.data.token;

    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    }

    return newToken;
}

/**
 * Get current authentication token
 */
export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}
