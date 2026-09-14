'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAssociationRequests } from '../api/associationsApi';
import type { RequestListItemDto, PagedResult, AssociationRequestFilter } from '../types';
import { logger } from '@/lib/logger';

export const useAssociationRequests = (initialFilter?: AssociationRequestFilter) => {
    const [data, setData] = useState<PagedResult<RequestListItemDto> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<AssociationRequestFilter>({
        pageNumber: 1,
        pageSize: 10,
        ...initialFilter
    });

    const fetchRequests = useCallback(async (currentFilter: AssociationRequestFilter) => {
        setIsLoading(true);
        try {
            const result = await getAssociationRequests(currentFilter);
            setData(result);
            setError(null);
        } catch (err: unknown) {
            logger.error('Failed to fetch association requests', err);
            setError('فشل تحميل قائمة الطلبات.');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests(filter);
    }, [filter, fetchRequests]);

    const updateFilter = (newFilter: Partial<AssociationRequestFilter>) => {
        setFilter(prev => ({ ...prev, ...newFilter, pageNumber: newFilter.pageNumber ?? 1 })); // default to page 1 on filter change
    };

    const setPage = (pageNumber: number) => {
        setFilter(prev => ({ ...prev, pageNumber }));
    };

    return { 
        requests: data?.items || [], 
        pagination: data ? {
            totalCount: data.totalCount,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize
        } : null,
        isLoading, 
        error, 
        filter,
        updateFilter,
        setPage,
        refresh: () => fetchRequests(filter) 
    };
};
