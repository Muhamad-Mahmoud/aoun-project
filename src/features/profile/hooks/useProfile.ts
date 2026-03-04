'use client';

import { useState, useEffect } from 'react';
import { getMyProfile } from '../api/profileApi';
import type { UserProfile, OrganizationProfile } from '../types';
import { logger } from '@/lib/logger';

export const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile | OrganizationProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await getMyProfile();
                setProfile(data);
                setError(null);
            } catch (err: unknown) {
                logger.error('Failed to fetch profile', err);
                setError('فشل تحميل بيانات الملف الشخصي');
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, isLoading, error };
};

