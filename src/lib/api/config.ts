import { env } from '@/env';

export const API_CONFIG = {
    // Point to local Next.js proxy
    baseURL: '/api/proxy',
    version: 'v1',
    timeout: 30000, // 30 seconds
    withCredentials: true,
} as const;

export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        resetPassword: '/auth/reset-password',
        verifyEmail: '/auth/verify-email',
    },

    // User endpoints
    user: {
        profile: '/user/profile',
        updateProfile: '/user/profile',
        changePassword: '/user/change-password',
    },

    // Profile endpoints
    profile: {
        get: (id: string) => `/profile/${id}`,
        update: '/profile',
        avatar: '/profile/avatar',
        bookings: '/profile/bookings',
        reviews: '/profile/reviews',
    },

    // Organization endpoints
    organization: {
        get: (id: string) => `/organization/${id}`,
        update: '/organization',
        members: '/organization/members',
    },
} as const;

export const TOKEN_STORAGE_KEY = 'auth_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
