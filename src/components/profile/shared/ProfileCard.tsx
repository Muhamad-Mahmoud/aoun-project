import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
    children: React.ReactNode;
    className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "p-6 rounded-2xl bg-white border border-border shadow-lg hover:shadow-xl transition-all duration-300",
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/[0.02] before:via-transparent before:to-accent/[0.02] before:pointer-events-none",
            className
        )}>
            {children}
        </div>
    );
};
