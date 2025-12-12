"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileSectionProps } from '@/types/profile';

export const ProfileSection: React.FC<ProfileSectionProps> = ({
    title,
    icon,
    children,
    collapsible = false,
    defaultOpen = true
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "flex items-center justify-between pb-3 border-b-2 border-primary/10",
                    collapsible && "cursor-pointer hover:border-primary/20 transition-colors"
                )}
                onClick={() => collapsible && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <div className="text-primary [&>svg]:w-5 [&>svg]:h-5">
                                {icon}
                            </div>
                        </div>
                    )}
                    <h3 className="text-xl font-black text-foreground">{title}</h3>
                </div>
                {collapsible && (
                    <button type="button" className="text-muted-foreground hover:text-primary transition-colors p-2">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {(!collapsible || isOpen) && (
                <div className="space-y-4 pt-2">
                    {children}
                </div>
            )}
        </div>
    );
};
