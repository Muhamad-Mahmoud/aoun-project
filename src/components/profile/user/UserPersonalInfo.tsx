"use client";

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { ProfileField } from '../shared/ProfileField';
import { EditableField } from '../shared/EditableField';
import { UserProfile, ProfileFieldConfig } from '@/types/profile';
import { Button } from '@/components/shadcn/button';

interface UserPersonalInfoProps {
    profile: UserProfile;
    isEditing?: boolean;
}

export const UserPersonalInfo: React.FC<UserPersonalInfoProps> = ({ profile, isEditing = false }) => {
    const [editedData, setEditedData] = useState(profile);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (field: keyof UserProfile, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFieldSave = async (field: keyof UserProfile) => {
        // TODO: Implement API call to save individual field
        console.log(`Saving ${field}:`, editedData[field]);
    };

    const handleFieldCancel = (field: keyof UserProfile) => {
        setEditedData(prev => ({ ...prev, [field]: profile[field] }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const fieldConfigs: Record<string, ProfileFieldConfig> = {
        name: { id: 'name', label: 'الاسم الكامل', type: 'text', required: true },
        nationalId: { id: 'nationalId', label: 'الرقم القومي', type: 'text', required: true, disabled: true },
        phone: { id: 'phone', label: 'رقم الهاتف', type: 'tel', required: true },
        email: { id: 'email', label: 'البريد الإلكتروني', type: 'email', required: true },
        governorate: { id: 'governorate', label: 'المحافظة', type: 'text', required: true },
        address: { id: 'address', label: 'العنوان', type: 'textarea', required: true }
    };

    return (
        <ProfileCard>
            <ProfileSection
                title="المعلومات الشخصية"
                icon={<User />}
            >
                <div className="grid md:grid-cols-2 gap-4">
                    {isEditing ? (
                        <>
                            <EditableField
                                value={editedData.name}
                                onChange={(val) => handleFieldChange('name', val)}
                                onSave={() => handleFieldSave('name')}
                                onCancel={() => handleFieldCancel('name')}
                                isEditing={true}
                                error={errors.name}
                                config={fieldConfigs.name}
                            />
                            <EditableField
                                value={editedData.nationalId}
                                onChange={(val) => handleFieldChange('nationalId', val)}
                                onSave={() => handleFieldSave('nationalId')}
                                onCancel={() => handleFieldCancel('nationalId')}
                                isEditing={true}
                                error={errors.nationalId}
                                config={fieldConfigs.nationalId}
                            />
                            <EditableField
                                value={editedData.phone}
                                onChange={(val) => handleFieldChange('phone', val)}
                                onSave={() => handleFieldSave('phone')}
                                onCancel={() => handleFieldCancel('phone')}
                                isEditing={true}
                                error={errors.phone}
                                config={fieldConfigs.phone}
                            />
                            <EditableField
                                value={editedData.email}
                                onChange={(val) => handleFieldChange('email', val)}
                                onSave={() => handleFieldSave('email')}
                                onCancel={() => handleFieldCancel('email')}
                                isEditing={true}
                                error={errors.email}
                                config={fieldConfigs.email}
                            />
                            <EditableField
                                value={editedData.governorate}
                                onChange={(val) => handleFieldChange('governorate', val)}
                                onSave={() => handleFieldSave('governorate')}
                                onCancel={() => handleFieldCancel('governorate')}
                                isEditing={true}
                                error={errors.governorate}
                                config={fieldConfigs.governorate}
                            />
                            <div className="md:col-span-2">
                                <EditableField
                                    value={editedData.address}
                                    onChange={(val) => handleFieldChange('address', val)}
                                    onSave={() => handleFieldSave('address')}
                                    onCancel={() => handleFieldCancel('address')}
                                    isEditing={true}
                                    error={errors.address}
                                    config={fieldConfigs.address}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <ProfileField label="الاسم الكامل" value={profile.name} />
                            <ProfileField label="الرقم القومي" value={profile.nationalId} />
                            <ProfileField label="رقم الهاتف" value={profile.phone} />
                            <ProfileField label="البريد الإلكتروني" value={profile.email} />
                            <ProfileField label="المحافظة" value={profile.governorate} />
                            <ProfileField label="العنوان" value={profile.address} className="md:col-span-2" vertical />
                        </>
                    )}
                </div>
            </ProfileSection>
        </ProfileCard>
    );
};
