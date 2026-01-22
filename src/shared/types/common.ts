/**
 * Shared Type Definitions
 * Common types used across the application
 */

export interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface APIResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
}
