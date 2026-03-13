'use client';

import { useState, useEffect } from 'react';
import { getAssociationProfile, updateAssociationProfile as updateApiProfile } from '../api/associationsApi';
import type { AssociationProfileDto, UpdateAssociationProfileRequest } from '../types';
import { logger } from '@/lib/logger';

export const useAssociationProfile = () => {
    const [profile, setProfile] = useState<AssociationProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await getAssociationProfile();
            setProfile(data);
            setError(null);
        } catch (err: unknown) {
            logger.error('Failed to fetch association profile', err);
            setError('فشل تحميل بيانات جمعيتك. يرجى المحاولة مرة أخرى.');
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (data: UpdateAssociationProfileRequest) => {
        setIsUpdating(true);
        setError(null);
        try {
            await updateApiProfile(data);
            await fetchProfile(); // refresh data
            return true;
        } catch (err: unknown) {
            logger.error('Failed to update association profile', err);
            setError('فشل تحديث بيانات الجمعية.');
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return { profile, isLoading, isUpdating, error, updateProfile, refresh: fetchProfile };
};
