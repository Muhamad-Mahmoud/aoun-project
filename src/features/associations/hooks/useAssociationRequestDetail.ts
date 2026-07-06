'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAssociationRequestById, acceptAssociationRequest, rejectAssociationRequest, completeAssociationRequest } from '../api/associationsApi';
import type { RequestDetailDto, AcceptRequestDto, RejectRequestDto } from '../types';
import { logger } from '@/lib/logger';

export const useAssociationRequestDetail = (id: string | number) => {
    const [request, setRequest] = useState<RequestDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log(`[Hook] useAssociationRequestDetail initialized for id: ${id}`);

    const fetchRequest = useCallback(async () => {
        console.log(`[Hook] fetchRequest starting for id: ${id}`);
        setIsLoading(true);
        try {
            const data = await getAssociationRequestById(id);
            console.log(`[Hook] fetchRequest success for id: ${id}:`, data);
            setRequest(data);
            setError(null);
        } catch (err: unknown) {
            console.error(`[Hook] Failed to fetch request detail for id ${id}`, err);
            logger.error(`Failed to fetch request detail for id ${id}`, err);
            setError('فشل تحميل تفاصيل الطلب.');
            setRequest(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchRequest();
        }
    }, [id, fetchRequest]);

    const acceptRequest = async (data: AcceptRequestDto) => {
        setIsActionLoading(true);
        try {
            await acceptAssociationRequest(id, data);
            await fetchRequest(); // refresh to update status
            return true;
        } catch (err: unknown) {
            logger.error('Failed to accept request', err);
            setError('حدث خطأ أثناء الموافقة على الطلب.');
            setIsActionLoading(false);
            return false;
        }
    };

    const rejectRequest = async (data: RejectRequestDto) => {
        setIsActionLoading(true);
        try {
            await rejectAssociationRequest(id, data);
            await fetchRequest(); // refresh to update status
            return true;
        } catch (err: unknown) {
            logger.error('Failed to reject request', err);
            setError('حدث خطأ أثناء رفض الطلب.');
            setIsActionLoading(false);
            return false;
        }
    };

    const completeRequest = async () => {
        setIsActionLoading(true);
        try {
            await completeAssociationRequest(id);
            await fetchRequest(); // refresh to update status
            return true;
        } catch (err: unknown) {
            logger.error('Failed to complete request', err);
            setError('حدث خطأ أثناء إتمام الطلب.');
            setIsActionLoading(false);
            return false;
        }
    };

    return { 
        request, 
        isLoading, 
        isActionLoading, 
        error, 
        refresh: fetchRequest,
        acceptRequest,
        rejectRequest,
        completeRequest
    };
};
