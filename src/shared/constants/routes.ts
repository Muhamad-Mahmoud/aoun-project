/**
 * Application Routes
 * Centralized route definitions to avoid hardcoded strings
 */
export const ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
    },
    DASHBOARD: {
        HOME: '/dashboard',
        PROFILE: '/profile',
        SETTINGS: '/settings',
    },
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD.HOME,
    ROUTES.DASHBOARD.PROFILE,
    ROUTES.DASHBOARD.SETTINGS,
];
