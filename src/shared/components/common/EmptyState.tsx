// Reusable Empty State Component
"use client";

import { cn } from "@/shared/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    actionIcon?: LucideIcon;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    actionIcon: ActionIcon,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("p-16 text-center border-dashed border-2 rounded-lg", className)}>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
                {title}
            </h3>
            <p className="text-muted-foreground mb-6">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Button size="lg" className="shadow-xl shadow-primary/20" asChild>
                    <Link href={actionHref}>
                        {ActionIcon && <ActionIcon className="w-5 h-5 ms-2" />}
                        {actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}

