import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 min-h-[250px]", className)}>
            <div className="w-16 h-16 rounded-[20px] bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5">
                <Icon className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
