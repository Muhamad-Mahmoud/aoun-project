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
        RESET_PASSWORD: '/reset-password',
        VERIFY_CODE: '/verify-code',
    },
    DASHBOARD: {
        HOME: '/dashboard',
        PROFILE: '/profile',
        SETTINGS: '/settings',
    },
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.AUTH.VERIFY_CODE,
];

export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD.HOME,
    ROUTES.DASHBOARD.PROFILE,
    ROUTES.DASHBOARD.SETTINGS,
];
