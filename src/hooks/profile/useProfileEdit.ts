"use client";

import { useState, useCallback } from 'react';

export const useProfileEdit = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState<Record<string, any>>({});

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setEditedData({});
    }, []);

    const updateField = useCallback((field: string, value: any) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    }, []);

    const saveChanges = useCallback(async (onSave: (data: Record<string, any>) => Promise<void>) => {
        setIsSaving(true);
        try {
            await onSave(editedData);
            setIsEditing(false);
            setEditedData({});
        } catch (error) {
            console.error('Error saving profile:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [editedData]);

    return {
        isEditing,
        isSaving,
        editedData,
        startEditing,
        cancelEditing,
        updateField,
        saveChanges
    };
};
