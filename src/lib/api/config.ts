import { env } from '@/env';

export const API_CONFIG = {
    // Point to external API
    baseURL: 'https://aoun-api.runasp.net',
    version: 'v1',
    timeout: 30000,
    withCredentials: false,
} as const;

export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: '/api/Auth/login',
        registerFamily: '/api/Auth/register/family',
        registerAssociation: '/api/Auth/register/association',
        logout: '/api/Auth/logout', // Assuming this exists or we keep it for client cleanup
        refresh: '/api/Auth/refresh-token',
        resetPassword: '/api/Auth/reset-password',
        forgotPassword: '/api/Auth/forgot-password',
        verifyResetCode: '/api/Auth/verify-reset-code',
        me: '/api/Auth/me',
    },

    // User endpoints
    user: {
        profile: '/api/User/profile', // Placeholder till verified
        updateProfile: '/api/User/profile',
        changePassword: '/api/User/change-password',
    },

    // Profile endpoints
    profile: {
        get: (id: string) => `/api/profile/${id}`,
        update: '/api/profile',
        avatar: '/api/profile/avatar',
        bookings: '/api/profile/bookings',
        reviews: '/api/profile/reviews',
    },

    // Organization endpoints
    organization: {
        get: (id: string) => `/api/organization/${id}`,
        update: '/api/organization',
        members: '/api/organization/members',
    },
} as const;

export const TOKEN_STORAGE_KEY = 'auth_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
