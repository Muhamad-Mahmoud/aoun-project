"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils";

// --- Types ---
interface MonthlyTrendChartProps {
    data: Record<string, number>;
}

interface RequestTypeChartProps {
    data: Record<string, number>;
}

// Ensure proper spacing and colors
const COLORS = [
    "bg-sky-blue",
    "bg-golden-orange",
    "bg-warm-green",
    "bg-royal-purple",
    "bg-slate-700",
    "bg-primary"
];

const TRANSLATION_MAP: Record<string, string> = {
    Financial: "مالية",
    Medical: "طبية",
    Food: "غذاء",
    Housing: "سكن",
    Education: "تعليم",
    Utilities: "فواتير",
    Other: "أخرى",
};

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
    const entries = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];
        return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    }, [data]);

    const topValue = useMemo(() => {
        if (entries.length === 0) return 4;
        const max = Math.max(...entries.map(([, val]) => val));
        const tickStep = Math.ceil(max / 4) || 1;
        return tickStep * 4;
    }, [entries]);

    if (entries.length === 0) {
        return <div className="text-center py-10 text-slate-500">لا توجد بيانات متاحة لهذا العام.</div>;
    }

    const yAxisTicks = [topValue, topValue * 0.75, topValue * 0.5, topValue * 0.25, 0];

    return (
        <div className="w-full h-[250px] flex pt-4 pb-2 font-sans" dir="ltr">
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-8 pr-2">
                {yAxisTicks.map((tick, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-medium leading-[0] h-0 flex items-center">
                        {Math.round(tick)}
                    </span>
                ))}
            </div>
            
            <div className="flex-1 relative ml-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                    {yAxisTicks.map((_, i) => (
                        <div key={i} className="w-full border-t border-slate-100" />
                    ))}
                </div>

                <div className="absolute inset-0 flex items-end justify-around pb-8 z-10 px-4">
                    {entries.map(([monthStr, value], idx) => {
                        const [, month] = monthStr.split("-");
                        const heightPercentage = Math.max((value / topValue) * 100, 4);

                        return (
                            <div key={monthStr} className="flex flex-col items-center justify-end h-full w-14 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercentage}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1, ease: "circOut" }}
                                    className="w-full bg-primary/90 hover:bg-primary rounded-t-xl transition-all duration-300 relative flex justify-center cursor-pointer shadow-sm group-hover:shadow-md"
                                >
                                    <div className="absolute -top-10 text-xs font-black text-white bg-slate-900 rounded-lg py-1.5 px-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20">
                                        {value} طلب
                                    </div>
                                </motion.div>
                                <span className="text-[11px] text-slate-500 font-black absolute -bottom-7">{month}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function RequestTypeChart({ data }: RequestTypeChartProps) {
    const entries = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];
        return Object.entries(data).sort((a, b) => b[1] - a[1]);
    }, [data]);

    const total = useMemo(() => {
        return entries.reduce((acc, [, val]) => acc + val, 0);
    }, [entries]);

    if (entries.length === 0) {
        return <div className="text-center py-10 text-slate-500">لا توجد توزيعات متاحة.</div>;
    }

    return (
        <div className="space-y-6 pt-2">
            {entries.map(([type, value], idx) => {
                const percentage = total === 0 ? 0 : (value / total) * 100;
                const colorClass = COLORS[idx % COLORS.length];
                const displayType = TRANSLATION_MAP[type] || type;

                return (
                    <div key={type} className="space-y-2.5">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2.5 h-2.5 rounded-full", colorClass)} />
                                <span className="text-sm font-bold text-slate-700">{displayType}</span>
                            </div>
                            <div className="text-xs font-black text-slate-900" dir="ltr">
                                {Math.round(percentage)}% <span className="text-slate-400 font-bold ml-1">({value} طلب)</span>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex justify-end">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.2, delay: idx * 0.1, ease: "circOut" }}
                                className={cn("h-full rounded-full", colorClass)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

