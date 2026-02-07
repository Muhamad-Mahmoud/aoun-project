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
        API_ENDPOINTS.organization.get(orgId)
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
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
        API_ENDPOINTS.profile.avatar,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data.url;
}
