/**
 * API Interceptors
 * Request and response interceptors for axios client
 */

import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_STORAGE_KEY } from './config';
import { ApiError } from './types';
import { logger } from '../logger';

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
            // Add authentication token if available
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

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
                    // TODO: Implement token refresh logic
                    // const newToken = await refreshToken();
                    // localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
                    // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    // return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(TOKEN_STORAGE_KEY);
                        window.location.href = '/login';
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
