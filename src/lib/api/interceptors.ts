/**
 * API Interceptors
 * Request and response interceptors for axios client
 */

import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from './types';
import { logger } from '../logger';
import { refreshToken } from '@/features/auth/api/authApi';
import { ROUTES } from '@/shared/constants/routes';

// Type for API error response data
interface ErrorResponseData {
    message?: string;
    errors?: Record<string, string[]>;
}

import { TOKEN_STORAGE_KEY, API_ENDPOINTS } from './config';
import { getSecureToken, setSecureToken, removeSecureToken } from '../security/tokenStorage';
import { sanitizeLogData } from '../security/sanitize';

/**
 * Setup request interceptors
 */
export function setupRequestInterceptors(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // تعيين Content-Type بناءً على نوع البيانات
            if (config.data) {
                // إذا كانت البيانات FormData، دع axios يحددها تلقائياً
                if (!(config.data instanceof FormData)) {
                    // للبيانات العادية (JSON)، عيّن Content-Type
                    config.headers['Content-Type'] = 'application/json';
                }
            }

            // Define public endpoints that don't need auth token
            const publicEndpoints = [
                API_ENDPOINTS.auth.login,
                API_ENDPOINTS.auth.registerFamily,
                API_ENDPOINTS.auth.registerAssociation,
                API_ENDPOINTS.auth.forgotPassword,
                API_ENDPOINTS.auth.resetPassword,
                API_ENDPOINTS.auth.verifyResetCode,
            ];

            // Check if current request URL matches any public endpoint
            const isPublicEndpoint = config.url && publicEndpoints.some(endpoint => config.url?.includes(endpoint));

            // Attach token if available and NOT a public endpoint
            if (typeof window !== 'undefined' && !isPublicEndpoint) {
                // Use encrypted token storage
                const token = await getSecureToken(TOKEN_STORAGE_KEY);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            // Log request in development (sanitized)
            if (process.env.NODE_ENV === 'development') {
                logger.debug('API Request', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    dataType: config.data instanceof FormData ? 'FormData' : 'JSON',
                    contentType: config.headers['Content-Type'],
                    data: sanitizeLogData(config.data),
                });
            }

            return config;
        },
        (error: AxiosError) => {
            logger.error('Request interceptor error', error);
            return Promise.reject(error);
        }
    );
}

/**
 * Setup response interceptors
 */
export function setupResponseInterceptors(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Log response in development
            if (process.env.NODE_ENV === 'development') {
                logger.debug('API Response', {
                    status: response.status,
                    url: response.config.url,
                    data: response.data,
                });
            }

            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Handle 401 Unauthorized - try token refresh
            // Skip refresh logic for login endpoint to avoid loops
            const isLoginRequest = originalRequest.url?.includes(API_ENDPOINTS.auth.login);

            if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
                originalRequest._retry = true;

                try {
                    // Get refresh token from encrypted storage
                    const refreshTokenValue = typeof window !== 'undefined'
                        ? await getSecureToken('refresh_token')
                        : null;

                    if (!refreshTokenValue) {
                        // No refresh token available, user needs to re-login
                        if (typeof window !== 'undefined') {
                            removeSecureToken('auth_token');
                            // Only redirect if on a protected page (not on public pages)
                            const currentPath = window.location.pathname;
                            const isPublicPage = currentPath === '/' ||
                                currentPath.includes('/login') ||
                                currentPath.includes('/register') ||
                                currentPath.includes('/forgot-password') ||
                                currentPath.includes('/reset-password') ||
                                currentPath.includes('/verify-code');

                            if (!isPublicPage) {
                                window.location.href = ROUTES.AUTH.LOGIN;
                            }
                        }
                        return Promise.reject(error);
                    }

                    // Attempt to refresh the token
                    const currentToken = await getSecureToken(TOKEN_STORAGE_KEY);
                    const response = await refreshToken({
                        token: currentToken || '',
                        refreshToken: refreshTokenValue
                    });

                    // Save new token using encrypted storage
                    if (response && typeof window !== 'undefined') {
                        await setSecureToken(TOKEN_STORAGE_KEY, response);

                        // Retry original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response}`;
                        }
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    logger.error('Token refresh failed', refreshError);
                    if (typeof window !== 'undefined') {
                        await removeSecureToken('auth_token');
                        await removeSecureToken('refresh_token');
                        // Only redirect if on a protected page (not on public pages)
                        const currentPath = window.location.pathname;
                        const isPublicPage = currentPath === '/' ||
                            currentPath.includes('/login') ||
                            currentPath.includes('/register') ||
                            currentPath.includes('/forgot-password') ||
                            currentPath.includes('/reset-password') ||
                            currentPath.includes('/verify-code');

                        if (!isPublicPage) {
                            window.location.href = ROUTES.AUTH.LOGIN;
                        }
                    }
                    return Promise.reject(refreshError);
                }
            }

            // Transform error to ApiError format
            const responseData = error.response?.data as any; // Use any to access potential ProblemDetails fields

            // Extract the most relevant error message - check multiple possible fields
            let message = responseData?.message || responseData?.detail || responseData?.title;
            let validationErrors: Record<string, string[]> = {};

            // If errors object exists (validation errors), extract them all
            if (responseData?.errors && typeof responseData.errors === 'object') {
                validationErrors = responseData.errors;
                
                if (!message) {
                    // Combine all validation errors
                    const allErrors: string[] = [];
                    Object.entries(validationErrors).forEach(([field, errors]) => {
                        const errorArray = Array.isArray(errors) ? errors : [errors];
                        errorArray.forEach(err => {
                            // Add field name for clarity
                            allErrors.push(`${field}: ${err}`);
                        });
                    });
                    
                    if (allErrors.length > 0) {
                        message = allErrors.join('\n');
                    }
                }
            }

            if (!message) {
                // Localize generic Axios errors or provide fallback
                if (error.message === 'Network Error') {
                    message = 'خطأ في الاتصال بالشبكة، يرجى التحقق من الإنترنت';
                } else if (error.response?.status === 401) {
                    message = 'جلسة غير صالحة أو انتهت الصلاحية';
                } else if (error.response?.status === 403) {
                    message = 'غير مصرح لك بالوصول لهذا الموارد';
                } else if (error.response?.status === 404) {
                    message = 'المورد المطلوب غير موجود';
                } else if (error.response?.status && error.response.status >= 500) {
                    message = 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً';
                } else {
                    message = error.message || 'حدث خطأ غير متوقع';
                    // Strip "Request failed with status code" if it slips through
                    if (message.includes('Request failed with status code')) {
                        message = `حدث خطأ في الطلب (${error.response?.status || 'غير معروف'})`;
                    }
                }
            }

            // Log the full response data in development for debugging
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ API Error Response:');
                console.table({
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    url: error.response?.config.url,
                });
                console.error('Response Data:', responseData);
                console.error('Extracted Message:', message);
                logger.debug('Full error response data', responseData);
            }

            const apiError: ApiError = {
                message: message,
                statusCode: error.response?.status || 500,
                errors: responseData?.errors,
                timestamp: new Date().toISOString(),
            };

            logger.error('API Error', apiError);

            return Promise.reject(apiError);
        }
    );
}
