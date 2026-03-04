/**
 * Requests API Service
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type { ApiResponse, ApiError } from '@/lib/api/types';
import { logger } from '@/lib/logger';
import type {
    AidRequest,
    CreateAidRequestPayload,
    RequestDetailResponse,
    RequestFilter,
    PagedResponse
} from '../types';

export async function createRequest(payload: CreateAidRequestPayload): Promise<AidRequest> {
    const formData = new FormData();

    // Append regular fields (convert camelCase → PascalCase for ASP.NET)
    Object.entries(payload).forEach(([key, value]) => {
        if (key === 'attachments') return;
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (value !== undefined && value !== null && value !== '') {
            formData.append(pascalKey, typeof value === 'boolean' ? value.toString() : String(value));
        }
    });

    // Append file attachments
    if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file) => {
            formData.append('attachments', file);
        });
    }

    try {
        const response = await apiClient.post<ApiResponse<AidRequest>>(
            API_ENDPOINTS.requests.base,
            formData
        );
        return response.data.data;
    } catch (error: unknown) {
        logger.error('Request submission failed', error);

        const apiError = error as ApiError;
        let errorMessage = 'حدث خطأ أثناء حفظ البيانات.';

        if (apiError.statusCode === 400 && apiError.errors) {
            const errors = apiError.errors;
            const allErrors = Object.entries(errors)
                .map(([field, msgs]) => `- ${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('\n');
            if (allErrors) {
                errorMessage = "فشل التحقق من البيانات:\n" + allErrors;
            }
        } else if (apiError.message) {
            errorMessage = apiError.message;
        }

        throw new Error(errorMessage);
    }
}

export async function getRequests(filter?: RequestFilter): Promise<PagedResponse<AidRequest>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<AidRequest>>>(
        API_ENDPOINTS.requests.base,
        { params: filter }
    );
    return response.data.data;
}

export async function getRequestById(id: string | number): Promise<RequestDetailResponse> {
    const response = await apiClient.get<ApiResponse<RequestDetailResponse>>(
        API_ENDPOINTS.requests.getById(id)
    );
    return response.data.data;
}

export async function cancelRequest(id: string | number): Promise<void> {
    await apiClient.patch(
        API_ENDPOINTS.requests.cancel(id)
    );
}
