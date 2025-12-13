"use client";

import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { AvatarUpload } from './AvatarUpload';

interface ProfileHeaderProps {
    name: string;
    subtitle?: string;
    currentImage?: string;
    onImageUpload: (file: File) => Promise<void>;
    onEditClick: () => void;
    isEditing: boolean;
    isUploadingImage?: boolean;
    type: 'avatar' | 'logo';
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    subtitle,
    currentImage,
    onImageUpload,
    onEditClick,
    isEditing,
    isUploadingImage = false,
    type
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8">
                <AvatarUpload
                    currentImage={currentImage}
                    onUpload={onImageUpload}
                    isLoading={isUploadingImage}
                    type={type}
                />

                <div className="flex-1 text-center md:text-right space-y-3">
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">{name}</h1>
                    {subtitle && (
                        <p className="text-xl text-white/90 font-medium">{subtitle}</p>
                    )}
                </div>

                <Button
                    variant={isEditing ? "outline" : "secondary"}
                    onClick={onEditClick}
                    className="h-12 px-6 bg-white text-primary hover:bg-white/90 border-2 border-white/20 shadow-lg"
                >
                    {isEditing ? (
                        <>
                            <X className="w-5 h-5 ml-2" />
                            إلغاء التعديل
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-5 h-5 ml-2" />
                            تعديل البيانات
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
