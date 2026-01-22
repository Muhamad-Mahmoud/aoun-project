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
        <div className="flex items-center justify-between p-6 bg-card rounded-lg border">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={currentImage} alt={name} />
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>

                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        {isUploadingImage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="h-4 w-4" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploadingImage}
                        />
                    </label>
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{name}</h1>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>
            </div>

            <Button
                variant={isEditing ? "outline" : "default"}
                onClick={onEditClick}
            >
                <Edit2 className="h-4 w-4 ml-2" />
                {isEditing ? 'إلغاء' : 'تعديل'}
            </Button>
        </div>
    );
}
