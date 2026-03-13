/**
 * Profile API Service
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';
import type { UserProfile, OrganizationProfile } from '../types';

export async function getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
        API_ENDPOINTS.profile.get(userId)
    );
    return response.data.data;
}

export async function getOrganizationProfile(orgId: string): Promise<OrganizationProfile> {
    const response = await apiClient.get<ApiResponse<OrganizationProfile>>(
        API_ENDPOINTS.association.profile
    );
    return response.data.data;
}

// Use /api/Auth/me to get current user's profile
export async function getMyProfile(): Promise<UserProfile | OrganizationProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile | OrganizationProfile>>(
        API_ENDPOINTS.auth.me
    );
    return response.data.data;
}

export async function updateProfile(data: Partial<UserProfile | OrganizationProfile>): Promise<void> {
    await apiClient.put(API_ENDPOINTS.profile.update, data);
}

export async function uploadAvatar(file: File): Promise<string> {
    // Validate file before uploading
    const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > MAX_AVATAR_SIZE) {
        throw new Error('حجم الصورة أكبر من 5MB. يرجى اختيار صورة أصغر.');
    }
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        throw new Error('نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP, GIF');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
        API_ENDPOINTS.profile.avatar,
        formData
        // Note: Do NOT set Content-Type manually — axios auto-sets it with boundary for FormData
    );

    return response.data.data.url;
}
