/**
 * Common API Types
 * Shared types for API requests and responses
 */

export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
    timestamp?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ApiRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    withAuth?: boolean;
}
