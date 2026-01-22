/**
 * Profile Edit Hook
 */

import { useState, useCallback } from 'react';

export function useProfileEdit() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
    }, []);

    const saveChanges = useCallback(async (data: Record<string, unknown>) => {
        setIsSaving(true);
        try {
            // TODO: Call API to save changes
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    }, []);

    return {
        isEditing,
        isSaving,
        startEditing,
        cancelEditing,
        saveChanges,
    };
}
