// ===== Attachment DTO =====
export interface RequestAttachmentDto {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    uploadedAt: string;
}

// ===== Association that handled the request =====
export interface AssociationBasicDto {
    id: number;
    name: string;
    email: string;
}

// ===== Nested DTOs from Family profile =====
export interface EmploymentDataDto {
    isWorking?: boolean;
    workingType?: number;
    employmentType?: number;
    jobTitle?: string;
    company?: string;
    salaryMonthly?: number;
    workDescription?: string;
    workLocation?: string;
    yearsAtJob?: number;
    isLookingForJob?: boolean;
    needsTraining?: boolean;
    estimatedIncomeMonthly?: number;
    unEmploymentReason?: string;
}

export interface HealthDataDto {
    hasInsurance?: boolean;
    insuranceType?: string;
    hasDisability?: boolean;
    disabilityType?: string;
    hasChronicDisease?: boolean;
    chronicDiseaseType?: string;
    medicalCostMonthly?: number;
}

export interface LivingConditionDto {
    housingType?: number;
    hasCar?: boolean;
    rentMonthly?: number;
    monthlyExpenses?: number;
    utilitiesMonthly?: number;
    hasOtherCommitments?: boolean;
    otherCommitmentsType?: string;
    otherCommitmentsAmount?: number;
    householdMonthlySpending?: number;
    annualPayment?: number;
}

export interface SocialSupportDto {
    registeredSocialSupport?: boolean;
    socialSupportAmount?: number;
    otherAidProviders?: string;
    otherAidType?: string;
    otherAidAmount?: number;
}

// ===== Main Request Detail Response =====
export interface RequestDetailResponse {
    id: number;
    requestType: number;
    otherRequestType?: string;
    description: string;
    location?: string;
    status: number | string;
    createdAt: string;
    decisionAt?: string;
    needScore?: number;
    priorityScore?: number;
    predictedAssistanceType?: string;
    decisionReason?: string;
    priority?: string;
    attachmentCount: number;
    attachments: RequestAttachmentDto[];
    handledBy?: AssociationBasicDto | null;
    employmentData?: EmploymentDataDto | null;
    healthData?: HealthDataDto | null;
    livingCondition?: LivingConditionDto | null;
    socialSupport?: SocialSupportDto | null;
}

// ===== List item (for GET /api/Requests) =====
export interface AidRequest {
    id: number | string;
    requestType?: number;
    description?: string;
    status: number | string;
    createdAt?: string;
    priority?: string;
    attachmentCount?: number;
    title?: string;
    location?: string;
    updatedAt?: string;
    documents?: RequestAttachmentDto[];
}

// ===== Create Request Payload =====
export interface CreateAidRequestPayload {
    requestType: number;
    otherRequestType?: string;
    description: string;
    isWorking: boolean;
    workingType?: number;
    employmentType?: number;
    jobTitle?: string;
    company?: string;
    location?: string;
    salaryMonthly?: number;
    workDescription?: string;
    workLocation?: string;
    yearsAtJob?: number;
    isLookingForJob?: boolean;
    needsTraining?: boolean;
    estimatedIncomeMonthly?: number;
    unEmploymentReason?: string;
    hasInsurance: boolean;
    insuranceType?: string;
    hasDisability: boolean;
    disabilityType?: string;
    hasChronicDisease: boolean;
    chronicDiseaseType?: string;
    medicalCostMonthly?: number;
    housingType: number;
    hasCar: boolean;
    rentMonthly?: number;
    monthlyExpenses?: number;
    utilitiesMonthly?: number;
    hasOtherCommitments: boolean;
    otherCommitmentsType?: string;
    otherCommitmentsAmount?: number;
    householdMonthlySpending?: number;
    annualPayment?: number;
    registeredSocialSupport: boolean;
    socialSupportAmount?: number;
    otherAidProviders?: string;
    otherAidType?: string;
    otherAidAmount?: number;
    attachments?: File[];
}

// ===== Filters & Pagination =====
export interface RequestFilter {
    pageNumber?: number;
    pageSize?: number;
    status?: string;
}

export interface PagedResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
