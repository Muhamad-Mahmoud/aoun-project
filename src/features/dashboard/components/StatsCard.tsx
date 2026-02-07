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
        <Card className="p-5 text-start border-slate-100 bg-white hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shrink-0 border border-slate-50 transition-transform group-hover:scale-110 duration-500`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 mb-0.5 truncate uppercase tracking-[0.1em]">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</h4>
                        {stat.trend !== "neutral" && (
                            <div className={cn(
                                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 me-0.5" /> : <ArrowDownRight className="w-3 h-3 me-0.5" />}
                                {stat.trend === "up" ? "١٢٪+" : "٥٪-"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{stat.change}</p>
            </div>
        </Card>
    );
}
