/**
 * Input Sanitization Utilities
 * Lightweight XSS prevention without dependencies
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Escapes dangerous characters
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize sensitive data for logging
 * Redacts specified fields
 */
export function sanitizeLogData(
    data: unknown,
    sensitiveFields: string[] = ['password', 'token', 'refreshToken', 'accessToken', 'secret', 'confirmPassword']
): unknown {
    if (!data || typeof data !== 'object') {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => sanitizeLogData(item, sensitiveFields));
    }

    // Handle objects
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()));

        if (isSensitive) {
            sanitized[key] = '***REDACTED***';
        } else if (value && typeof value === 'object') {
            sanitized[key] = sanitizeLogData(value, sensitiveFields);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Validate and sanitize email input
 */
export function sanitizeEmail(email: string): string {
    if (!email) return '';

    return email
        .trim()
        .toLowerCase()
        .replace(/[<>'"]/g, ''); // Remove dangerous characters
}

/**
 * Validate and sanitize phone number input
 */
export function sanitizePhone(phone: string): string {
    if (!phone) return '';

    // Keep only digits, +, -, (, ), space
    return phone.replace(/[^\d+\-() ]/g, '');
}

/**
 * Sanitize general text input
 */
export function sanitizeText(text: string, maxLength: number = 500): string {
    if (!text) return '';

    return sanitizeHtml(text.trim()).slice(0, maxLength);
}
