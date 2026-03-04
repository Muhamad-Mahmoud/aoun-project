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
} from "lucide-react";
import { cn } from "@/shared/utils";
import { getRequestById, cancelRequest } from "@/features/requests/api/requestsApi";
import {
    statusConfig,
    categoryConfig,
    resolveStatus,
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
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-slide-up {
  animation: fadeSlideUp 0.4s ease-out both;
}
@keyframes scoreRingFill {
  from { stroke-dashoffset: 283; }
}
`;

// ===== Section Info Row =====
function InfoRow({ label, value, index = 0 }: { label: string; value: React.ReactNode; index?: number }) {
    if (value === undefined || value === null || value === "") return null;
    const display = typeof value === "boolean" ? (value ? "نعم" : "لا") : String(value);
    return (
        <div className={cn(
            "flex items-start gap-3 py-2.5 px-3 rounded-lg transition-colors",
            index % 2 === 0 ? "bg-slate-50/60" : "bg-transparent"
        )}>
            <span className="text-xs font-bold text-slate-400 min-w-[110px] shrink-0">{label}</span>
            <span className="text-sm font-bold text-slate-700">{display}</span>
        </div>
    );
}

// ===== Section Card =====
function SectionCard({ icon: Icon, title, color, children, delay = 0 }: { icon: LucideIcon; title: string; color: string; children: React.ReactNode; delay?: number }) {
    return (
        <Card className="animate-fade-slide-up border-slate-100 rounded-2xl overflow-hidden" style={{ animationDelay: `${delay}ms` }}>
            <div className={cn("h-1 w-full", color)} />
            <div className="p-6">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Icon className="w-4 h-4 text-slate-600" />
                    {title}
                </h3>
                <div className="space-y-0.5">{children}</div>
            </div>
        </Card>
    );
}

// ===== Score Ring Component =====
function ScoreRing({ value, max = 100, label, color }: { value: number; max?: number; label: string; color: "blue" | "amber" }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((value / max) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
        blue: { stroke: "stroke-blue-500", bg: "from-blue-50 to-blue-100/50", border: "border-blue-100", text: "text-blue-600", sub: "text-blue-400" },
        amber: { stroke: "stroke-amber-500", bg: "from-amber-50 to-amber-100/50", border: "border-amber-100", text: "text-amber-600", sub: "text-amber-400" },
    };
    const c = colors[color];

    return (
        <div className={cn("flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-br border min-w-[150px]", c.bg, c.border)}>
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200/60" />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none" strokeWidth="6" strokeLinecap="round"
                        className={c.stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ animation: "scoreRingFill 1s ease-out forwards" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-2xl font-black", c.text)}>{value}</span>
                </div>
            </div>
            <p className={cn("text-[11px] font-bold", c.sub)}>{label}</p>
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

    // ===== Loading State =====
    if (loading) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white" dir="rtl">
                    <DashboardTopBar userType="family" />
                    <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32">
                        <div className="mx-auto max-w-4xl space-y-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Card className="rounded-2xl p-8">
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-48 rounded-2xl" />
                                <Skeleton className="h-48 rounded-2xl" />
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
                    <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32">
                        <div className="mx-auto max-w-4xl">
                            <Card className="p-12 text-center rounded-2xl border-red-200 bg-red-50">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <p className="text-lg font-bold text-red-600 mb-4">{error || "الطلب غير موجود"}</p>
                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" onClick={() => router.back()} className="rounded-xl"><ArrowRight className="w-4 h-4 ml-2" />العودة</Button>
                                    <Button onClick={fetchRequest} className="rounded-xl bg-warm-green hover:bg-warm-green/90">إعادة المحاولة</Button>
                                </div>
                            </Card>
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
    const cat = categoryConfig[request.requestType] || categoryConfig[6];
    const CatIcon = cat.icon;
    const isTerminal = ["REJECTED", "CANCELLED"].includes(statusKey);

    const emp = request.employmentData;
    const health = request.healthData;
    const living = request.livingCondition;
    const social = request.socialSupport;

    // Progress index for lifecycle
    const currentStepIndex = lifecycleSteps.findIndex(s => s.key === statusKey);

    return (
        <>
        {/* Inject animation keyframes */}
        <style>{animationStyles}</style>

        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white print:bg-white" dir="rtl">
                <DashboardTopBar userType="family" />

                <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="mx-auto max-w-4xl space-y-8">

                        {/* ===== Header ===== */}
                        <div className="animate-fade-slide-up flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <Button variant="ghost" onClick={() => router.back()} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 shrink-0 print:hidden">
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Copyable ID badge */}
                                        <button
                                            onClick={copyRequestId}
                                            className="group flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 border-none font-black text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            title="انسخ رقم الطلب"
                                        >
                                            #{request.id}
                                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <Badge variant="outline" className={cn("text-[11px] font-bold border px-3 py-1 rounded-full gap-1.5", status.bg, status.color)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </Badge>
                                        {request.priority && (
                                            <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full gap-1">
                                                <Star className="w-3 h-3" />
                                                {request.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">تفاصيل الطلب</h1>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                                        </span>
                                        {request.decisionAt && (
                                            <>
                                                <span className="text-slate-200">•</span>
                                                <span>القرار: {new Date(request.decisionAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </>
                                        )}
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
                                <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl h-10 px-4 font-bold text-xs text-slate-500 border-slate-200 hover:bg-slate-50">
                                    <Printer className="w-4 h-4 ml-1.5" />
                                    طباعة
                                </Button>
                                {canCancel && (
                                    <Button variant="outline" onClick={() => setShowCancelDialog(true)} disabled={cancelling} className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 h-10 px-5 font-bold text-xs">
                                        {cancelling ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Ban className="w-4 h-4 ml-2" />}
                                        إلغاء الطلب
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* ===== Status Lifecycle Timeline ===== */}
                        {!isTerminal && (
                            <Card className="animate-fade-slide-up border-slate-100 rounded-2xl p-6" style={{ animationDelay: "80ms" }}>
                                <div className="flex items-center justify-between gap-2">
                                    {lifecycleSteps.map((step, idx) => {
                                        const isActive = step.key === statusKey;
                                        const isDone = idx < currentStepIndex;
                                        return (
                                            <React.Fragment key={step.key}>
                                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 text-xs font-black",
                                                        isDone
                                                            ? "bg-emerald-500 text-white"
                                                            : isActive
                                                                ? "bg-warm-green text-white shadow-lg shadow-warm-green/30 scale-110"
                                                                : "bg-slate-100 text-slate-400"
                                                    )}>
                                                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-bold text-center whitespace-nowrap",
                                                        isActive ? "text-warm-green" : isDone ? "text-emerald-600" : "text-slate-400"
                                                    )}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {idx < lifecycleSteps.length - 1 && (
                                                    <div className="flex-1 h-0.5 rounded-full min-w-[20px] bg-slate-200 overflow-hidden">
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
                            </Card>
                        )}

                        {/* Terminal status badge (Rejected / Cancelled) */}
                        {isTerminal && (
                            <Card className={cn(
                                "animate-fade-slide-up rounded-2xl p-5 flex items-center gap-4",
                                statusKey === "REJECTED" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                            )} style={{ animationDelay: "80ms" }}>
                                <StatusIcon className={cn("w-6 h-6", status.color)} />
                                <div>
                                    <p className={cn("text-sm font-black", status.color)}>{status.label}</p>
                                    {request.decisionReason && (
                                        <p className="text-xs text-slate-500 mt-1">{request.decisionReason}</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* ===== Main Info Card ===== */}
                        <Card className="animate-fade-slide-up border-slate-100 rounded-3xl overflow-hidden shadow-lg" style={{ animationDelay: "150ms" }}>
                            <div className="h-1.5 w-full bg-gradient-to-r from-warm-green via-emerald-400 to-warm-green/60" />
                            <CardContent className="p-6 sm:p-8 space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border border-transparent", cat.bg)}>
                                        <CatIcon className={cn("w-4 h-4", cat.color)} />
                                        <span className={cn("text-xs font-bold", cat.color)}>{cat.label}</span>
                                    </div>
                                    {request.otherRequestType && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-xs font-bold text-slate-600">{request.otherRequestType}</span>
                                        </div>
                                    )}
                                    {request.predictedAssistanceType && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100">
                                            <span className="text-xs font-bold text-purple-600">نوع المساعدة المقترح: {request.predictedAssistanceType}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-warm-green rounded-full" />
                                        وصف الحالة
                                    </h3>
                                    <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {request.description || "لا يوجد وصف"}
                                        </p>
                                    </div>
                                </div>

                                {/* Decision Reason (not terminal — shown inline for non-terminal) */}
                                {!isTerminal && request.decisionReason && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-amber-400 rounded-full" />
                                            سبب القرار
                                        </h3>
                                        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                                            <p className="text-sm font-medium text-amber-700 leading-relaxed">{request.decisionReason}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Scores — Circular Progress Rings */}
                                {(request.needScore != null || request.priorityScore != null) && (
                                    <div className="flex gap-4 flex-wrap">
                                        {request.needScore != null && (
                                            <ScoreRing value={request.needScore} label="درجة الاحتياج" color="blue" />
                                        )}
                                        {request.priorityScore != null && (
                                            <ScoreRing value={request.priorityScore} label="درجة الأولوية" color="amber" />
                                        )}
                                    </div>
                                )}

                                {/* Handled By */}
                                {request.handledBy && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <Shield className="w-5 h-5 text-green-600 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-green-500">تمت المعالجة بواسطة</p>
                                            <p className="text-sm font-black text-green-700">{request.handledBy.name}</p>
                                            <p className="text-[10px] text-green-500">{request.handledBy.email}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* ===== Details Grid ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Employment */}
                            {emp && (
                                <SectionCard icon={Briefcase} title="الحالة المهنية" color="bg-blue-500" delay={200}>
                                    <InfoRow label="يعمل حالياً" value={emp.isWorking} index={0} />
                                    {emp.isWorking && (
                                        <>
                                            <InfoRow label="نوع العمل" value={emp.workingType != null ? workingTypeLabels[emp.workingType] : undefined} index={1} />
                                            <InfoRow label="نوع التوظيف" value={emp.employmentType != null ? employmentTypeLabels[emp.employmentType] : undefined} index={2} />
                                            <InfoRow label="المسمى الوظيفي" value={emp.jobTitle} index={3} />
                                            <InfoRow label="جهة العمل" value={emp.company} index={4} />
                                            <InfoRow label="الراتب الشهري" value={emp.salaryMonthly != null ? `${emp.salaryMonthly} ج.م` : undefined} index={5} />
                                            <InfoRow label="وصف العمل" value={emp.workDescription} index={6} />
                                            <InfoRow label="موقع العمل" value={emp.workLocation} index={7} />
                                            <InfoRow label="سنوات الخدمة" value={emp.yearsAtJob} index={8} />
                                        </>
                                    )}
                                    {!emp.isWorking && (
                                        <>
                                            <InfoRow label="سبب عدم العمل" value={emp.unEmploymentReason} index={1} />
                                            <InfoRow label="يبحث عن عمل" value={emp.isLookingForJob} index={2} />
                                            <InfoRow label="يحتاج تدريب" value={emp.needsTraining} index={3} />
                                            <InfoRow label="الدخل المتوقع" value={emp.estimatedIncomeMonthly != null ? `${emp.estimatedIncomeMonthly} ج.م` : undefined} index={4} />
                                        </>
                                    )}
                                </SectionCard>
                            )}

                            {/* Health */}
                            {health && (
                                <SectionCard icon={Heart} title="الحالة الصحية" color="bg-rose-500" delay={260}>
                                    <InfoRow label="تأمين طبي" value={health.hasInsurance} index={0} />
                                    {health.hasInsurance && <InfoRow label="نوع التأمين" value={health.insuranceType} index={1} />}
                                    <InfoRow label="إعاقة" value={health.hasDisability} index={2} />
                                    {health.hasDisability && <InfoRow label="نوع الإعاقة" value={health.disabilityType} index={3} />}
                                    <InfoRow label="مرض مزمن" value={health.hasChronicDisease} index={4} />
                                    {health.hasChronicDisease && (
                                        <>
                                            <InfoRow label="نوع المرض" value={health.chronicDiseaseType} index={5} />
                                            <InfoRow label="تكلفة العلاج" value={health.medicalCostMonthly != null ? `${health.medicalCostMonthly} ج.م` : undefined} index={6} />
                                        </>
                                    )}
                                </SectionCard>
                            )}

                            {/* Living Conditions */}
                            {living && (
                                <SectionCard icon={Home} title="الحالة المعيشية" color="bg-sky-500" delay={320}>
                                    <InfoRow label="نوع السكن" value={living.housingType != null ? housingLabels[living.housingType] || String(living.housingType) : undefined} index={0} />
                                    <InfoRow label="يمتلك سيارة" value={living.hasCar} index={1} />
                                    <InfoRow label="الإيجار الشهري" value={living.rentMonthly != null ? `${living.rentMonthly} ج.م` : undefined} index={2} />
                                    <InfoRow label="المصاريف الشهرية" value={living.monthlyExpenses != null ? `${living.monthlyExpenses} ج.م` : undefined} index={3} />
                                    <InfoRow label="فواتير شهرية" value={living.utilitiesMonthly != null ? `${living.utilitiesMonthly} ج.م` : undefined} index={4} />
                                    <InfoRow label="إنفاق الأسرة" value={living.householdMonthlySpending != null ? `${living.householdMonthlySpending} ج.م` : undefined} index={5} />
                                    <InfoRow label="دفع سنوي" value={living.annualPayment != null ? `${living.annualPayment} ج.م` : undefined} index={6} />
                                    <InfoRow label="التزامات أخرى" value={living.hasOtherCommitments} index={7} />
                                    {living.hasOtherCommitments && (
                                        <>
                                            <InfoRow label="نوع الالتزام" value={living.otherCommitmentsType} index={8} />
                                            <InfoRow label="مبلغ الالتزام" value={living.otherCommitmentsAmount != null ? `${living.otherCommitmentsAmount} ج.م` : undefined} index={9} />
                                        </>
                                    )}
                                </SectionCard>
                            )}

                            {/* Social Support */}
                            {social && (
                                <SectionCard icon={Users} title="الدعم الاجتماعي" color="bg-violet-500" delay={380}>
                                    <InfoRow label="مسجل بالدعم" value={social.registeredSocialSupport} index={0} />
                                    {social.registeredSocialSupport && (
                                        <InfoRow label="مبلغ الدعم" value={social.socialSupportAmount != null ? `${social.socialSupportAmount} ج.م` : undefined} index={1} />
                                    )}
                                    <InfoRow label="جهات أخرى" value={social.otherAidProviders} index={2} />
                                    <InfoRow label="نوع المساعدة" value={social.otherAidType} index={3} />
                                    <InfoRow label="مبلغ المساعدة" value={social.otherAidAmount != null ? `${social.otherAidAmount} ج.م` : undefined} index={4} />
                                </SectionCard>
                            )}
                        </div>

                        {/* ===== Attachments ===== */}
                        {request.attachments && request.attachments.length > 0 && (
                            <Card className="animate-fade-slide-up border-slate-100 rounded-2xl overflow-hidden" style={{ animationDelay: "440ms" }}>
                                <div className="h-1 w-full bg-warm-green" />
                                <div className="p-6">
                                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                                        <FileText className="w-4 h-4 text-slate-600" />
                                        المستندات المرفقة ({request.attachments.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {request.attachments.map((att) => {
                                            const FileIcon = getFileIcon(att.fileType);
                                            return (
                                                <div key={att.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                        <FileIcon className="w-4 h-4 text-warm-green" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-700 truncate">{att.fileName}</p>
                                                        <p className="text-[10px] text-slate-400">{att.fileType} • {att.uploadedAt ? new Date(att.uploadedAt).toLocaleDateString('ar-EG') : ""}</p>
                                                    </div>
                                                    {att.filePath && (
                                                        <a href={att.filePath} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-warm-green hover:underline flex items-center gap-1 shrink-0">
                                                            <Download className="w-3 h-3" />
                                                            تحميل
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>

        {/* ===== Cancel Confirmation Dialog ===== */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogContent className="rounded-2xl border-0 shadow-2xl sm:max-w-md" dir="rtl">
                <AlertDialogHeader className="items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-xl font-black text-slate-900">
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
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 px-6 font-bold text-sm flex-1"
                    >
                        <Ban className="w-4 h-4 ml-2" />
                        نعم، إلغاء الطلب
                    </AlertDialogAction>
                    <AlertDialogCancel className="rounded-xl h-11 px-6 font-bold text-sm flex-1 border-slate-200">
                        تراجع
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
