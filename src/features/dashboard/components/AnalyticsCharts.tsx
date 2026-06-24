"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { BarChart3, PieChart } from "lucide-react";

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

function formatMonth(monthNum: string) {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return months[parseInt(monthNum, 10) - 1] || monthNum;
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
    const entries = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];
        return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    }, [data]);

    const topValue = useMemo(() => {
        if (entries.length === 0) return 4;
        const max = Math.max(...entries.map(([, val]) => val));
        const tickStep = Math.ceil(max / 3) || 1;
        return tickStep * 3;
    }, [entries]);

    if (entries.length === 0) {
        return (
            <EmptyState
                icon={BarChart3}
                title="لا توجد بيانات متاحة"
                description="لم يتم تسجيل أي طلبات خلال هذه الفترة الزمنية لعرضها في المخطط."
                className="bg-transparent border-dashed min-h-[280px]"
            />
        );
    }

    const yAxisTicks = [topValue, topValue * 0.66, topValue * 0.33, 0];

    return (
        <div className="w-full h-[280px] flex pt-4 pb-2 font-sans" dir="ltr">
            {/* Y-Axis */}
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-8 pr-3">
                {yAxisTicks.map((tick, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-bold leading-[0] h-0 flex items-center">
                        {Math.round(tick)}
                    </span>
                ))}
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 relative ml-1">
                {/* Minimal Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                    {yAxisTicks.map((_, i) => (
                        <div key={i} className="w-full border-t border-slate-100/50" />
                    ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around pb-8 z-10 px-2 lg:px-6">
                    {entries.map(([monthStr, value], idx) => {
                        const [, month] = monthStr.split("-");
                        const heightPercentage = Math.max((value / topValue) * 100, 4);
                        const monthName = formatMonth(month);

                        return (
                            <div key={monthStr} className="flex flex-col items-center justify-end h-full w-12 sm:w-16 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercentage}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1, ease: "circOut" }}
                                    className="w-full bg-primary/80 hover:bg-primary rounded-t-lg transition-colors duration-300 relative flex justify-center cursor-default sm:cursor-pointer"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 text-[11px] font-bold text-white bg-slate-900 rounded-lg py-1.5 px-3 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-20 pointer-events-none tracking-wide">
                                        <span className="font-black">{value}</span> طلبات
                                    </div>
                                </motion.div>
                                <span className="text-[11px] text-slate-400 font-bold absolute -bottom-6">{monthName}</span>
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
        return (
            <EmptyState
                icon={PieChart}
                title="البيانات غير متوفرة"
                description="توزيع مجالات الاحتياج غير متاح حالياً."
                className="bg-transparent border-dashed min-h-[200px]"
            />
        );
    }

    return (
        <div className="space-y-7 pt-4">
            {entries.map(([type, value], idx) => {
                const percentage = total === 0 ? 0 : (value / total) * 100;
                const colorClass = COLORS[idx % COLORS.length];
                const displayType = TRANSLATION_MAP[type] || type;

                return (
                    <div key={type} className="space-y-3 group cursor-default">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2.5">
                                <div className={cn("w-3 h-3 rounded-md shadow-sm transition-transform group-hover:scale-110", colorClass)} />
                                <span className="text-sm font-bold text-slate-700">{displayType}</span>
                            </div>
                            <div className="text-xs font-black text-slate-900 tabular-nums tracking-tight" dir="ltr">
                                {Math.round(percentage)}% <span className="text-slate-400 font-bold ml-1 text-[11px]">({value})</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex justify-end shadow-inner">
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

