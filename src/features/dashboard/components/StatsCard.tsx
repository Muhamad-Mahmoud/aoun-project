// Stats Card Component for Dashboard
"use client";

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

export function StatsCard({ stat }: StatsCardProps) {
    return (
        <Card className="p-4 text-start border-primary/5 bg-gradient-to-br from-white to-slate-50/50">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shrink-0 shadow-inner`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 mb-0.5 truncate uppercase tracking-wider">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                        {stat.trend !== "neutral" && (
                            <div className={cn(
                                "flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-full",
                                stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 me-0.5" /> : <ArrowDownRight className="w-3 h-3 me-0.5" />}
                                {stat.trend === "up" ? "١٢٪+" : "٥٪-"}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1">{stat.change}</p>
                </div>
            </div>
        </Card>
    );
}
