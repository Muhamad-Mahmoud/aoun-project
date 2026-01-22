/**
 * Profile Types
 */

export type ProfileType = 'user' | 'organization';

export interface UserProfile {
    id: string;
    name: string;
    nationalId: string;
    phone: string;
    email: string;
    governorate: string;
    address: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrganizationProfile {
    id: string;
    name: string;
    legalName: string;
    registrationNumber: string;
    registrationStatus: 'registered' | 'pending' | 'unregistered';
    governorate: string;
    address: string;
    logo?: string;
    about: string;
    workAreas: string[];
    establishedDate: Date;
    website?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    representative: {
        name: string;
        phone: string;
        email: string;
        position: string;
    };
    documents: {
        registrationCertificate?: string;
        taxCard?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
