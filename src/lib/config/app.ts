/**
 * Application Configuration
 * Core app settings and constants
 */

export const appConfig = {
    // App Info
    name: 'Aoun Platform',
    nameAr: 'منصة عون',
    description: 'منصة ذكية للمساعدات الخيرية في مصر',

    // Localization
    locale: 'ar',
    direction: 'rtl' as const,
    language: 'ar',

    // UI Settings
    itemsPerPage: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB

    // URLs
    supportEmail: 'support@aoun.com',

} as const;
