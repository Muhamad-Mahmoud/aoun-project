'use client';

import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/profileApi';
import type { UserProfile, OrganizationProfile } from '../types';
import { logger } from '@/lib/logger';

export const useProfile = (id: string | undefined) => {
    const [profile, setProfile] = useState<UserProfile | OrganizationProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await getUserProfile(id);
                setProfile(data);
                setError(null);
            } catch (err) {
                logger.error('Failed to fetch profile', err);
                setError('فشل تحميل بيانات الملف الشخصي');
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    return { profile, isLoading, error };
};
