"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { useAssociationRequestDetail } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
    Loader2, AlertCircle, CheckCircle2, XCircle, ArrowRight, Download, FileText, User, HeartPulse, Home, Briefcase, Bot, FileJson2, HeartHandshake,
    Shield, Clock, MapPin, Copy, Printer, Star, Ban, Heart, Users, Sparkles, ScanLine, File, Image as ImageIcon, Paperclip, Brain
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { categoryConfig, resolveCategory, workingTypeLabels, employmentTypeLabels, resolveStatus, statusConfig, housingLabels } from "@/features/requests/config/requestConfig";
import { cn } from "@/shared/utils";
import { toast } from "sonner";
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
`;

// ===== Field Component =====
function Field({ label, value, colSpan = 1 }: { label: string; value: React.ReactNode; colSpan?: number }) {
    if (value === undefined || value === null || value === "") return null;
    const display = typeof value === "boolean" ? (value ? "نعم" : "لا") : value;
    return (
        <div className={cn("flex flex-col gap-1", colSpan === 2 && "sm:col-span-2")}>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-[13px] font-semibold text-foreground bg-card rounded-lg px-3 py-2 flex items-center border border-border min-h-[34px]">
                {display}
            </span>
        </div>
    );
}

// ===== Section Card =====
function Section({ icon: Icon, title, iconColor = "text-warm-green", iconBg = "bg-warm-green/10", children, delay = 0 }: {
    icon: LucideIcon; title: string; iconColor?: string; iconBg?: string; children: React.ReactNode; delay?: number;
}) {
    return (
        <div className="anim-up bg-muted/60 rounded-2xl border border-border p-4 sm:p-5" style={{ animationDelay: `${delay}ms` }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
                <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", iconBg, iconColor)}>
                    <Icon className="w-3.5 h-3.5" />
                </span>
                <h4 className="text-[14px] font-black text-foreground leading-none">{title}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children}
            </div>
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

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const { request, isLoading, isActionLoading, error, acceptRequest, rejectRequest } = useAssociationRequestDetail(id);

    const [showAcceptForm, setShowAcceptForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);

    // Accept Form State
    const [acceptanceNotes, setAcceptanceNotes] = useState("");
    const [approvedAmount, setApprovedAmount] = useState("");
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
    const [actionError, setActionError] = useState("");

    // Reject Form State
    const [rejectionReason, setRejectionReason] = useState("");

    const formatCurrency = (v: number | null | undefined) => {
        if (v === undefined || v === null) return undefined;
        return `${v.toLocaleString()} ج.م`;
    };

    const copyRequestId = () => {
        navigator.clipboard.writeText(`#${request?.id}`);
        toast.success("تم نسخ رقم الطلب");
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !request) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center p-8">
                        <Card className="p-8 text-center text-destructive max-w-md w-full border border-destructive/20 bg-destructive/10">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-70" />
                            <p className="font-bold mb-4 text-destructive">{error || "تعذر العثور على الطلب"}</p>
                            <Link href="/dashboard/organization/pending">
                                <Button variant="outline" className="rounded-xl">العودة للقائمة</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const handleAccept = async () => {
        if (acceptanceNotes.length < 10) {
            setActionError("ملاحظات القبول يجب أن تكون 10 أحرف على الأقل.");
            return;
        }
        setActionError("");
        const success = await acceptRequest({
            acceptanceNotes,
            ...(approvedAmount ? { approvedAmount: Number(approvedAmount) } : {}),
            ...(expectedDeliveryDate ? { expectedDeliveryDate } : {}),
        });
        if (success) {
            setShowAcceptForm(false);
            toast.success("تمت الموافقة على الطلب");
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setActionError("يرجى إدخال سبب الرفض.");
            return;
        }
        setActionError("");
        const success = await rejectRequest({ rejectionReason });
        if (success) {
            setShowRejectForm(false);
            toast.success("تم رفض الطلب");
        }
    };

    const isPending = request.status === RequestStatus.Pending || request.status === RequestStatus.InReview;
    const statusKey = resolveStatus(request.status);
    const status = statusConfig[statusKey] || statusConfig.PENDING;
    const StatusIcon = status.icon;
    const cat = categoryConfig[resolveCategory(request.requestType)] || categoryConfig["Other"];
    const CatIcon = cat.icon;
    const isTerminal = ["REJECTED", "CANCELLED"].includes(statusKey);

    const emp = request.employmentData;
    const health = request.healthData;
    const living = request.livingCondition;
    const social = request.socialSupport;

    return (
        <>
        <style>{animationStyles}</style>

        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background print:bg-card" dir="rtl">
                <DashboardTopBar userType="organization" />

                <main className="p-4 sm:p-8 pt-20 lg:pt-28 relative z-10">
                    <div className="mx-auto max-w-6xl space-y-6">

                        {/* ===== Compact Header ===== */}
                        <div className="anim-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-card shadow-sm border border-border hover:bg-muted shrink-0 print:hidden p-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl font-black text-foreground">تفاصيل الطلب</h1>
                                        <button
                                            onClick={copyRequestId}
                                            className="group flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-muted-foreground border-none font-black text-[10px] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
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
                                            <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-primary/10 text-amber-600 px-2 py-0.5 rounded-full gap-1">
                                                <Star className="w-2.5 h-2.5" />
                                                {request.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-medium flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : "—"}
                                        </span>
                                        {(request.city || request.governorate) && (
                                            <>
                                                <span className="text-muted-foreground/30">•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {request.governorate || ""} {request.city || ""}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 print:hidden">
                                <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl h-9 px-3 font-bold text-[11px] text-muted-foreground border-border hover:bg-muted">
                                    <Printer className="w-3.5 h-3.5 ml-1.5" />
                                    طباعة
                                </Button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Actions / Forms (Only if pending) */}
                                {isPending && (
                                    <div className="anim-up bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
                                        <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-foreground">
                                            <span className="w-1 h-5 bg-primary rounded-full" />
                                            قرار الجمعية
                                        </h3>
                                        
                                        {!showAcceptForm && !showRejectForm ? (
                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                <Button onClick={() => setShowAcceptForm(true)} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 h-11">
                                                    <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة على الطلب
                                                </Button>
                                                <Button onClick={() => setShowRejectForm(true)} variant="destructive" className="flex-1 rounded-xl h-11">
                                                    <XCircle className="w-4 h-4 ml-2" /> رفض الطلب
                                                </Button>
                                            </div>
                                        ) : showAcceptForm ? (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">ملاحظات القبول (مطلوب)</label>
                                                    <textarea 
                                                        className="w-full text-sm p-3 border rounded-xl bg-background focus:ring-1 focus:ring-green-500 min-h-[100px]"
                                                        placeholder="شرح وتفاصيل المساعدة المقدمة..."
                                                        value={acceptanceNotes}
                                                        onChange={(e) => setAcceptanceNotes(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold mb-2">المبلغ المعتمد (اختياري)</label>
                                                        <input 
                                                            type="number"
                                                            className="w-full text-sm p-3 border rounded-xl bg-background"
                                                            placeholder="مثال: 5000"
                                                            value={approvedAmount}
                                                            onChange={(e) => setApprovedAmount(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-2">تاريخ التسليم المتوقع (اختياري)</label>
                                                        <input 
                                                            type="date"
                                                            className="w-full text-sm p-3 border rounded-xl bg-background"
                                                            value={expectedDeliveryDate}
                                                            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {actionError && <p className="text-red-600 text-sm font-bold">{actionError}</p>}
                                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                    <Button onClick={handleAccept} disabled={isActionLoading} className="rounded-xl bg-green-600 hover:bg-green-700 flex-1 h-11">
                                                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle2 className="w-4 h-4 ml-2" />}
                                                        تأكيد الموافقة
                                                    </Button>
                                                    <Button onClick={() => { setShowAcceptForm(false); setActionError(""); }} disabled={isActionLoading} variant="outline" className="rounded-xl flex-1 h-11">
                                                        إلغاء
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-red-700 mb-2">سبب الرفض (مطلوب)</label>
                                                    <textarea 
                                                        className="w-full text-sm p-3 border-red-200 bg-red-50/50 rounded-xl focus:ring-1 focus:ring-red-500 min-h-[100px]"
                                                        placeholder="يرجى توضيح سبب الرفض..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                    />
                                                </div>
                                                {actionError && <p className="text-red-600 text-sm font-bold">{actionError}</p>}
                                                <div className="flex gap-2 pt-2">
                                                    <Button onClick={handleReject} disabled={isActionLoading} variant="destructive" className="rounded-xl h-11 flex-1">
                                                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <XCircle className="w-4 h-4 ml-2" />}
                                                        تأكيد الرفض
                                                    </Button>
                                                    <Button onClick={() => { setShowRejectForm(false); setActionError(""); }} disabled={isActionLoading} variant="outline" className="rounded-xl h-11 flex-1">
                                                        إلغاء
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Decision Info (if already decided) */}
                                {!isPending && request.decisionReason && (
                                    <div className={cn("anim-up rounded-2xl p-5 border shadow-sm", request.status === RequestStatus.Approved ? 'border-green-200 bg-primary/5' : 'border-red-200 bg-red-50/50')} style={{ animationDelay: "60ms" }}>
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                            {request.status === RequestStatus.Approved ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-red-600" />}
                                            الملاحظات والقرارات
                                        </h3>
                                        <p className="text-foreground font-medium bg-background/50 p-4 rounded-xl border border-border">{request.decisionReason}</p>
                                        {request.decisionAt && (
                                            <p className="text-xs text-muted-foreground mt-4 font-bold flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                تاريخ القرار: {format(new Date(request.decisionAt), 'dd MMMM yyyy - p', { locale: ar })}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* ===== Request Overview Card ===== */}
                                <div className="anim-up bg-card rounded-2xl border border-border shadow-sm overflow-hidden" style={{ animationDelay: "120ms" }}>
                                    <div className="h-1 w-full bg-gradient-to-r from-warm-green via-emerald-400 to-warm-green/40" />
                                    <div className="p-5 sm:p-6 space-y-5">
                                        {/* Tags row */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-transparent text-xs font-bold", cat.bg, cat.color)}>
                                                <CatIcon className="w-3.5 h-3.5" />
                                                {cat.label}
                                            </div>
                                            {request.otherRequestType && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-bold text-muted-foreground">
                                                    {request.otherRequestType}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <h3 className="text-[13px] font-black text-foreground flex items-center gap-2">
                                                <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                                                وصف الحالة
                                            </h3>
                                            <div className="p-4 rounded-xl bg-muted/70 border border-border">
                                                <p className="text-[13px] font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                    {request.description || "لا يوجد وصف"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Family Info Inline */}
                                        {request.familyInfo && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <h3 className="text-[13px] font-black text-foreground flex items-center gap-2 mb-3">
                                                    <User className="w-4 h-4 text-primary" />
                                                    بيانات الأسرة
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Field label="الاسم" value={request.familyInfo.familyName || request.familyInfo.firstName} />
                                                    <Field label="رقم التواصل" value={request.familyInfo.phone} />
                                                    <Field label="الرقم القومي" value={request.familyInfo.headNationalId} />
                                                    <Field label="عدد الأفراد" value={request.familyInfo.memberCount || request.familyMemberCount || 0} />
                                                </div>
                                                <div className="mt-4 flex gap-3">
                                                    <Link href={`/dashboard/organization/messages?requestId=${id}`} className="flex-1">
                                                        <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 h-11 font-bold">
                                                            تواصل مع الأسرة
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ===== Details Grid ===== */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Employment */}
                                    {emp && (
                                        <Section icon={Briefcase} title="الحالة المهنية" iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={180}>
                                            <Field label="حالة التوظيف" value={
                                                <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center", emp.isWorking ? "bg-emerald-100 text-primary" : "bg-rose-100 text-rose-700")}>
                                                    {emp.isWorking ? "يعمل" : "لا يعمل"}
                                                </span>
                                            } />
                                            {emp.isWorking && (
                                                <>
                                                    <Field label="نوع العمل" value={emp.workingType != null ? workingTypeLabels[emp.workingType as number] : undefined} />
                                                    <Field label="القطاع" value={emp.employmentType != null ? employmentTypeLabels[emp.employmentType as number] : undefined} />
                                                    <Field label="المسمى الوظيفي" value={emp.jobTitle} />
                                                    <Field label="جهة العمل" value={emp.company} />
                                                    <Field label="الراتب الشهري" value={formatCurrency(emp.salaryMonthly)} />
                                                    <Field label="سنوات الخدمة" value={emp.yearsAtJob} />
                                                </>
                                            )}
                                            {!emp.isWorking && (
                                                <>
                                                    <Field label="سبب التعطل" value={emp.unEmploymentReason} colSpan={2} />
                                                    <Field label="يبحث عن عمل" value={emp.isLookingForJob} />
                                                    <Field label="يحتاج تدريب" value={emp.needsTraining} />
                                                </>
                                            )}
                                        </Section>
                                    )}

                                    {/* Health */}
                                    {health && (
                                        <Section icon={HeartPulse} title="الحالة الصحية" iconColor="text-rose-500" iconBg="bg-rose-500/10" delay={230}>
                                            <Field label="تأمين طبي" value={health.hasInsurance ? <span className="text-primary">نعم{health.insuranceType ? ` (${health.insuranceType})` : ''}</span> : "لا يوجد"} />
                                            <Field label="إعاقة" value={health.hasDisability ? <span className="text-amber-600">نعم{health.disabilityType ? ` (${health.disabilityType})` : ''}</span> : "لا يوجد"} />
                                            <Field label="مرض مزمن" value={health.hasChronicDisease ? <span className="text-rose-600">نعم{health.chronicDiseaseType ? ` (${health.chronicDiseaseType})` : ''}</span> : "لا يوجد"} />
                                            {health.hasChronicDisease && (
                                                <Field label="التكلفة الطبية الشهرية" value={formatCurrency(health.medicalCostMonthly)} />
                                            )}
                                        </Section>
                                    )}

                                    {/* Living Conditions */}
                                    {living && (
                                        <Section icon={Home} title="السكن والمعيشة" iconColor="text-teal-500" iconBg="bg-teal-500/10" delay={280}>
                                            <Field label="نوع السكن" value={living.housingType != null ? housingLabels[living.housingType as any] || String(living.housingType) : undefined} />
                                            <Field label="يمتلك سيارة" value={living.hasCar} />
                                            <Field label="الإيجار الشهري" value={formatCurrency(living.rentMonthly)} />
                                            <Field label="المصاريف الشهرية" value={formatCurrency(living.monthlyExpenses)} />
                                            <Field label="فواتير الخدمات" value={formatCurrency(living.utilitiesMonthly)} />
                                            <Field label="إنفاق الأسرة" value={formatCurrency(living.householdMonthlySpending)} />
                                            <Field label="التزامات أخرى" value={living.hasOtherCommitments} />
                                            {living.hasOtherCommitments && (
                                                <>
                                                    <Field label="نوع الالتزام" value={living.otherCommitmentsType} />
                                                    <Field label="مبلغ الالتزام" value={formatCurrency(living.otherCommitmentsAmount)} />
                                                </>
                                            )}
                                        </Section>
                                    )}

                                    {/* Social Support */}
                                    {social && (
                                        <Section icon={Users} title="الدعم الاجتماعي" iconColor="text-primary" iconBg="bg-primary/10" delay={330}>
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
                                        <div className="sm:col-span-2 space-y-3">
                                            {request.attachments.map((att: any, idx: number) => {
                                                const FileIcon = getFileIcon(att.fileType);
                                                const hasOcrData = att.aiOcrData && Object.keys(att.aiOcrData).length > 0;
                                                return (
                                                    <div key={idx} className="bg-card rounded-xl border border-border overflow-hidden">
                                                        <div className="flex items-center gap-3 p-3">
                                                            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                                                <FileIcon className="w-3.5 h-3.5 text-warm-green" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[12px] font-bold text-foreground truncate">{att.fileName}</p>
                                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                                    <p className="text-[10px] text-muted-foreground">{att.fileType}</p>
                                                                    {att.aiOcrStatus && att.aiOcrStatus !== 'None' && (
                                                                        <span className={cn(
                                                                            "text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                                                                            att.aiOcrStatus === 'Completed' ? "bg-primary/10 text-primary border-primary/20" :
                                                                            att.aiOcrStatus === 'Failed' ? "bg-destructive/10 text-destructive border-red-100" :
                                                                            "bg-amber-100 text-amber-700 border-amber-200"
                                                                        )}>
                                                                            <ScanLine className="w-2.5 h-2.5" />
                                                                            OCR: {att.aiOcrStatus === 'Completed' ? 'تم' : att.aiOcrStatus === 'Failed' ? 'فشل' : 'جاري'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={att.filePath || att.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors shrink-0"
                                                                title="تحميل"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>
                                                        {hasOcrData && (
                                                            <div className="bg-muted/50 border-t border-border p-3">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {Object.entries(att.aiOcrData).map(([key, val]: [string, any], i) => (
                                                                        <div key={i} className="bg-card border border-border rounded-lg p-2 flex flex-col">
                                                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{key}</span>
                                                                            <span className="text-[11px] font-semibold text-foreground truncate" title={String(val)}>{String(val)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Section>
                                )}
                            </div>

                            {/* Sidebar Column (AI Scoring) */}
                            <div className="space-y-6">
                                <div className="anim-up bg-card rounded-2xl border border-border shadow-sm overflow-hidden sticky top-28" style={{ animationDelay: "140ms" }}>
                                    <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500/40" />
                                    <div className="p-5 sm:p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <h4 className="text-[14px] font-black text-foreground flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Brain className="w-3.5 h-3.5 text-amber-600" />
                                                </span>
                                                تقييم النظام الآلي
                                            </h4>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <div className="flex justify-between items-baseline text-sm mb-2">
                                                    <span className="text-muted-foreground text-xs font-bold uppercase">مؤشر الاحتياج</span>
                                                    <span className="font-black text-foreground text-lg">
                                                        {request.needScore != null ? (request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)) : '—'}<span className="text-muted-foreground text-xs font-normal">/100</span>
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-l from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all" style={{ width: `${request.needScore != null ? (request.needScore <= 1 ? request.needScore * 100 : request.needScore) : 0}%` }} />
                                                </div>
                                            </div>

                                            {request.aiNeedLevel && (
                                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                                    <span className="block text-[11px] text-muted-foreground font-bold uppercase tracking-wide">مستوى الحاجة</span>
                                                    <span className={cn(
                                                        "inline-block px-2.5 py-1 border rounded-md text-sm font-black",
                                                        request.aiNeedLevel === 'High' ? 'bg-destructive/10 text-destructive border-red-200' :
                                                        request.aiNeedLevel === 'Medium' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                                        'bg-primary/10 text-primary border-primary/20'
                                                    )}>
                                                        {request.aiNeedLevel === 'High' ? 'عالي' : request.aiNeedLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                                                    </span>
                                                </div>
                                            )}



                                            <div className="pt-4 border-t border-border flex justify-between items-center gap-2">
                                                <span className="block text-[11px] text-muted-foreground font-bold uppercase tracking-wide">النوع المقترح</span>
                                                <span className="inline-block px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-md text-[11px] font-black text-primary text-end">
                                                    {categoryConfig[resolveCategory(request.predictedAssistanceType || request.requestType)]?.label || request.predictedAssistanceType || request.requestType || 'غير محدد'}
                                                </span>
                                            </div>

                                            {(request.aiMethod || request.aiErrorMessage) && (
                                                <div className="pt-4 border-t border-border">
                                                    <span className="text-[11px] text-muted-foreground mb-2 font-bold uppercase tracking-wide flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5" /> طريقة التقييم
                                                    </span>
                                                    <p className="text-[12px] font-semibold text-foreground bg-muted p-2.5 rounded-lg border border-border">{request.aiMethod || 'غير محدد'}</p>
                                                    {request.aiPredictionStatus === 'Failed' && request.aiErrorMessage && (
                                                        <div className="mt-2 bg-destructive/10 border border-red-200 rounded-lg p-3 text-xs text-destructive">
                                                            <span className="font-black flex items-center gap-1.5 mb-1"><AlertCircle className="w-3.5 h-3.5" /> تعذر التقييم الآلي:</span>
                                                            <span className="font-medium leading-relaxed">{request.aiErrorMessage}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
        </>
    );
}
