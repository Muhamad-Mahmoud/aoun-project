import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    accountType: "individual" | "organization";
}

const getStepLabel = (stepNumber: number, accountType: "individual" | "organization") => {
    if (accountType === "individual") {
        return stepNumber === 1 ? "البيانات الأساسية" : "تأمين الحساب";
    }
    return stepNumber === 1 ? "بيانات المسؤول"
        : stepNumber === 2 ? "بيانات الجمعية"
            : stepNumber === 3 ? "التراخيص"
                : "تأمين الحساب";
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, accountType }) => {
    return (
        <div className="w-full mb-8 px-2">
            <div className="relative flex justify-between items-center z-0">
                {/* Background Line */}
                <div className="absolute top-[20px] left-0 right-0 h-[3px] bg-muted/60 -z-10 rounded-full" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-[20px] right-0 h-[3px] bg-gradient-to-l from-primary to-blue-500 -z-10 rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                    }}
                />

                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={stepNumber} className="flex flex-col items-center gap-3 relative group cursor-default">
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 relative z-10",
                                    isCompleted
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-100"
                                        : isCurrent
                                            ? "bg-background text-primary ring-3 ring-primary/20 shadow-lg shadow-primary/20 scale-105 border-2 border-primary"
                                            : "bg-background text-muted-foreground border-2 border-muted hover:border-muted-foreground/50"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                                ) : (
                                    <span className="font-english">{stepNumber}</span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "text-[10px] font-semibold text-center transition-all duration-300 absolute -bottom-6 w-28",
                                isCurrent
                                    ? "text-primary translate-y-0 opacity-100"
                                    : isCompleted
                                        ? "text-foreground/80 translate-y-0 opacity-80"
                                        : "text-muted-foreground translate-y-[-2px] opacity-60"
                            )}>
                                {getStepLabel(stepNumber, accountType)}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for absolute labels */}
            <div className="h-2" />
        </div>
    );
};
