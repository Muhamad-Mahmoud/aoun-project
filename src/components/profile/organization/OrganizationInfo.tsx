"use client";

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { ProfileField } from '../shared/ProfileField';
import { EditableField } from '../shared/EditableField';
import { OrganizationProfile, ProfileFieldConfig } from '@/types/profile';
import { cn } from '@/lib/utils';

interface OrganizationInfoProps {
    profile: OrganizationProfile;
    isEditing?: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
        registered: {
            label: 'مسجلة',
            className: 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-2 border-secondary/30'
        },
        pending: {
            label: 'قيد المراجعة',
            className: 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-2 border-accent/30'
        },
        unregistered: {
            label: 'غير مسجلة',
            className: 'bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border-2 border-destructive/30'
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <span className={cn(
            "px-4 py-2 rounded-xl text-sm font-black shadow-sm",
            config.className
        )}>
            {config.label}
        </span>
    );
};

export const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ profile, isEditing = false }) => {
    const [editedData, setEditedData] = useState(profile);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (field: keyof OrganizationProfile, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFieldSave = async (field: keyof OrganizationProfile) => {
        console.log(`Saving ${field}:`, editedData[field]);
    };

    const handleFieldCancel = (field: keyof OrganizationProfile) => {
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
        name: { id: 'name', label: 'اسم الجمعية', type: 'text', required: true },
        legalName: { id: 'legalName', label: 'الاسم القانوني', type: 'text', required: true },
        registrationNumber: { id: 'registrationNumber', label: 'رقم التسجيل', type: 'text', required: true, disabled: true },
        governorate: { id: 'governorate', label: 'المحافظة', type: 'text', required: true },
        address: { id: 'address', label: 'العنوان', type: 'textarea', required: true },
        website: { id: 'website', label: 'الموقع الإلكتروني', type: 'text', required: false }
    };

    return (
        <ProfileCard>
            <ProfileSection
                title="معلومات الجمعية"
                icon={<Building2 />}
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
                                value={editedData.legalName}
                                onChange={(val) => handleFieldChange('legalName', val)}
                                onSave={() => handleFieldSave('legalName')}
                                onCancel={() => handleFieldCancel('legalName')}
                                isEditing={true}
                                error={errors.legalName}
                                config={fieldConfigs.legalName}
                            />
                            <EditableField
                                value={editedData.registrationNumber}
                                onChange={(val) => handleFieldChange('registrationNumber', val)}
                                onSave={() => handleFieldSave('registrationNumber')}
                                onCancel={() => handleFieldCancel('registrationNumber')}
                                isEditing={true}
                                error={errors.registrationNumber}
                                config={fieldConfigs.registrationNumber}
                            />
                            <ProfileField
                                label="حالة التسجيل"
                                value={<StatusBadge status={profile.registrationStatus} />}
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
                            {profile.establishedDate && (
                                <ProfileField
                                    label="تاريخ التأسيس"
                                    value={new Date(profile.establishedDate).toLocaleDateString('ar-EG')}
                                />
                            )}
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
                            {editedData.website && (
                                <div className="md:col-span-2">
                                    <EditableField
                                        value={editedData.website}
                                        onChange={(val) => handleFieldChange('website', val)}
                                        onSave={() => handleFieldSave('website')}
                                        onCancel={() => handleFieldCancel('website')}
                                        isEditing={true}
                                        error={errors.website}
                                        config={fieldConfigs.website}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <ProfileField label="اسم الجمعية" value={profile.name} />
                            <ProfileField label="الاسم القانوني" value={profile.legalName} />
                            <ProfileField label="رقم التسجيل" value={profile.registrationNumber} />
                            <ProfileField label="حالة التسجيل" value={<StatusBadge status={profile.registrationStatus} />} />
                            <ProfileField label="المحافظة" value={profile.governorate} />
                            {profile.establishedDate && (
                                <ProfileField
                                    label="تاريخ التأسيس"
                                    value={new Date(profile.establishedDate).toLocaleDateString('ar-EG')}
                                />
                            )}
                            <ProfileField label="العنوان" value={profile.address} className="md:col-span-2" vertical />
                            {profile.website && (
                                <ProfileField
                                    label="الموقع الإلكتروني"
                                    value={
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-semibold"
                                        >
                                            {profile.website}
                                        </a>
                                    }
                                    className="md:col-span-2"
                                />
                            )}
                        </>
                    )}
                </div>
            </ProfileSection>
        </ProfileCard>
    );
};
