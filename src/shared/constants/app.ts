/**
 * Application Constants
 * Global constants used across the app
 */

export const APP_CONSTANTS = {
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],

    // Validation
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    PHONE_REGEX: /^01[0-2,5]{1}[0-9]{8}$/,

    // UI
    TOAST_DURATION: 3000,
    DEBOUNCE_DELAY: 300,

} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    FORGOT_PASSWORD: '/forgot-password',
} as const;
