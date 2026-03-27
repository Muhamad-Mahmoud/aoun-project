// Active Request Card Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import {
    Zap,
    AlertTriangle,
    Stethoscope,
    MapPin,
    ShieldCheck,
    Eye,
    Edit2,
    Upload,
    X,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { StepIndicator } from "@/shared/components/common/StepIndicator";
import { cn } from "@/shared/utils";

export interface ActiveRequest {
    id: string;
    title: string;
    category: string;
    location: string;
    status: string;
    urgencyReason?: string;
    urgencyDate?: string;
    requestedAmount: string;
    attachmentsCount: number;
    priority: string;
    currentStep: number;
    totalSteps: number;
    nextAction: string;
    nextActionDescription: string;
    lastModified: string;
    createdDaysAgo: number;
}

interface PrimaryAction {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface ActiveRequestCardProps {
    request: ActiveRequest;
    primaryAction: PrimaryAction;
    steps: { label: string; done: boolean }[];
}

export function ActiveRequestCard({ request, primaryAction, steps }: ActiveRequestCardProps) {
    const isCompleted = request.status === "مكتمل";
    const isInProgress = request.status === "جاري التنفيذ" || request.status === "IN_PROGRESS";
    const isPending = request.status === "قيد المراجعة" || request.status === "PENDING" || request.status === "انتظار المراجعة";
    const isRejected = request.status.includes("مرفوض");

    const getBadgeStyle = () => {
        if (isCompleted) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        if (isInProgress) return "bg-blue-50 text-blue-700 border-blue-200/60 animate-pulse";
        if (isRejected) return "bg-rose-50 text-rose-700 border-rose-200/60";
        if (isPending) return "bg-amber-50 text-amber-700 border-amber-200/60";
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    };

    const getIndicatorColor = () => {
        if (isCompleted) return { pulse: "bg-emerald-400", core: "bg-emerald-500" };
        if (isInProgress) return { pulse: "bg-blue-400 animate-ping", core: "bg-blue-500" };
        if (isRejected) return { pulse: "bg-rose-400", core: "bg-rose-500" };
        if (isPending) return { pulse: "bg-amber-400 animate-ping", core: "bg-amber-500" };
        return { pulse: "bg-slate-400", core: "bg-slate-500" };
    };

    const getProgressStyle = () => {
        if (isCompleted) return "from-emerald-400 to-emerald-500";
        if (isInProgress) return "from-blue-400 to-blue-500";
        if (isRejected) return "from-rose-400 to-rose-500";
        if (isPending) return "from-amber-400 to-amber-500";
        return "from-primary/80 to-primary";
    };

    const indicator = getIndicatorColor();

    return (
        <Card className="overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 text-start bg-white rounded-[24px] group">
            {/* Header */}
            <div className="border-b border-slate-100/80 px-8 py-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", indicator.pulse)}></span>
                            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", indicator.core)}></span>
                        </span>
                        الطلب النشط حالياً
                    </h2>
                    <Badge variant="outline" className={cn("font-black px-3.5 py-1.5 rounded-full shadow-sm text-xs tracking-wide", getBadgeStyle())}>
                        {request.status}
                    </Badge>
                </div>
            </div>

            <div className="p-8">
                {/* Request Info */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                    <div className="w-16 h-16 rounded-[18px] bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:scale-105 transition-transform duration-500">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-start space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{request.id}</span>
                            <span className="text-slate-200 text-xs">•</span>
                            <span className="text-slate-400 font-medium text-xs">منذ {request.createdDaysAgo} أيام</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                            {request.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold">{request.location}</span>
                            </div>
                            <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
                            <span className="text-xs font-black text-primary">{request.category}</span>
                        </div>
                    </div>
                </div>

                {/* Status Box - Clean & Professional */}
                <div className="bg-slate-50 rounded-[20px] p-6 mb-8 border border-slate-100/80 shadow-sm">
                    <div className="flex items-center gap-4 text-start">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100/80 shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 mb-1">
                                {request.nextAction}
                            </p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{request.nextActionDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-8 pl-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى التقدم</span>
                        <span className="text-xs font-bold text-slate-600">المرحلة {request.currentStep} من {request.totalSteps}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r relative overflow-hidden", getProgressStyle())}
                            style={{ width: `${(request.currentStep / request.totalSteps) * 100}%` }}
                        >
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Timeline Steps */}
                <StepIndicator steps={steps} className="mb-8" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-5 bg-slate-50 rounded-[20px] border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">المبلغ المطلوب</div>
                        <div className="text-lg font-black text-slate-900">{request.requestedAmount}</div>
                    </div>
                    <div className="text-center p-5 bg-slate-50 rounded-[20px] border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">المرفقات</div>
                        <div className="text-lg font-black text-slate-900">{request.attachmentsCount} ملفات</div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button className="flex-1 h-12 rounded-xl font-black text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]" asChild>
                        <Link href={primaryAction.href}>
                            <primaryAction.icon className="w-4 h-4 me-2 stroke-[2.5]" />
                            {primaryAction.label}
                        </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]" asChild>
                        <Link href={`/dashboard/family/requests/${request.id.replace('REQ-', '')}`}>
                            عرض تفاصيل الطلب
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
