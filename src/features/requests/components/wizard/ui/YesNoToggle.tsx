"use client";

import { cn } from "@/shared/utils";
import { Check, X } from "lucide-react";

interface YesNoToggleProps {
    value: boolean | undefined;
    onChange: (val: boolean) => void;
    yesLabel?: string;
    noLabel?: string;
    className?: string;
}

export function YesNoToggle({
    value,
    onChange,
    yesLabel = "نعم، يوجد",
    noLabel = "لا يوجد",
    className,
}: YesNoToggleProps) {
    return (
        <div className={cn("grid grid-cols-2 gap-3 max-w-sm", className)}>
            {/* Yes */}
            <button
                type="button"
                onClick={() => onChange(true)}
                className={cn(
                    "relative flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 font-bold text-[14px] transition-all duration-200 select-none focus:outline-none",
                    value === true
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
            >
                <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                    value === true ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                {yesLabel}
            </button>

            {/* No */}
            <button
                type="button"
                onClick={() => onChange(false)}
                className={cn(
                    "relative flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 font-bold text-[14px] transition-all duration-200 select-none focus:outline-none",
                    value === false
                        ? "border-rose-400 bg-rose-50 text-rose-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
            >
                <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                    value === false ? "bg-rose-400 text-white" : "bg-slate-100 text-slate-400"
                )}>
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                {noLabel}
            </button>
        </div>
    );
}
