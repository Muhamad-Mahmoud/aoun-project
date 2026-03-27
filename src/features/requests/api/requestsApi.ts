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

    // Map camelCase to PascalCase for API compatibility
    const fieldMapping: Record<string, string> = {
        requestType: 'RequestType',
        otherRequestType: 'OtherRequestType',
        description: 'Description',
        isWorking: 'IsWorking',
        workingType: 'WorkingType',
        employmentType: 'EmploymentType',
        jobTitle: 'JobTitle',
        company: 'Company',
        salaryMonthly: 'SalaryMonthly',
        workDescription: 'WorkDescription',
        unEmploymentReason: 'UnEmploymentReason',
        hasInsurance: 'HasInsurance',
        insuranceType: 'InsuranceType',
        hasDisability: 'HasDisability',
        disabilityType: 'DisabilityType',
        hasChronicDisease: 'HasChronicDisease',
        chronicDiseaseType: 'ChronicDiseaseType',
        medicalCostMonthly: 'MedicalCostMonthly',
        housingType: 'HousingType',
        rentMonthly: 'RentMonthly',
        hasCar: 'HasCar',
        monthlyExpenses: 'MonthlyExpenses',
        utilitiesMonthly: 'UtilitiesMonthly',
        registeredSocialSupport: 'RegisteredSocialSupport',
        socialSupportAmount: 'SocialSupportAmount',
        otherAidProviders: 'OtherAidProviders',
        otherAidType: 'OtherAidType',
        otherAidAmount: 'OtherAidAmount',
        location: 'Location',
        yearsAtJob: 'YearsAtJob',
        estimatedIncomeMonthly: 'EstimatedIncomeMonthly',
        isLookingForJob: 'IsLookingForJob',
        needsTraining: 'NeedsTraining',
        workLocation: 'WorkLocation',
        hasOtherCommitments: 'HasOtherCommitments',
        otherCommitmentsType: 'OtherCommitmentsType',
        otherCommitmentsAmount: 'OtherCommitmentsAmount',
        householdMonthlySpending: 'HouseholdMonthlySpending',
        annualPayment: 'AnnualPayment',
    };

    // Log the raw payload for deep debugging only in development
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [DEBUG] RAW PAYLOAD:', JSON.stringify(payload, null, 2));
    }

    Object.entries(payload).forEach(([key, value]) => {
        if (key === 'attachments') return;
        
        const apiFieldName = fieldMapping[key] || (key.charAt(0).toUpperCase() + key.slice(1));
        
        // --- 1. MANDATORY FIELDS (STRICT SWAGGER ALIGNMENT) ---
        // These are the ONLY 10 fields marked 'required' in the Swagger POST /api/Requests DTO.
        const mandatoryApiFields = [
            'Description', 'HasCar', 'HasChronicDisease', 'HasDisability', 
            'HasInsurance', 'HasOtherCommitments', 'HousingType', 
            'IsWorking', 'RegisteredSocialSupport', 'RequestType'
        ];

        if (mandatoryApiFields.includes(apiFieldName)) {
            // Send as-is
            const valToSend = (value === null || value === undefined) ? "" : value.toString();
            formData.append(apiFieldName, valToSend);
            return;
        }

        // --- 2. SURGICAL FILTERING FOR OPTIONAL FIELDS ---
        // We only send purely optional fields if they have a non-default, non-empty value.
        // This avoids triggering database check constraints (e.g. Salary must be > 0).

        // Skip null/undefined/empty immediately for optional fields
        if (value === undefined || value === null || value === "") return;

        // Skip fields that are logically irrelevant based on master toggles
        const isWorking = payload.isWorking;
        if (!isWorking && [
            'workingType', 'employmentType', 'jobTitle', 'company', 
            'salaryMonthly', 'workDescription', 'workLocation', 'yearsAtJob'
        ].includes(key)) return;

        if (isWorking && (key === 'unEmploymentReason' || key === 'estimatedIncomeMonthly')) return;

        if (!payload.hasInsurance && key === 'insuranceType') return;
        if (!payload.hasDisability && key === 'disabilityType') return;
        if (!payload.hasChronicDisease && (key === 'chronicDiseaseType' || key === 'medicalCostMonthly')) return;
        
        if (payload.housingType !== "Rented" && key === 'rentMonthly') return; // Rented
        if (!payload.registeredSocialSupport && key === 'socialSupportAmount') return;
        if (!payload.hasOtherCommitments && (key === 'otherCommitmentsType' || key === 'otherCommitmentsAmount')) return;

        // --- 3. VALUE-BASED FILTERING ---
        // Allow 0 and false.
        if (value === null || value === undefined || value === "") return;

        formData.append(apiFieldName, value.toString());
    });

    // Append file attachments (Scale per Swagger lowercase)
    // The C# controller expects [FromForm] List<IFormFile>? attachments
    // So this key stays "attachments" without the "request." prefix
    if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file) => {
            formData.append('Attachments', file); // Use capitalized 'Attachments' as C# properties typically expect
        });
    }

    // Diagnostic logging of the final FormData only in dev
    if (process.env.NODE_ENV === 'development') {
        console.log('📤 [DEBUG] FINAL FORMDATA BEING SENT:');
        formData.forEach((val, key) => console.log(`  - ${key}: ${val instanceof File ? `[File] ${val.name}` : val}`));
    }

    try {
        const response = await apiClient.post<ApiResponse<AidRequest>>(
            API_ENDPOINTS.requests.base,
            formData
        );
        return response.data.data;
    } catch (error: any) {
        // Deep diagnostic logging (Development only to avoid leaking details in Prod)
        const apiError = error as ApiError;
        
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ [CRITICAL] Request submission failed:', {
                message: apiError.message,
                statusCode: apiError.statusCode,
                errors: apiError.errors ? JSON.stringify(apiError.errors, null, 2) : 'None'
            });

            if (apiError.errors) {
                console.warn('Backend reported specific validation errors:', apiError.errors);
            }
        }

        // If the backend has a specific inner exception message, it will be included in apiError.message
        let errorMessage = apiError.message || 'حدث خطأ أثناء حفظ البيانات.';

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
