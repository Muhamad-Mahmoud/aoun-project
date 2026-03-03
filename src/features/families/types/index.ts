/**
 * Families Types
 */

export interface FamilyMemberDto {
    id: number;
    firstName: string;
    lastName: string;
    relation: string;
    gender: string;
    age: number;
    nationalId: string;
    birthDate: string;
}

export interface EmploymentDataDto {
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
}

export interface LivingConditionDto {
    housingType: number;
    hasCar: boolean;
    rentMonthly?: number;
    monthlyExpenses: number;
    utilitiesMonthly: number;
    hasOtherCommitments?: boolean;
    otherCommitmentsType?: string;
    otherCommitmentsAmount?: number;
    householdMonthlySpending: number;
    annualPayment: number;
}

export interface HealthDataDto {
    hasInsurance: boolean;
    insuranceType?: string;
    hasDisability: boolean;
    disabilityType?: string;
    hasChronicDisease: boolean;
    chronicDiseaseType?: string;
    medicalCostMonthly?: number;
}

export interface SocialSupportDto {
    registeredSocialSupport: boolean;
    socialSupportAmount?: number;
    otherAidProviders?: string;
    otherAidType?: string;
    otherAidAmount?: number;
}

export interface FamilyProfile {
    id: number;
    headNationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    governorate: string;
    city: string;
    neighborhood?: string;
    isVerified: boolean;
    verificationDate?: string;
    familyMembers: FamilyMemberDto[];
    employmentData?: EmploymentDataDto | null;
    livingCondition?: LivingConditionDto | null;
    healthData?: HealthDataDto | null;
    socialSupport?: SocialSupportDto | null;
}

export interface UpdateFamilyProfilePayload {
    headNationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    governorate: string;
    city: string;
    neighborhood?: string;
}

export interface FamilyStatistics {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    totalAidReceived: number;
}
