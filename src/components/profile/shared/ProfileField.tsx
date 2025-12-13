import React from 'react';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';

interface ProfileFieldProps {
    label: string;
    value: string | React.ReactNode;
    className?: string;
    vertical?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    value,
    className,
    vertical = false
}) => {
    return (
        <div className={cn(
            "p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors",
            vertical ? "space-y-2" : "flex items-center justify-between gap-4",
            className
        )}>
            <Label className="text-sm font-bold text-foreground whitespace-nowrap">
                {label}
            </Label>
            <div className={cn(
                "text-base text-muted-foreground font-medium",
                !vertical && "text-left"
            )}>
                {value || '-'}
            </div>
        </div>
    );
};
