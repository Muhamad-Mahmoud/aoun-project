/**
 * API Client
 * Centralized axios client with interceptors and configuration
 */

import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';
import { setupRequestInterceptors, setupResponseInterceptors } from './interceptors';

/**
 * Create and configure axios instance
 */
const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
        withCredentials: API_CONFIG.withCredentials,
        headers: {
            'Accept': 'application/json',
        },
    });

    // Setup interceptors
    setupRequestInterceptors(client);
    setupResponseInterceptors(client);

    return client;
};

/**
 * Main API client instance
 */
export const apiClient = createApiClient();

/**
 * Export axios for type usage
 */
export type { AxiosError, AxiosResponse } from 'axios';
