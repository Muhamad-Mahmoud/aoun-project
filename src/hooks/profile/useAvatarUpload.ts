"use client";

import { useState, useCallback } from 'react';

export const useAvatarUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadAvatar = useCallback(async (
        file: File,
        onUpload: (file: File) => Promise<string>
    ): Promise<string | null> => {
        setIsUploading(true);
        setUploadError(null);

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('يرجى اختيار صورة');
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            }

            const imageUrl = await onUpload(file);
            return imageUrl;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الصورة';
            setUploadError(errorMessage);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setUploadError(null);
    }, []);

    return {
        isUploading,
        uploadError,
        uploadAvatar,
        clearError
    };
};
