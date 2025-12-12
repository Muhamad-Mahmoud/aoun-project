"use client";

import React, { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AvatarUploadProps } from '@/types/profile';
import { Button } from '@/components/ui/button';

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
    currentImage,
    onUpload,
    isLoading = false,
    type
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('يرجى اختيار صورة');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        await onUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const displayImage = preview || currentImage;
    const size = type === 'avatar' ? 'w-32 h-32' : 'w-40 h-40';

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className={cn(
                    size,
                    "relative rounded-full border-4 border-primary/20 overflow-hidden bg-muted group cursor-pointer",
                    isDragging && "border-primary scale-105",
                    isLoading && "opacity-50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !isLoading && fileInputRef.current?.click()}
            >
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={type === 'avatar' ? 'صورة شخصية' : 'شعار الجمعية'}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Upload className="w-12 h-12" />
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                }}
                disabled={isLoading}
            />

            <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                    {type === 'avatar' ? 'الصورة الشخصية' : 'شعار الجمعية'}
                </p>
                <p className="text-xs text-muted-foreground">
                    اسحب وأفلت أو انقر للرفع (حد أقصى 5 ميجابايت)
                </p>
            </div>
        </div>
    );
};
