export type RequestStatus = 'PENDING' | 'VERIFIED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export type RequestCategory =
    | 'HEALTH'
    | 'EDUCATION'
    | 'FOOD'
    | 'HOUSING'
    | 'DEBT'
    | 'OTHER';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RequestDocument {
    id: string;
    type: string; // 'SHAHADA', 'ID', 'MEDICAL_REPORT'
    url: string;
    name: string;
}

export interface AidRequest {
    id: string;
    familyId: string; // User ID
    title: string;
    description: string;
    category: RequestCategory;
    urgency: UrgencyLevel;
    amountNeeded?: number; // Financial
    status: RequestStatus;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    documents: RequestDocument[];

    // For easy display
    authorName?: string;
    authorAvatar?: string;
}
