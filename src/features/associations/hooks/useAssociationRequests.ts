'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAssociationRequests } from '../api/associationsApi';
import type { RequestListItemDto, PagedResult, AssociationRequestFilter } from '../types';
import { logger } from '@/lib/logger';

// Assuming the user intended to add this console log at the top of the *current* file,
// as the provided "Code Edit" inserts it here.
// The "Code Edit" also includes `import { apiClient } from '@/lib/api/client';`
// which is not used in this file and would be an unrelated edit if added here.
// The `/**` in the "Code Edit" appears to be a partial comment from another file
// that was incorrectly merged into the `import type` line.
// I will only add the console.log as it's the explicit instruction for this file.
console.log('[Hook] useAssociationRequests module loaded');

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
        console.log('[Hook] useAssociationRequests: fetchRequests called with', currentFilter);
        setIsLoading(true);
        try {
            const result = await getAssociationRequests(currentFilter);
            console.log('[Hook] useAssociationRequests: result received', result);
            setData(result);
            setError(null);
        } catch (err: unknown) {
            console.error('[Hook] useAssociationRequests error:', err);
            logger.error('Failed to fetch association requests', err);
            setError('فشل تحميل قائمة الطلبات.');
            setData(null);
        } finally {
            console.log('[Hook] useAssociationRequests: finished');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('[Hook] useAssociationRequests: useEffect firing', filter);
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
