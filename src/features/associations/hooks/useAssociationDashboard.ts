'use client';

import { useState, useEffect } from 'react';
import { getAssociationUndertakings, getAssociationAnalytics, getAssociationImpactReport } from '../api/associationsApi';
import { logger } from '@/lib/logger';

// Since the dashboard detailed spec wasn't provided, typing this generically for now based on what stats typically look like
import { AssociationAnalyticsDto, ImpactReportDto } from '../types';

export const useAssociationDashboard = () => {
    const [undertakings, setUndertakings] = useState<any>(null);
    const [analytics, setAnalytics] = useState<AssociationAnalyticsDto | null>(null);
    const [impactReport, setImpactReport] = useState<ImpactReportDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [undertakingsData, analyticsData, impactData] = await Promise.all([
                getAssociationUndertakings().catch(e => {
                    logger.error('Failed to fetch undertakings', e);
                    return null;
                }),
                getAssociationAnalytics().catch(e => {
                    logger.error('Failed to fetch analytics', e);
                    return null;
                }),
                getAssociationImpactReport().catch(e => {
                    logger.error('Failed to fetch impact report', e);
                    return null;
                }),
            ]);

            setUndertakings(undertakingsData);
            setAnalytics(analyticsData);
            setImpactReport(impactData);
            setError(null);
        } catch (err: unknown) {
            logger.error('Failed to fetch dashboard data', err);
            setError('فشل تحميل إحصائيات لوحة التحكم.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { 
        undertakings, 
        analytics, 
        impactReport,
        isLoading, 
        error, 
        refresh: fetchDashboardData 
    };
};
