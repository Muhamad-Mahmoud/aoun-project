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
    about?: string;
    workAreas?: string[];
    establishedDate?: Date;
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
        position?: string;
    };
    documents?: {
        registrationCertificate?: string;
        taxCard?: string;
        other?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string; label: string }[];
}

export interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
    isLoading?: boolean;
    error?: string;
    config: ProfileFieldConfig;
}

export interface ProfileSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export interface AvatarUploadProps {
    currentImage?: string;
    onUpload: (file: File) => Promise<void>;
    isLoading?: boolean;
    type: 'avatar' | 'logo';
}
