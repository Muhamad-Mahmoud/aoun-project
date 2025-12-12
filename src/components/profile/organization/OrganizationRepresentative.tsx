"use client";

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { ProfileField } from '../shared/ProfileField';
import { EditableField } from '../shared/EditableField';
import { OrganizationProfile, ProfileFieldConfig } from '@/types/profile';

interface OrganizationRepresentativeProps {
    representative: OrganizationProfile['representative'];
    isEditing?: boolean;
}

export const OrganizationRepresentative: React.FC<OrganizationRepresentativeProps> = ({
    representative,
    isEditing = false
}) => {
    const [editedData, setEditedData] = useState(representative);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (field: keyof typeof representative, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFieldSave = async (field: keyof typeof representative) => {
        console.log(`Saving ${field}:`, editedData[field]);
    };

    const handleFieldCancel = (field: keyof typeof representative) => {
        setEditedData(prev => ({ ...prev, [field]: representative[field] }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const fieldConfigs: Record<string, ProfileFieldConfig> = {
        name: { id: 'rep-name', label: 'اسم المسؤول', type: 'text', required: true },
        position: { id: 'rep-position', label: 'المنصب', type: 'text', required: false },
        phone: { id: 'rep-phone', label: 'رقم الهاتف', type: 'tel', required: true },
        email: { id: 'rep-email', label: 'البريد الإلكتروني', type: 'email', required: true }
    };

    return (
        <ProfileCard>
            <ProfileSection
                title="بيانات المسؤول"
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
                            {editedData.position !== undefined && (
                                <EditableField
                                    value={editedData.position || ''}
                                    onChange={(val) => handleFieldChange('position', val)}
                                    onSave={() => handleFieldSave('position')}
                                    onCancel={() => handleFieldCancel('position')}
                                    isEditing={true}
                                    error={errors.position}
                                    config={fieldConfigs.position}
                                />
                            )}
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
                        </>
                    ) : (
                        <>
                            <ProfileField label="اسم المسؤول" value={representative.name} />
                            {representative.position && (
                                <ProfileField label="المنصب" value={representative.position} />
                            )}
                            <ProfileField label="رقم الهاتف" value={representative.phone} />
                            <ProfileField label="البريد الإلكتروني" value={representative.email} />
                        </>
                    )}
                </div>
            </ProfileSection>
        </ProfileCard>
    );
};
