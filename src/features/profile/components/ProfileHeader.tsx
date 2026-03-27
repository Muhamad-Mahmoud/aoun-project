/**
 * Profile Header Component
 */

"use client";

import React from 'react';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Camera, Edit2, Loader2 } from 'lucide-react';

interface ProfileHeaderProps {
    name: string;
    subtitle?: string;
    currentImage?: string;
    onImageUpload: (file: File) => void;
    onEditClick: () => void;
    isEditing: boolean;
    isUploadingImage: boolean;
    type?: 'avatar' | 'logo';
}

export function ProfileHeader({
    name,
    subtitle,
    currentImage,
    onImageUpload,
    onEditClick,
    isEditing,
    isUploadingImage,
    type = 'avatar'
}: ProfileHeaderProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('');

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm gap-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 w-full sm:w-auto text-center sm:text-start">
                <div className="relative">
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-white shadow-md">
                        <AvatarImage src={currentImage} alt={name} className="object-cover" />
                        <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>

                    <label className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-xl cursor-pointer hover:bg-primary/90 transition-all shadow-lg active:scale-95 group">
                        {isUploadingImage ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        )}
                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                            disabled={isUploadingImage}
                            aria-label="تغيير الصورة الشخصية"
                        />
                    </label>
                </div>

                <div className="mt-2 sm:mt-4">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{name}</h1>
                    {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
                </div>
            </div>

            <Button
                variant={isEditing ? "outline" : "default"}
                onClick={onEditClick}
                className="w-full sm:w-auto rounded-xl h-12 px-6 font-bold shadow-sm relative z-10 shrink-0 border-slate-200"
            >
                <Edit2 className="h-4 w-4 ml-2" />
                {isEditing ? 'إلغاء التعديل' : 'تعديل الملف'}
            </Button>
        </div>
    );
}
