'use client';

import { useState, useEffect } from 'react';
import { getAssociationUndertakings, getAssociationAnalytics } from '../api/associationsApi';
import { logger } from '@/lib/logger';

console.log('[Hook] useAssociationDashboard module loaded');

// Since the dashboard detailed spec wasn't provided, typing this generically for now based on what stats typically look like
import { AssociationAnalyticsDto } from '../types';

export const useAssociationDashboard = () => {
    const [undertakings, setUndertakings] = useState<any>(null);
    const [analytics, setAnalytics] = useState<AssociationAnalyticsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        console.log('[Hook] useAssociationDashboard: fetchDashboardData called');
        setIsLoading(true);
        try {
            console.log('[Hook] useAssociationDashboard: starting Promise.all');
            // Fetch both in parallel
            const [undertakingsData, analyticsData] = await Promise.all([
                getAssociationUndertakings().catch(e => {
                    console.error('[Hook] undertakings error caught:', e);
                    logger.error('Failed to fetch undertakings', e);
                    return null;
                }),
                getAssociationAnalytics().catch(e => {
                    console.error('[Hook] analytics error caught:', e);
                    logger.error('Failed to fetch analytics', e);
                    return null;
                })
            ]);
            
            console.log('[Hook] useAssociationDashboard: data received', { undertakingsData, analyticsData });
            setUndertakings(undertakingsData);
            setAnalytics(analyticsData);
            setError(null);
        } catch (err: unknown) {
            console.error('[Hook] main catch error:', err);
            logger.error('Failed to fetch dashboard data', err);
            setError('فشل تحميل إحصائيات لوحة التحكم.');
        } finally {
            console.log('[Hook] useAssociationDashboard: finished');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('[Hook] useAssociationDashboard: useEffect firing');
        fetchDashboardData();
    }, []);

    return { 
        undertakings, 
        analytics, 
        isLoading, 
        error, 
        refresh: fetchDashboardData 
    };
};
