"use client";

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { logger } from '@/lib/logger';
import { ProfileType, UserProfile, OrganizationProfile } from '@/features/profile/types';
import {
    ProfileHeader,
    UserPersonalInfo,
    UserSecuritySettings,
    OrganizationInfo,
    OrganizationRepresentative,
    OrganizationDocuments
} from '@/features/profile/components';
import { useProfileEdit, useAvatarUpload } from '@/features/profile/hooks';

// Mock data - Replace with actual API calls
const mockUserProfile: UserProfile = {
    id: '1',
    name: 'محمد أحمد علي سالم',
    nationalId: '29501011234567',
    phone: '+201234567890',
    email: 'mohamed@example.com',
    governorate: 'القاهرة',
    address: 'شارع النيل، المعادي، القاهرة',
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
};

const mockOrgProfile: OrganizationProfile = {
    id: '1',
    name: 'مؤسسة الخير للتنمية',
    legalName: 'مؤسسة الخير للتنمية المجتمعية',
    registrationNumber: 'ORG-2024-001',
    registrationStatus: 'registered',
    governorate: 'الجيزة',
    address: 'شارع الهرم، الجيزة',
    logo: undefined,
    about: 'مؤسسة خيرية تهدف إلى تقديم الدعم للأسر المحتاجة في مصر من خلال برامج متنوعة تشمل الرعاية الصحية والتعليم والإغاثة.',
    workAreas: ['الرعاية الصحية', 'التعليم', 'الإغاثة', 'كفالة الأيتام'],
    establishedDate: new Date('2020-01-15'),
    website: 'https://example.org',
    socialMedia: {
        facebook: 'https://facebook.com/example',
        twitter: 'https://twitter.com/example',
        instagram: 'https://instagram.com/example'
    },
    representative: {
        name: 'أحمد محمود السيد',
        phone: '+201098765432',
        email: 'ahmed@example.org',
        position: 'المدير التنفيذي'
    },
    documents: {
        registrationCertificate: undefined,
        taxCard: undefined
    },
    createdAt: new Date(),
    updatedAt: new Date()
};

export default function ProfilePage() {
    const params = useParams();
    const type = (params?.type as ProfileType) || null;

    const { isEditing, startEditing, cancelEditing } = useProfileEdit();
    const { isUploading, uploadAvatar, uploadError } = useAvatarUpload();
    const objectUrlRef = useRef<string | null>(null);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    // Validate type parameter
    if (!type || (type !== 'user' && type !== 'organization')) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground">نوع الملف الشخصي غير صحيح</h1>
                <p className="text-muted-foreground mt-2">يرجى اختيار نوع صحيح (user أو organization)</p>
            </div>
        );
    }

    const handleImageUpload = async (file: File) => {
        try {
            // Revoke previous object URL if exists
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }

            const result = await uploadAvatar(file, async (file) => {
                // TODO: Implement actual upload logic
                logger.debug('Uploading profile image', { fileName: file.name, fileSize: file.size, fileType: file.type });
                const objectUrl = URL.createObjectURL(file);
                objectUrlRef.current = objectUrl;
                return objectUrl;
            });

            if (!result && uploadError) {
                logger.error('Image upload failed', new Error(uploadError));
            }
        } catch (error) {
            logger.error('Image upload error', error);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            cancelEditing();
        } else {
            startEditing();
        }
    };

    if (type === 'user') {
        return (
            <div className="space-y-6">
                <ProfileHeader
                    name={mockUserProfile.name}
                    subtitle={mockUserProfile.email}
                    currentImage={mockUserProfile.avatar}
                    onImageUpload={handleImageUpload}
                    onEditClick={handleEditToggle}
                    isEditing={isEditing}
                    isUploadingImage={isUploading}
                    type="avatar"
                />

                <UserPersonalInfo profile={mockUserProfile} isEditing={isEditing} />
                <UserSecuritySettings />
            </div>
        );
    }

    if (type === 'organization') {
        return (
            <div className="space-y-6">
                <ProfileHeader
                    name={mockOrgProfile.name}
                    subtitle={mockOrgProfile.legalName}
                    currentImage={mockOrgProfile.logo}
                    onImageUpload={handleImageUpload}
                    onEditClick={handleEditToggle}
                    isEditing={isEditing}
                    isUploadingImage={isUploading}
                    type="logo"
                />

                <OrganizationInfo profile={mockOrgProfile} isEditing={isEditing} />
                <OrganizationRepresentative representative={mockOrgProfile.representative} isEditing={isEditing} />
                <OrganizationDocuments documents={mockOrgProfile.documents} />
            </div>
        );
    }

    return (
        <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground">نوع الملف الشخصي غير صحيح</h1>
            <p className="text-muted-foreground mt-2">يرجى اختيار نوع صحيح (user أو organization)</p>
        </div>
    );
}
