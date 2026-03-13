/**
 * Associations API Service
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';
import type {
    AssociationProfileDto,
    UpdateAssociationProfileRequest,
    RequestListItemDto,
    RequestDetailDto,
    AcceptRequestDto,
    RejectRequestDto,
    AssociationRequestFilter,
    PagedResult,
} from '../types';
import { RequestStatus } from '../types';

/**
 * Profile endpoints
 */
export async function getAssociationProfile(): Promise<AssociationProfileDto> {
    const response = await apiClient.get<any>(
        API_ENDPOINTS.association.profile
    );
    // Handle both {data: T} and {value: T} patterns
    const result = response.data.value || response.data.data || response.data;
    return result;
}

export async function updateAssociationProfile(data: UpdateAssociationProfileRequest): Promise<void> {
    await apiClient.put<ApiResponse<void>>(
        API_ENDPOINTS.association.profile,
        data
    );
}

/**
 * Requests endpoints
 */
export async function getAssociationRequests(filter?: AssociationRequestFilter): Promise<PagedResult<RequestListItemDto>> {
    const params: any = { ...filter };
    
    // Convert numeric status to string if needed (backend expects string like 'Pending')
    if (typeof params.status === 'number') {
        const statusEntry = Object.entries(RequestStatus).find(([_, value]) => value === params.status);
        if (statusEntry) {
            params.status = statusEntry[0];
        }
    }
    
    try {
        const response = await apiClient.get<any>(
            API_ENDPOINTS.association.requests,
            { params }
        );
        
        // Handle result pattern: {value: T, isSuccess: true} or {data: T, success: true}
        const result = response.data.value || response.data.data || response.data;
        
        // Normalize status in items if they are strings (some backend endpoints return strings, others numbers)
        if (result && result.items && Array.isArray(result.items)) {
            result.items = result.items.map((item: any) => {
                if (typeof item.status === 'string') {
                    const statusKey = item.status as keyof typeof RequestStatus;
                    if (RequestStatus[statusKey] !== undefined) {
                        item.status = RequestStatus[statusKey];
                    }
                }
                return item;
            });
        }
        
        return result; 
    } catch (err: any) {
        console.error('[API] Error fetching requests:', err.response?.data || err.message);
        throw err;
    }
}

export async function getAssociationRequestById(id: string | number): Promise<RequestDetailDto> {
    const response = await apiClient.get<any>(
        API_ENDPOINTS.association.requestById(id)
    );
    const result = response.data.value || response.data.data || response.data;
    
    // Normalize status if it's a string (e.g. "Pending" -> 0)
    if (result && typeof result.status === 'string') {
        const statusKey = result.status as keyof typeof RequestStatus;
        if (RequestStatus[statusKey] !== undefined) {
            result.status = RequestStatus[statusKey];
        }
    }
    
    return result;
}

export async function acceptAssociationRequest(id: string | number, data: AcceptRequestDto): Promise<void> {
    await apiClient.post<ApiResponse<void>>(
        API_ENDPOINTS.association.acceptRequest(id),
        data
    );
}

export async function rejectAssociationRequest(id: string | number, data: RejectRequestDto): Promise<void> {
    await apiClient.post<ApiResponse<void>>(
        API_ENDPOINTS.association.rejectRequest(id),
        data
    );
}

/**
 * Dashboard endpoints
 */
export async function getAssociationUndertakings(): Promise<any> {
    try {
        const response = await apiClient.get<any>(
            API_ENDPOINTS.dashboard.association.undertakings
        );
        // The backend returns { value: {...}, isSuccess: true }
        return response.data.value || response.data.data || response.data;
    } catch (err: any) {
        console.error('[API] Undertakings error:', err.response?.data || err.message);
        throw err;
    }
}

export async function getAssociationAnalytics(): Promise<any> {
    try {
        const response = await apiClient.get<any>(
            API_ENDPOINTS.dashboard.association.analytics
        );
        // The backend returns { value: {...}, isSuccess: true }
        return response.data.value || response.data.data || response.data;
    } catch (err: any) {
        console.error('[API] Analytics error:', err.response?.data || err.message);
        throw err;
    }
}
