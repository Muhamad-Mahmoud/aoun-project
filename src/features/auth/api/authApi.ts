/**
 * Authentication API Service
 * Handles all authentication-related API calls to the Next.js Route Handlers (BFF)
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    ResetPasswordData,
    AuthUser,
} from '../types';

// NOTE: api/proxy is set as baseURL in config, so apiClient calls go to /api/proxy/...
// But our Auth Handlers are at /api/auth/... so we need to bypass baseURL or use absolute paths for Auth.
// Since baseURL is '/api/proxy', we can't easily jump out of it with apiClient unless we use absolute URL or different instance.
// Simplest is to use native fetch for these specific calls or a separate axios instance. We'll use fetch for simplicity of the BFF pattern.

/**
 * Login user with credentials
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // data.data contains user object, but NO tokens (handled by cookies)
    return data.data;
}

/**
 * Register new user
 * Note: Register usually returns token too. If backend auto-logs in, we need a proxy for register too.
 * Assuming register flow might be: Register -> Login, OR Register returns token.
 * If Register returns token, we should create /api/auth/register route handler. 
 * For now, assuming standard flow, we'll keep using apiClient for register if it just creates user, 
 * but if it expects auto-login, we need a handler.
 * Let's assume register creates user and we execute login afterwards, or we need to implement /api/auth/register.
 * Given existing code returned tokens, we SHOULD implement /api/auth/register too.
 * For this task scope, I will assume Register works as is (via proxy) but won't set cookie? 
 * Wait, if register returns token, we need to set cookie. 
 * I'll stick to apiClient for Register for now (via proxy), but the token won't be saved in cookie. 
 * Users usually have to log in after register or the FE calls login.
 * If the current FE flow expects auto-login, this breaks.
 * I will stick to minimal changes: explicit Login call after Register is safer if I don't make a handler.
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
        throw new Error(resData.message || 'Registration failed');
    }

    return resData.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    await fetch('/api/auth/logout', {
        method: 'POST',
    });
    // No manual cookie removal needed (handled by server response)
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
    // Call BFF refresh endpoint
    const response = await fetch('/api/auth/refresh', {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error('Refresh failed');
    }

    const data = await response.json();
    return data.data?.token || '';
}

/**
 * Get current user session from BFF
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch('/api/auth/me');

    if (!response.ok) {
        return null;
    }

    const res = await response.json();
    return res.data;
}

/**
 * Get current authentication token
 * @deprecated Token is now httpOnly, cannot be accessed by client.
 */
export function getToken(): string | null {
    return null;
}

/**
 * Check if user is authenticated
 * Raly on existence of user profile or successful API calls.
 * This is a weak check now. 
 */
export function isAuthenticated(): boolean {
    // We can't synchronously value this anymore.
    // Client state (store) should indicate if user is logged in.
    return false; // Should rely on app state
}
