"use client";

import { AidRequest, RequestCategory, UrgencyLevel, RequestStatus } from "../types";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
    MapPin,
    Clock,
    ArrowUpLeft, /* In RTL, Forward is Left */
    Stethoscope,
    GraduationCap,
    UtensilsCrossed,
    Home,
    CreditCard,
    HelpCircle,
    Sparkles
} from "lucide-react";
import { cn } from "@/shared/utils";

interface RequestCardProps {
    request: AidRequest;
    showActions?: boolean;
    onViewDetails?: (id: string) => void;
    variant?: "default" | "compact";
}

const CategoryConfig: Record<RequestCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
    HEALTH: { label: "رعاية صحية", icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    EDUCATION: { label: "تعليم", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    FOOD: { label: "دعم غذائي", icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    HOUSING: { label: "سكن وإيواء", icon: Home, color: "text-sky-600", bg: "bg-sky-500/10", border: "border-sky-500/30" },
    DEBT: { label: "سداد ديون", icon: CreditCard, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/30" },
    OTHER: { label: "أخرى", icon: HelpCircle, color: "text-gray-600", bg: "bg-gray-500/10", border: "border-gray-500/30" },
};

const UrgencyConfig: Record<UrgencyLevel, { label: string; color: string; bgGlow: string }> = {
    CRITICAL: { label: "حرجة", color: "bg-red-500", bgGlow: "shadow-red-500/20" },
    HIGH: { label: "عالية", color: "bg-orange-500", bgGlow: "shadow-orange-500/20" },
    MEDIUM: { label: "متوسطة", color: "bg-yellow-500", bgGlow: "shadow-yellow-500/20" },
    LOW: { label: "عادية", color: "bg-green-500", bgGlow: "shadow-green-500/20" },
};

const StatusConfig: Record<RequestStatus, { label: string; color: string }> = {
    PENDING: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    VERIFIED: { label: "مؤكد", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
    IN_PROGRESS: { label: "جاري التنفيذ", color: "bg-sky-500/10 text-sky-600 border-sky-500/30" },
    COMPLETED: { label: "مكتمل", color: "bg-green-500/10 text-green-600 border-green-500/30" },
    REJECTED: { label: "مرفوض", color: "bg-red-500/10 text-red-600 border-red-500/30" },
};

export function RequestCard({ request, showActions = true, onViewDetails, variant = "default" }: RequestCardProps) {
    const category = CategoryConfig[request.category];
    const urgency = UrgencyConfig[request.urgency];
    const status = StatusConfig[request.status];
    const CategoryIcon = category.icon;

    return (
        <Card className={cn(
            "group relative overflow-hidden border-slate-100 bg-white transition-all duration-500 rounded-[2rem]",
            "hover:shadow-2xl hover:shadow-slate-200/60 hover:border-warm-green/20 hover:-translate-y-2"
        )}>
            {/* Top Accent Line */}
            <div className={cn("absolute top-0 inset-x-0 h-1.5", urgency.color)} />

            {/* Glassy Background Flare */}
            <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-br from-warm-green/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <CardHeader className="p-6 pb-4 space-y-4 relative">
                <div className="flex items-start justify-between gap-4">
                    {/* Category Badge with Icon */}
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm transition-all group-hover:bg-white",
                        category.bg,
                        category.border
                    )}>
                        <CategoryIcon className={cn("w-4 h-4", category.color)} />
                        <span className={cn("text-xs font-black uppercase tracking-wider", category.color)}>
                            {category.label}
                        </span>
                    </div>

                    {/* Urgency Indicator */}
                    <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        <span className={cn(
                            "w-2.5 h-2.5 rounded-full shadow-lg pulse",
                            urgency.color
                        )} />
                        <span className="text-[10px] font-black text-slate-500">{urgency.label}</span>
                    </div>
                </div>

                <CardTitle className="text-xl font-black text-slate-900 leading-[1.3] group-hover:text-warm-green transition-colors line-clamp-2">
                    {request.title}
                </CardTitle>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warm-green" />
                        {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-warm-green" />
                        {request.location}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0">
                <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed">
                    {request.description}
                </p>

                {request.amountNeeded && (
                    <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 transition-all group-hover:bg-warm-green/5 group-hover:border-warm-green/10">
                        <span className="text-xs font-black text-slate-400">المبلغ المطلوب</span>
                        <span className="text-xl font-black text-slate-900 group-hover:text-warm-green transition-colors">
                            {request.amountNeeded.toLocaleString()} <span className="text-xs font-bold opacity-60">ر.س</span>
                        </span>
                    </div>
                )}
            </CardContent>

            {showActions && (
                <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between gap-4">
                    <Badge variant="outline" className={cn("text-xs font-black border-2 px-3 py-1 rounded-full", status.color)}>
                        {status.label}
                    </Badge>

                    <Button
                        size="sm"
                        className="bg-slate-900 hover:bg-warm-green text-white shadow-xl shadow-slate-200 rounded-xl h-10 px-5 font-black text-xs transition-all group-hover:scale-105 active:scale-95"
                        onClick={() => onViewDetails?.(request.id)}
                    >
                        التفاصيل
                        <ArrowUpLeft className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

