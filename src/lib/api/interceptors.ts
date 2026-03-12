/**
 * API Interceptors
 * Request and response interceptors for axios client
 */

import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from './types';
import { logger } from '../logger';
import { PUBLIC_ROUTES } from '@/shared/constants/routes';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, API_ENDPOINTS } from './config';
import { removeSecureToken } from '../security/tokenStorage';
import { sanitizeLogData } from '../security/sanitize';
import { APP_EVENTS, dispatchAppEvent } from '../../shared/utils/events';

// Type for API error response data
interface ErrorResponseData {
    message?: string;
    errors?: Record<string, string[]>;
}

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
            const isLoginRequest = originalRequest.url?.includes(API_ENDPOINTS.auth.login);
            const isRefreshRequest = originalRequest.url?.includes('/api/auth/refresh') ||
                originalRequest.url?.includes(API_ENDPOINTS.auth.refresh);

            if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
                originalRequest._retry = true;

                try {
                    if (typeof window === 'undefined') {
                        return Promise.reject(error);
                    }

                    const refreshResponse = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                    const refreshPayload = await refreshResponse.json().catch(() => null);

                    if (!refreshResponse.ok) {
                        if (refreshResponse.status === 401) {
                            await removeSecureToken(TOKEN_STORAGE_KEY);
                            await removeSecureToken(REFRESH_TOKEN_STORAGE_KEY);

                            const currentPath = window.location.pathname;
                            const isPublicPage = PUBLIC_ROUTES.some(route => currentPath === route);

                            if (!isPublicPage) {
                                dispatchAppEvent(APP_EVENTS.AUTH_UNAUTHORIZED);
                            }
                        }

                        return Promise.reject(refreshPayload ?? error);
                    }

                    const refreshedToken = refreshPayload?.token;
                    const usesProxy = originalRequest.baseURL?.startsWith('/api/proxy');

                    if (refreshedToken && originalRequest.headers && !usesProxy) {
                        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
                    }

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    logger.error('Token refresh failed', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            // Transform error to ApiError format
            const responseData = error.response?.data as any;

            // Extract the most relevant error message
            let message = responseData?.message || responseData?.detail || responseData?.title;
            let validationErrors: Record<string, string[]> = {};

            if (responseData?.errors && typeof responseData.errors === 'object') {
                validationErrors = responseData.errors;
                
                if (!message) {
                    const allErrors: string[] = [];
                    Object.entries(validationErrors).forEach(([field, errors]) => {
                        const errorArray = Array.isArray(errors) ? errors : [errors];
                        errorArray.forEach(err => {
                            allErrors.push(`${field}: ${err}`);
                        });
                    });
                    
                    if (allErrors.length > 0) {
                        message = allErrors.join('\n');
                    }
                }
            }

            if (!message) {
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
                    if (message.includes('Request failed with status code')) {
                        message = `حدث خطأ في الطلب (${error.response?.status || 'غير معروف'})`;
                    }
                }
            }

            if (process.env.NODE_ENV === 'development') {
                logger.debug('❌ API Error Response:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    url: error.response?.config.url,
                });
                logger.debug('Response Data:', JSON.stringify(responseData, null, 2));
                logger.debug('Extracted Message:', message);
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
