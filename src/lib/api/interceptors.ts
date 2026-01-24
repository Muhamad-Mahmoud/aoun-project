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

/**
 * Setup request interceptors
 */
export function setupRequestInterceptors(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Authentication is now handled via HttpOnly cookies and Proxy Middleware

            // Log request in development
            if (process.env.NODE_ENV === 'development') {
                logger.debug('API Request', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    data: config.data,
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

            // Handle 401 Unauthorized - token refresh logic
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Try to refresh token via BFF (HttpOnly cookie)
                    await refreshToken();

                    // Retry the original request
                    // The browser will automatically attach the new cookies
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    if (typeof window !== 'undefined') {
                        // We rely on server deletion of cookies on refresh failure, or handle it here
                        // Since client can't delete HttpOnly cookies, we validly redirect.
                        window.location.href = ROUTES.AUTH.LOGIN;
                    }
                    return Promise.reject(refreshError);
                }
            }

            // Transform error to ApiError format
            const responseData = error.response?.data as ErrorResponseData | undefined;
            const apiError: ApiError = {
                message: responseData?.message || error.message || 'An unexpected error occurred',
                statusCode: error.response?.status || 500,
                errors: responseData?.errors,
                timestamp: new Date().toISOString(),
            };

            logger.error('API Error', apiError);

            return Promise.reject(apiError);
        }
    );
}
