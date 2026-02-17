/**
 * Families API Service
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';
import type { FamilyProfile, FamilyStatistics, UpdateFamilyProfilePayload } from '../types';

export async function getFamilyProfile(): Promise<FamilyProfile> {
    const response = await apiClient.get<ApiResponse<FamilyProfile>>(
        API_ENDPOINTS.families.profile
    );
    return response.data.data;
}

export async function updateFamilyProfile(data: UpdateFamilyProfilePayload): Promise<FamilyProfile> {
    const response = await apiClient.put<ApiResponse<FamilyProfile>>(
        API_ENDPOINTS.families.profile,
        data
    );
    return response.data.data;
}

export async function getFamilyStatistics(): Promise<FamilyStatistics> {
    const response = await apiClient.get<ApiResponse<FamilyStatistics>>(
        API_ENDPOINTS.families.statistics
    );
    return response.data.data;
}
