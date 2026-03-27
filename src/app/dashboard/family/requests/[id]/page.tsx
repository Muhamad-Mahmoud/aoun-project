"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/shared/ui/alert-dialog";
import {
    ArrowRight,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Ban,
    Loader2,
    Briefcase,
    Heart,
    Home,
    Download,
    Users,
    Star,
    Shield,
    Image as ImageIcon,
    File,
    Copy,
    Printer,
    MapPin,
    Paperclip,
    TrendingUp,
    Coins,
    Info,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { getRequestById, cancelRequest } from "@/features/requests/api/requestsApi";
import {
    statusConfig,
    categoryConfig,
    resolveStatus,
    resolveCategory,
    housingLabels,
    workingTypeLabels,
    employmentTypeLabels,
} from "@/features/requests/config/requestConfig";
import type { RequestDetailResponse } from "@/features/requests/types";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import type { LucideIcon } from "lucide-react";

// ===== CSS Keyframes =====
const animationStyles = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.anim-up {
  animation: fadeSlideUp 0.35s ease-out both;
}
@keyframes scoreRingFill {
  from { stroke-dashoffset: 283; }
}
`;

// ===== Field Component — clean label + value =====
function Field({ label, value, colSpan = 1 }: { label: string; value: React.ReactNode; colSpan?: number }) {
    if (value === undefined || value === null || value === "") return null;
    const display = typeof value === "boolean" ? (value ? "نعم" : "لا") : value;
    return (
        <div className={cn("flex flex-col gap-1", colSpan === 2 && "sm:col-span-2")}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-[13px] font-semibold text-slate-800 bg-white rounded-lg px-3 py-2 flex items-center border border-slate-100 min-h-[34px]">
                {display}
            </span>
        </div>
    );
}

// ===== Section Card — consistent with wizard SectionCard =====
function Section({ icon: Icon, title, iconColor = "text-warm-green", iconBg = "bg-warm-green/10", children, delay = 0 }: {
    icon: LucideIcon; title: string; iconColor?: string; iconBg?: string; children: React.ReactNode; delay?: number;
}) {
    return (
        <div className="anim-up bg-slate-50/60 rounded-2xl border border-slate-100 p-4 sm:p-5" style={{ animationDelay: `${delay}ms` }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
                <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", iconBg, iconColor)}>
                    <Icon className="w-3.5 h-3.5" />
                </span>
                <h4 className="text-[14px] font-black text-slate-800 leading-none">{title}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children}
            </div>
        </div>
    );
}

// ===== Compact Score Pill =====
function ScorePill({ value, label, color }: { value: number; label: string; color: "blue" | "amber" }) {
    const colors = {
        blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", sub: "text-blue-400", ring: "text-blue-500" },
        amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", sub: "text-amber-400", ring: "text-amber-500" },
    };
    const c = colors[color];
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(value, 100);
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", c.bg, c.border)}>
            <div className="relative w-11 h-11 shrink-0">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200/60" />
                    <circle
                        cx="22" cy="22" r={radius}
                        fill="none" strokeWidth="3" strokeLinecap="round"
                        className={c.ring}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ animation: "scoreRingFill 0.8s ease-out forwards" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-sm font-black", c.text)}>{value}</span>
                </div>
            </div>
            <span className={cn("text-xs font-bold", c.sub)}>{label}</span>
        </div>
    );
}

// ===== File type icon helper =====
function getFileIcon(fileType: string) {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("image") || type.includes("png") || type.includes("jpg") || type.includes("jpeg"))
        return ImageIcon;
    if (type.includes("pdf")) return FileText;
    return File;
}

// ===== Status Lifecycle Steps =====
const lifecycleSteps = [
    { key: "PENDING", label: "قيد المراجعة" },
    { key: "VERIFIED", label: "تم التحقق" },
    { key: "IN_PROGRESS", label: "جاري التنفيذ" },
    { key: "COMPLETED", label: "مكتمل" },
];

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [request, setRequest] = useState<RequestDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const fetchRequest = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getRequestById(id);
            setRequest(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "فشل تحميل تفاصيل الطلب";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRequest();
    }, [id, fetchRequest]);

    const handleCancel = async () => {
        try {
            setCancelling(true);
            setShowCancelDialog(false);
            await cancelRequest(id);
            toast.success("تم إلغاء الطلب بنجاح");
            fetchRequest();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "فشل إلغاء الطلب";
            toast.error(message);
        } finally {
            setCancelling(false);
        }
    };

    const copyRequestId = () => {
        navigator.clipboard.writeText(`#${request?.id}`);
        toast.success("تم نسخ رقم الطلب");
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (v: number | null | undefined) => {
        if (v === undefined || v === null) return undefined;
        return `${v.toLocaleString()} ج.م`;
    };

    // ===== Loading State =====
    if (loading) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white" dir="rtl">
                    <DashboardTopBar userType="family" />
                    <main className="p-4 sm:p-8 pb-20 pt-20 lg:pt-28">
                        <div className="mx-auto max-w-4xl space-y-5">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-11 h-11 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-48 rounded-2xl" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-44 rounded-2xl" />
                                <Skeleton className="h-44 rounded-2xl" />
                            </div>
                        </div>
                    </main>
                </div>
            </DashboardLayout>
        );
    }

    // ===== Error State =====
    if (error || !request) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white" dir="rtl">
                    <DashboardTopBar userType="family" />
                    <main className="p-4 sm:p-8 pb-20 pt-20 lg:pt-28">
                        <div className="mx-auto max-w-4xl">
                            <div className="p-10 text-center rounded-2xl border border-red-200 bg-red-50">
                                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                                <p className="text-base font-bold text-red-600 mb-4">{error || "الطلب غير موجود"}</p>
                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" onClick={() => router.back()} className="rounded-xl"><ArrowRight className="w-4 h-4 ml-2" />العودة</Button>
                                    <Button onClick={fetchRequest} className="rounded-xl bg-warm-green hover:bg-warm-green/90">إعادة المحاولة</Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </DashboardLayout>
        );
    }

    // ===== Resolved values =====
    const statusKey = resolveStatus(request.status);
    const status = statusConfig[statusKey] || statusConfig.PENDING;
    const StatusIcon = status.icon;
    const canCancel = ["PENDING", "VERIFIED"].includes(statusKey);
    const cat = categoryConfig[resolveCategory(request.requestType)] || categoryConfig["Other"];
    const CatIcon = cat.icon;
    const isTerminal = ["REJECTED", "CANCELLED"].includes(statusKey);

    const emp = request.employmentData;
    const health = request.healthData;
    const living = request.livingCondition;
    const social = request.socialSupport;

    const currentStepIndex = lifecycleSteps.findIndex(s => s.key === statusKey);

    return (
        <>
        <style>{animationStyles}</style>

        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white print:bg-white" dir="rtl">
                <DashboardTopBar userType="family" />

                <main className="p-4 sm:p-8 pb-20 pt-20 lg:pt-28 relative z-10">
                    <div className="mx-auto max-w-4xl space-y-6">

                        {/* ===== Compact Header ===== */}
                        <div className="anim-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 shrink-0 print:hidden p-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl font-black text-slate-900">تفاصيل الطلب</h1>
                                        <button
                                            onClick={copyRequestId}
                                            className="group flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-500 border-none font-black text-[10px] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                                            title="انسخ رقم الطلب"
                                        >
                                            #{request.id}
                                            <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <Badge variant="outline" className={cn("text-[10px] font-bold border px-2.5 py-0.5 rounded-full gap-1", status.bg, status.color)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </Badge>
                                        {request.priority && (
                                            <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full gap-1">
                                                <Star className="w-2.5 h-2.5" />
                                                {request.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-medium flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                                        </span>
                                        {request.location && (
                                            <>
                                                <span className="text-slate-200">•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {request.location}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 print:hidden">
                                <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl h-9 px-3 font-bold text-[11px] text-slate-500 border-slate-200 hover:bg-slate-50">
                                    <Printer className="w-3.5 h-3.5 ml-1.5" />
                                    طباعة
                                </Button>
                                {canCancel && (
                                    <Button variant="outline" onClick={() => setShowCancelDialog(true)} disabled={cancelling} className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 h-9 px-4 font-bold text-[11px]">
                                        {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1.5" /> : <Ban className="w-3.5 h-3.5 ml-1.5" />}
                                        إلغاء الطلب
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* ===== Status Timeline ===== */}
                        {!isTerminal && (
                            <div className="anim-up bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" style={{ animationDelay: "60ms" }}>
                                <div className="flex items-center justify-between gap-1">
                                    {lifecycleSteps.map((step, idx) => {
                                        const isActive = step.key === statusKey;
                                        const isDone = idx < currentStepIndex;
                                        return (
                                            <React.Fragment key={step.key}>
                                                <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 text-[10px] font-black",
                                                        isDone
                                                            ? "bg-emerald-500 text-white"
                                                            : isActive
                                                                ? "bg-warm-green text-white shadow-md shadow-warm-green/25 scale-110"
                                                                : "bg-slate-100 text-slate-400"
                                                    )}>
                                                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-bold text-center whitespace-nowrap",
                                                        isActive ? "text-warm-green" : isDone ? "text-emerald-600" : "text-slate-400"
                                                    )}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {idx < lifecycleSteps.length - 1 && (
                                                    <div className="flex-1 h-[3px] rounded-full min-w-[16px] bg-slate-100 overflow-hidden self-start mt-[14px]">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-700 ease-out",
                                                                idx < currentStepIndex ? "bg-emerald-400 w-full" : "bg-transparent w-0"
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Terminal status */}
                        {isTerminal && (
                            <div className={cn(
                                "anim-up rounded-2xl p-4 flex items-center gap-3",
                                statusKey === "REJECTED" ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"
                            )} style={{ animationDelay: "60ms" }}>
                                <StatusIcon className={cn("w-5 h-5", status.color)} />
                                <div>
                                    <p className={cn("text-sm font-black", status.color)}>{status.label}</p>
                                    {request.decisionReason && (
                                        <p className="text-xs text-slate-500 mt-0.5">{request.decisionReason}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ===== Request Overview Card ===== */}
                        <div className="anim-up bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animationDelay: "120ms" }}>
                            <div className="h-1 w-full bg-gradient-to-r from-warm-green via-emerald-400 to-warm-green/40" />
                            <div className="p-5 sm:p-6 space-y-5">
                                {/* Tags row */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-transparent text-xs font-bold", cat.bg, cat.color)}>
                                        <CatIcon className="w-3.5 h-3.5" />
                                        {cat.label}
                                    </div>
                                    {request.otherRequestType && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600">
                                            {request.otherRequestType}
                                        </div>
                                    )}
                                    {request.predictedAssistanceType && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100 text-xs font-bold text-purple-600">
                                            نوع المساعدة المقترح: {request.predictedAssistanceType}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <h3 className="text-[13px] font-black text-slate-800 flex items-center gap-2">
                                        <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                                        وصف الحالة
                                    </h3>
                                    <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {request.description || "لا يوجد وصف"}
                                        </p>
                                    </div>
                                </div>

                                {/* Decision Reason (non-terminal) */}
                                {!isTerminal && request.decisionReason && (
                                    <div className="space-y-2">
                                        <h3 className="text-[13px] font-black text-slate-800 flex items-center gap-2">
                                            <div className="w-1 h-3.5 bg-amber-400 rounded-full" />
                                            سبب القرار
                                        </h3>
                                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                                            <p className="text-[13px] font-medium text-amber-700 leading-relaxed">{request.decisionReason}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Scores — compact pills side by side */}
                                {(request.needScore != null || request.priorityScore != null) && (
                                    <div className="flex gap-3 flex-wrap">
                                        {request.needScore != null && (
                                            <ScorePill value={request.needScore} label="درجة الاحتياج" color="blue" />
                                        )}
                                        {request.priorityScore != null && (
                                            <ScorePill value={request.priorityScore} label="درجة الأولوية" color="amber" />
                                        )}
                                    </div>
                                )}

                                {/* Handled By */}
                                {request.handledBy && (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                        <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-500">تمت المعالجة بواسطة</p>
                                            <p className="text-[13px] font-black text-emerald-700">{request.handledBy.name}</p>
                                            <p className="text-[10px] text-emerald-500">{request.handledBy.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ===== Details Grid ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Employment */}
                            {emp && (
                                <Section icon={Briefcase} title="الحالة المهنية" iconColor="text-blue-500" iconBg="bg-blue-50" delay={180}>
                                    <Field label="حالة التوظيف" value={
                                        <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center", emp.isWorking ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                                            {emp.isWorking ? "يعمل" : "لا يعمل"}
                                        </span>
                                    } />
                                    {emp.isWorking && (
                                        <>
                                            <Field label="نوع العمل" value={emp.workingType != null ? workingTypeLabels[emp.workingType] : undefined} />
                                            <Field label="نوع التوظيف" value={emp.employmentType != null ? employmentTypeLabels[emp.employmentType] : undefined} />
                                            <Field label="المسمى الوظيفي" value={emp.jobTitle} />
                                            <Field label="جهة العمل" value={emp.company} />
                                            <Field label="الراتب الشهري" value={formatCurrency(emp.salaryMonthly)} />
                                            <Field label="سنوات الخدمة" value={emp.yearsAtJob} />
                                            <Field label="وصف العمل" colSpan={2} value={emp.workDescription} />
                                            <Field label="موقع العمل" colSpan={2} value={emp.workLocation} />
                                        </>
                                    )}
                                    {!emp.isWorking && (
                                        <>
                                            <Field label="سبب عدم العمل" value={emp.unEmploymentReason} colSpan={2} />
                                            <Field label="يبحث عن عمل" value={emp.isLookingForJob} />
                                            <Field label="يحتاج تدريب" value={emp.needsTraining} />
                                            <Field label="الدخل المتوقع" value={formatCurrency(emp.estimatedIncomeMonthly)} />
                                        </>
                                    )}
                                </Section>
                            )}

                            {/* Health */}
                            {health && (
                                <Section icon={Heart} title="الحالة الصحية" iconColor="text-rose-500" iconBg="bg-rose-50" delay={230}>
                                    <Field label="تأمين طبي" value={health.hasInsurance ? <span className="text-emerald-600">نعم{health.insuranceType ? ` (${health.insuranceType})` : ''}</span> : "لا يوجد"} />
                                    <Field label="إعاقة" value={health.hasDisability ? <span className="text-purple-600">نعم{health.disabilityType ? ` (${health.disabilityType})` : ''}</span> : "لا يوجد"} />
                                    <Field label="مرض مزمن" value={health.hasChronicDisease ? <span className="text-rose-600">نعم{health.chronicDiseaseType ? ` (${health.chronicDiseaseType})` : ''}</span> : "لا يوجد"} />
                                    {health.hasChronicDisease && (
                                        <Field label="التكلفة الطبية الشهرية" value={formatCurrency(health.medicalCostMonthly)} />
                                    )}
                                </Section>
                            )}

                            {/* Living Conditions */}
                            {living && (
                                <Section icon={Home} title="السكن والمعيشة" iconColor="text-sky-500" iconBg="bg-sky-50" delay={280}>
                                    <Field label="نوع السكن" value={living.housingType != null ? housingLabels[living.housingType] || String(living.housingType) : undefined} />
                                    <Field label="يمتلك سيارة" value={living.hasCar} />
                                    <Field label="الإيجار الشهري" value={formatCurrency(living.rentMonthly)} />
                                    <Field label="المصاريف الشهرية" value={formatCurrency(living.monthlyExpenses)} />
                                    <Field label="فواتير الخدمات" value={formatCurrency(living.utilitiesMonthly)} />
                                    <Field label="إنفاق الأسرة" value={formatCurrency(living.householdMonthlySpending)} />
                                    <Field label="دفع سنوي" value={formatCurrency(living.annualPayment)} />
                                    <Field label="التزامات أخرى" value={living.hasOtherCommitments} />
                                    {living.hasOtherCommitments && (
                                        <>
                                            <Field label="نوع الالتزام" value={living.otherCommitmentsType} colSpan={2} />
                                            <Field label="مبلغ الالتزام" value={formatCurrency(living.otherCommitmentsAmount)} />
                                        </>
                                    )}
                                </Section>
                            )}

                            {/* Social Support */}
                            {social && (
                                <Section icon={Users} title="الدعم الاجتماعي" iconColor="text-violet-500" iconBg="bg-violet-50" delay={330}>
                                    <Field label="مسجل بالدعم" value={social.registeredSocialSupport} />
                                    {social.registeredSocialSupport && (
                                        <Field label="مبلغ الدعم" value={formatCurrency(social.socialSupportAmount)} />
                                    )}
                                    <Field label="جهات أخرى" value={social.otherAidProviders} colSpan={2} />
                                    <Field label="نوع المساعدة" value={social.otherAidType} />
                                    <Field label="مبلغ المساعدة" value={formatCurrency(social.otherAidAmount)} />
                                </Section>
                            )}
                        </div>

                        {/* ===== Attachments ===== */}
                        {request.attachments && request.attachments.length > 0 && (
                            <Section icon={Paperclip} title={`المستندات المرفقة (${request.attachments.length})`} iconColor="text-warm-green" iconBg="bg-warm-green/10" delay={380}>
                                <div className="sm:col-span-2 space-y-2">
                                    {request.attachments.map((att) => {
                                        const FileIcon = getFileIcon(att.fileType);
                                        return (
                                            <div key={att.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                    <FileIcon className="w-3.5 h-3.5 text-warm-green" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-bold text-slate-700 truncate">{att.fileName}</p>
                                                    <p className="text-[10px] text-slate-400">{att.fileType} • {att.uploadedAt ? new Date(att.uploadedAt).toLocaleDateString('ar-EG') : ""}</p>
                                                </div>
                                                {att.filePath && (
                                                    <a href={att.filePath} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-warm-green hover:underline flex items-center gap-1 shrink-0">
                                                        <Download className="w-3 h-3" />
                                                        تحميل
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>

        {/* ===== Cancel Confirmation Dialog ===== */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogContent className="rounded-2xl border-0 shadow-2xl sm:max-w-md" dir="rtl">
                <AlertDialogHeader className="items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-7 h-7 text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-lg font-black text-slate-900">
                        تأكيد إلغاء الطلب
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-slate-500 font-medium leading-relaxed">
                        هل أنت متأكد من إلغاء هذا الطلب؟
                        <br />
                        <span className="text-red-400 font-bold">لا يمكن التراجع عن هذا الإجراء بعد التأكيد.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-3 sm:flex-row-reverse pt-2">
                    <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-10 px-5 font-bold text-sm flex-1"
                    >
                        <Ban className="w-4 h-4 ml-2" />
                        نعم، إلغاء الطلب
                    </AlertDialogAction>
                    <AlertDialogCancel className="rounded-xl h-10 px-5 font-bold text-sm flex-1 border-slate-200">
                        تراجع
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
