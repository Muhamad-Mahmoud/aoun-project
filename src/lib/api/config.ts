/**
 * API Configuration
 *
 * SECURITY:
 *  - The real backend URL (API_URL) is a server-only env variable and is
 *    NEVER sent to the browser. All browser requests go through the
 *    Next.js internal proxy at /api/proxy, which forwards them
 *    server-side and injects the auth token from the HttpOnly cookie.
 *  - Do NOT add NEXT_PUBLIC_ to API_URL or AI_API_URL.
 */

export const API_CONFIG = {
    /**
     * Browser clients always talk to the internal Next.js proxy.
     * Server-side code (middleware, route handlers) reads API_URL from env
     * and constructs the real target URL itself.
     */
    baseURL: typeof window === 'undefined'
        ? (process.env.API_URL || '')          // server: real backend
        : '/api/proxy',                         // browser: internal proxy only
    timeout: 30_000,
    withCredentials: false,
} as const;

export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: '/api/Auth/login',
        registerFamily: '/api/Auth/register/family',
        registerAssociation: '/api/Auth/register/association',
        logout: '/api/Auth/logout',
        refresh: '/api/Auth/refresh-token',
        resetPassword: '/api/Auth/reset-password',
        forgotPassword: '/api/Auth/forgot-password',
        verifyResetCode: '/api/Auth/verify-reset-code',
        me: '/api/Auth/me',
    },

    // User endpoints
    user: {
        profile: '/api/User/profile',
        updateProfile: '/api/User/profile',
        changePassword: '/api/User/change-password',
    },

    // Profile endpoints (General profile queries)
    profile: {
        get: (id: string) => `/api/profile/${id}`,
        update: '/api/profile',
        avatar: '/api/profile/avatar',
        bookings: '/api/profile/bookings',
        reviews: '/api/profile/reviews',
    },

    // Association endpoints
    association: {
        profile: '/api/Associations/profile',
        requests: '/api/Associations/requests',
        requestById: (id: string | number) => `/api/Associations/requests/${id}`,
        acceptRequest: (id: string | number) => `/api/Associations/requests/${id}/accept`,
        rejectRequest: (id: string | number) => `/api/Associations/requests/${id}/reject`,
    },

    // Dashboard endpoints
    dashboard: {
        association: {
            undertakings: '/api/Dashboard/Association/undertakings',
            analytics: '/api/Dashboard/Association/analytics',
        },
    },

    // Families endpoints
    families: {
        profile: '/api/Families/profile',
        statistics: '/api/Families/statistics',
    },

    // Requests endpoints
    requests: {
        base: '/api/Requests',
        getById: (id: string | number) => `/api/Requests/${id}`,
        cancel: (id: string | number) => `/api/Requests/${id}/cancel`,
    },

    // AI endpoints — proxied through Next.js AI route handler
    ai: {
        chatStream: '/api/ai/chat/stream',
    },
} as const;

export const TOKEN_STORAGE_KEY = 'auth_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
