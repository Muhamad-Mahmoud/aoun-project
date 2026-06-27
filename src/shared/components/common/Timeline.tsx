// Reusable Timeline Component
"use client";

import { cn } from "@/shared/utils";

export interface TimelineItem {
    text: string;
    time: string;
    type: "success" | "info" | "default";
}

interface TimelineProps {
    items: TimelineItem[];
    className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
    const getTypeStyles = (type: TimelineItem["type"]) => {
        switch (type) {
            case "success":
                return "bg-primary/50 ring-4 ring-green-100";
            case "info":
                return "bg-primary ring-4 ring-blue-100";
            default:
                return "bg-gray-400 ring-4 ring-gray-100";
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {items.map((item, i) => (
                <div key={i} className="flex flex-row-reverse gap-4 relative">
                    <div className="flex flex-col items-center">
                        <div className={cn("w-3 h-3 rounded-full z-10", getTypeStyles(item.type))} />
                        {i !== items.length - 1 && (
                            <div className="w-0.5 h-full bg-border absolute top-3" />
                        )}
                    </div>
                    <div className="pb-6 last:pb-0 text-end">
                        <p className="font-semibold text-slate-800 text-sm">{item.text}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

