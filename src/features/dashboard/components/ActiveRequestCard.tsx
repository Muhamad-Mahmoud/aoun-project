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
    return (
        <Card className="overflow-hidden border border-slate-100 shadow-sm text-start bg-white rounded-3xl">
            {/* Header */}
            <div className="border-b border-border/50 px-8 py-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        الطلب النشط حالياً
                    </h2>
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200/50 font-medium px-3 py-1 rounded-full">
                        قيد المراجعة
                    </Badge>
                </div>
            </div>

            <div className="p-8">
                {/* Request Info */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-warm-green/10 text-warm-green flex items-center justify-center shrink-0 border border-warm-green/20">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-start space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{request.id}</span>
                            <span className="text-slate-200 text-xs">•</span>
                            <span className="text-slate-400 font-medium text-xs">منذ {request.createdDaysAgo} أيام</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {request.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs font-semibold">{request.location}</span>
                            </div>
                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                            <span className="text-xs font-semibold text-primary">{request.category}</span>
                        </div>
                    </div>
                </div>

                {/* Status Box - Clean & Professional */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                    <div className="flex items-center gap-4 text-start">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 mb-0.5">
                                {request.nextAction}
                            </p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{request.nextActionDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">مستوى التقدم</span>
                        <span className="text-xs font-medium text-slate-600">المرحلة {request.currentStep} من {request.totalSteps}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${(request.currentStep / request.totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Timeline Steps indicator placeholder/StepIndicator */}
                <StepIndicator steps={steps} className="mb-8" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">المبلغ المطلوب</div>
                        <div className="text-base font-bold text-slate-900">{request.requestedAmount}</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">المرفقات</div>
                        <div className="text-base font-bold text-slate-900">{request.attachmentsCount} ملفات</div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 h-11 rounded-xl font-bold text-sm" asChild>
                        <Link href={primaryAction.href}>
                            <primaryAction.icon className="w-4 h-4 me-2" />
                            {primaryAction.label}
                        </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-sm" asChild>
                        <Link href={`/dashboard/family/requests/${request.id}`}>
                            عرض تفاصيل الطلب
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
