/**
 * Association API Types
 */

import { RequestAttachmentDto, EmploymentDataDto, HealthDataDto, LivingConditionDto, SocialSupportDto } from "@/features/requests/types";

// Enums as constants for Next.js compatibility
export const RequestStatus = {
    Pending: 0,
    InReview: 1,
    Approved: 2,
    Rejected: 3,
    Completed: 4,
    Cancelled: 5
} as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const AssistanceType = {
    Financial: 'Financial',
    Medical: 'Medical',
    Food: 'Food',
    Housing: 'Housing',
    Education: 'Education',
    Utilities: 'Utilities',
    Other: 'Other'
} as const;
export type AssistanceType = typeof AssistanceType[keyof typeof AssistanceType];

export const PriorityLevel = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    Critical: 'Critical'
} as const;
export type PriorityLevel = typeof PriorityLevel[keyof typeof PriorityLevel];

export interface Service {
    id: number;
    name: string;
    description?: string;
}

export interface Location {
    id: number;
    address: string;
    city: string;
    governorate: string;
}

export interface Phone {
    id: number;
    number: string;
    type?: string;
}

// DTOs for Profile

export interface AssociationProfileDto {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    capacity: number | null;
    coverageNotes: string | null;
    isActive: boolean;
    services: Service[];
    locations: Location[];
    phones: Phone[];
}

export interface UpdateAssociationProfileRequest {
    name: string;
    capacity: number | null;
    coverageNotes: string | null;
}

// Request Data from Family
export interface FamilyInfoDto {
    id: number;
    headNationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    neighborhood: string;
    familyName?: string;
    familyHeadName?: string;
    memberCount?: number;
}

// DTOs for Requests

export interface RequestListItemDto {
    id: number;
    requestType: AssistanceType;
    description: string;
    familyName: string;
    familyHeadName: string;
    createdAt: string;
    priorityLevel: PriorityLevel | null;
    needScore: number | null;
    status: RequestStatus;
    aiNeedLevel?: string | null;
    aiConfidence?: number | null;
    aiPredictionStatus?: string | null;
}

export interface RequestDetailDto {
    id: number;
    requestType: AssistanceType;
    otherRequestType: string | null;
    description: string;
    status: RequestStatus;
    createdAt: string;
    decisionAt: string | null;
    needScore: number | null;
    priorityScore: number | null;
    predictedAssistanceType: string | null;
    decisionReason: string | null;
    priority: PriorityLevel;
    attachmentCount: number;
    attachments: RequestAttachmentDto[];
    familyInfo: FamilyInfoDto | null;
    employmentData: EmploymentDataDto | null;
    healthData: HealthDataDto | null;
    livingCondition: LivingConditionDto | null;
    socialSupport: SocialSupportDto | null;
    familyMemberCount?: number;
    governorate?: string;
    city?: string;
    neighborhood?: string;
    aiMethod?: string | null;
    aiErrorMessage?: string | null;
}

// Action Requests
export interface AcceptRequestDto {
    acceptanceNotes: string;
    approvedAmount?: number;
    expectedDeliveryDate?: string;
}

export interface RejectRequestDto {
    rejectionReason: string;
}

// Filters & Pagination
export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface AssociationRequestFilter {
    pageNumber?: number;
    pageSize?: number;
    status?: string | number;
    requestType?: string;
    sortBy?: string;
}

// Dashboard DTOs
export interface TopNeedAreaDto {
    area: string;
    requestCount: number;
    percentage: number;
}

export interface AverageMetricsDto {
    averageProcessingDays: number;
    averageNeedScore: number;
    averageApprovedAmount: number;
}

export interface AssociationAnalyticsDto {
    totalRequestsReceived: number;
    totalRequestsApproved: number;
    totalRequestsRejected: number;
    totalRequestsInReview: number;
    approvalRate: number;
    requestsByType: Record<string, number>;
    requestsByMonth: Record<string, number>;
    topNeedAreas: TopNeedAreaDto[];
    averageMetrics: AverageMetricsDto;
    aiProcessingRate?: number;
    averageAiConfidence?: number;
    needLevelDistribution?: Record<string, number>;
}

export interface DashboardStatsDto extends AssociationAnalyticsDto {}
