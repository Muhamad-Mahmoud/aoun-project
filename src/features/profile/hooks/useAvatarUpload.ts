/**
 * Avatar Upload Hook
 */

import { useState, useCallback } from 'react';

export function useAvatarUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadAvatar = useCallback(async (
        file: File,
        uploadFn: (file: File) => Promise<string>
    ): Promise<string | null> => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const url = await uploadFn(file);
            return url;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            setUploadError(message);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, []);

    return {
        isUploading,
        uploadError,
        uploadAvatar,
    };
}
