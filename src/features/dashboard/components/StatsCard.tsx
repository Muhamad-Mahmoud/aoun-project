import React from "react";
import { Card } from "@/shared/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export interface StatItem {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    isPrimary?: boolean;
}

interface StatsCardProps {
    stat: StatItem;
}

export const StatsCard = React.memo(function StatsCard({ stat }: StatsCardProps) {
    const isPositiveTrend = stat.trend === "up";
    const isNeutral = stat.trend === "neutral";
    const Icon = stat.icon;
    const isPrimary = stat.isPrimary;

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 rounded-[24px] border",
            isPrimary 
                ? "bg-primary text-white border-primary/20 shadow-sm hover:shadow-md" 
                : "bg-white text-slate-900 border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md"
        )}>
            {/* Subtle background decoration for primary card */}
            {isPrimary && (
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 blur-[40px] rounded-full pointer-events-none" />
            )}

            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <p className={cn("text-sm font-black tracking-wide", isPrimary ? "text-primary-foreground/90" : "text-slate-500")}>
                            {stat.label}
                        </p>
                        <div className={cn(
                            "w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-transform hover:scale-110 duration-500 shadow-sm",
                            isPrimary ? "bg-white/20 text-white border border-white/10" : cn(stat.iconBg, stat.iconColor, "border border-slate-50")
                        )}>
                            <Icon strokeWidth={2.5} className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <h4 className="text-[40px] font-black tracking-tighter tabular-nums leading-none">
                            {stat.value}
                        </h4>
                        {!isNeutral && (
                            <div className={cn(
                                "flex items-center text-[11px] font-black px-2.5 py-1 rounded-full border shadow-sm transition-colors mt-1",
                                isPrimary 
                                    ? "bg-white/20 text-white border-white/20" 
                                    : isPositiveTrend 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                        : "bg-rose-50 text-rose-700 border-rose-100"
                            )}>
                                {isPositiveTrend ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                                <span dir="ltr">{stat.change.replace(/[^0-9%+-]/g, '') || "5%"}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "mt-8 pt-4 border-t",
                    isPrimary ? "border-white/10" : "border-slate-100"
                )}>
                    <p className={cn("text-xs font-bold w-full truncate", isPrimary ? "text-primary-foreground/80" : "text-slate-400")}>
                        {stat.change}
                    </p>
                </div>
            </div>
        </Card>
    );
});
