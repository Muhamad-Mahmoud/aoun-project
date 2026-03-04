/**
 * Profile Edit Hook
 */

import { useState, useCallback } from 'react';
import { updateProfile } from '../api/profileApi';
import { logger } from '@/lib/logger';

export function useProfileEdit() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const startEditing = useCallback(() => {
        setIsEditing(true);
        setSaveError(null);
    }, []);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setSaveError(null);
    }, []);

    const saveChanges = useCallback(async (data: Record<string, unknown>) => {
        setIsSaving(true);
        setSaveError(null);
        try {
            await updateProfile(data);
            setIsEditing(false);
        } catch (error) {
            logger.error('Failed to save profile changes', error);
            setSaveError('فشل حفظ التغييرات. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSaving(false);
        }
    }, []);

    return {
        isEditing,
        isSaving,
        saveError,
        startEditing,
        cancelEditing,
        saveChanges,
    };
}
