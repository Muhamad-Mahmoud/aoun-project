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
        <Card className="overflow-hidden border-2 border-primary/5 shadow-xl shadow-primary/5 text-start">
            {/* Header */}
            <div className="border-b border-border px-6 py-4 bg-muted/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse me-2" />
                        الطلب النشط حالياً
                    </h2>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-[hsl(var(--warning-light))] text-[hsl(var(--warning-dark))] border-0">
                            قيد المراجعة
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-8">
                {/* Request Info */}
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                    <div className="w-16 h-16 rounded-[2rem] bg-warm-green text-white flex items-center justify-center shrink-0 shadow-2xl shadow-warm-green/20 border-4 border-white ring-1 ring-warm-green/10 transition-transform hover:rotate-3 duration-500">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-start space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] uppercase px-3 py-1 rounded-lg tracking-wider transition-colors hover:bg-slate-200 cursor-default">
                                {request.id}
                            </Badge>
                            <span className="text-slate-200 text-xs">•</span>
                            <span className="text-slate-400 font-bold text-xs">منذ {request.createdDaysAgo} أيام</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                            {request.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs font-black">{request.location}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                                <span className="text-xs font-black">{request.category}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Box - Compact & Premium */}
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50 rounded-[2rem] p-6 mb-8 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-5 relative z-10 text-start">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-blue-500/5 flex items-center justify-center shrink-0 border border-white">
                            <ShieldCheck className="w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-blue-900 mb-1 flex items-center gap-2">
                                {request.nextAction}
                                <span className="inline-block w-1 h-1 bg-blue-300 rounded-full" />
                                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black">الإجراء التالي</span>
                            </p>
                            <p className="text-xs text-blue-600/80 font-bold leading-relaxed">{request.nextActionDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-10 px-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">مستوى التقدم</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] text-slate-400 font-bold">المرحلة {request.currentStep} من {request.totalSteps}</span>
                        </div>
                        <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">%{Math.round((request.currentStep / request.totalSteps) * 100)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(hsl(var(--primary)),0.3)]"
                            style={{ width: `${(request.currentStep / request.totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Timeline Steps */}
                <StepIndicator steps={steps} className="mb-8" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-4 bg-muted/50 rounded-2xl border border-muted">
                        <div className="text-xs text-muted-foreground mb-1">المبلغ المطلوب</div>
                        <div className="text-lg font-bold text-foreground">{request.requestedAmount}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-2xl border border-muted">
                        <div className="text-xs text-muted-foreground mb-1">المرفقات</div>
                        <div className="text-lg font-bold text-foreground">{request.attachmentsCount} ملفات</div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3 auto-cols-fr">
                        <Button className="w-full h-12 text-base shadow-lg shadow-primary/20" asChild>
                            <Link href={primaryAction.href}>
                                <primaryAction.icon className="w-5 h-5 me-2" />
                                {primaryAction.label}
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full h-12 text-base hover:bg-muted" asChild>
                            <Link href={`/dashboard/family/requests/${request.id}`}>
                                <Eye className="w-5 h-5 me-2" />
                                عرض التفاصيل
                            </Link>
                        </Button>
                    </div>

                    <div className="flex justify-center gap-6 pt-2">
                        <Link href={`/dashboard/family/requests/${request.id}/edit`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <Edit2 className="w-3.5 h-3.5" /> تعديل الطلب
                        </Link>
                        <Link href={`/dashboard/family/requests/${request.id}/documents`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" /> رفع مستندات
                        </Link>
                        <button className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> إلغاء الطلب
                        </button>
                    </div>

                </div>
            </div>
        </Card>
    );
}
