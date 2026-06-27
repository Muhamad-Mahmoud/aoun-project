const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'features', 'dashboard', 'components', 'AnalyticsCharts.tsx');

const content = `"use client";

import React, { useMemo } from "react";
import { cn } from "@/shared/utils";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

// --- Types ---
interface MonthlyTrendChartProps {
    data: Record<string, number>;
}

interface RequestTypeChartProps {
    data: Record<string, number>;
}

const COLORS = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#0f172a"  // slate-900
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
    const chartData = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];
        return Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([monthStr, value]) => {
                const [, month] = monthStr.split("-");
                return {
                    name: formatMonth(month),
                    value: value
                };
            });
    }, [data]);

    if (chartData.length === 0) {
        return (
            <EmptyState
                icon={BarChart3}
                title="لا توجد بيانات متاحة"
                description="لم يتم تسجيل أي طلبات خلال هذه الفترة الزمنية لعرضها في المخطط."
                className="bg-transparent border-dashed min-h-[280px]"
            />
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-xl flex flex-col gap-1">
                    <span className="text-slate-500 text-xs font-bold">{label}</span>
                    <span className="text-slate-900 font-black text-lg">{payload[0].value} <span className="text-xs font-bold text-slate-400">طلبات</span></span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[280px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RequestTypeChart({ data }: RequestTypeChartProps) {
    const chartData = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];
        const total = Object.values(data).reduce((acc, val) => acc + val, 0);
        return Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([type, value]) => ({
                name: TRANSLATION_MAP[type] || type,
                value: value,
                percentage: total > 0 ? Math.round((value / total) * 100) : 0
            }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <EmptyState
                icon={PieChartIcon}
                title="البيانات غير متوفرة"
                description="توزيع مجالات الاحتياج غير متاح حالياً."
                className="bg-transparent border-dashed min-h-[200px]"
            />
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-100 p-2 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <span className="text-slate-700 font-bold text-sm">{payload[0].name}</span>
                    <span className="text-slate-900 font-black">{payload[0].value}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[250px] relative flex flex-col" dir="ltr">
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4" dir="rtl">
                {chartData.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs font-bold text-slate-600">{entry.name} <span className="text-slate-400">({entry.percentage}%)</span></span>
                    </div>
                ))}
            </div>
        </div>
    );
}
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Charts rebuilt successfully with recharts!');
