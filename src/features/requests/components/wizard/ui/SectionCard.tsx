"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

interface SectionCardProps {
    title?: string;
    icon?: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    children: React.ReactNode;
    className?: string;
}

export function SectionCard({
    title,
    icon: Icon,
    iconColor = "text-warm-green",
    iconBg = "bg-warm-green/10",
    children,
    className,
}: SectionCardProps) {
    return (
        <div className={cn(
            "bg-slate-50/60 rounded-2xl border border-slate-100 p-4 sm:p-5",
            className
        )}>
            {(title || Icon) && (
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
                    {Icon && (
                        <span className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                            iconBg, iconColor
                        )}>
                            <Icon className="w-3.5 h-3.5" />
                        </span>
                    )}
                    {title && (
                        <h4 className="text-[14px] font-black text-slate-800 leading-none">{title}</h4>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
