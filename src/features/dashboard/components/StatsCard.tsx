// Stats Card Component for Dashboard
"use client";

import React from "react";
import { Card } from "@/shared/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export interface StatItem {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

interface StatsCardProps {
    stat: StatItem;
}

export const StatsCard = React.memo(function StatsCard({ stat }: StatsCardProps) {
    return (
        <Card className="p-4 text-start border-slate-100 bg-white hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start w-full">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500",
                        stat.iconBg
                    )}>
                        <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
                    </div>
                    {stat.trend !== "neutral" && (
                        <div className={cn(
                            "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
                            stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 me-0.5" /> : <ArrowDownRight className="w-3 h-3 me-0.5" />}
                            {stat.trend === "up" ? "17%+" : "5%-"}
                        </div>
                    )}
                </div>
                
                <div className="space-y-1">
                    <h4 className="text-3xl font-black text-slate-900 leading-none tabular-nums tracking-tight">
                        {stat.value}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {stat.label}
                    </p>
                </div>

                <div className="pt-2 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                        {stat.change}
                    </p>
                </div>
            </div>
        </Card>
    );
});
