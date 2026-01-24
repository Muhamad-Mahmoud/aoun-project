// Reusable Step Indicator Component
"use client";

import { cn } from "@/shared/utils";

export interface Step {
    label: string;
    done: boolean;
}

interface StepIndicatorProps {
    steps: Step[];
    className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
    return (
        <div className={cn("grid gap-2 sm:gap-4", className)} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step, i) => (
                <div
                    key={i}
                    className={cn(
                        "text-center py-3 px-2 rounded-lg border-2 transition-all",
                        step.done
                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "border-border bg-background text-muted-foreground"
                    )}
                >
                    <div className="text-xs font-bold">{step.label}</div>
                </div>
            ))}
        </div>
    );
}

