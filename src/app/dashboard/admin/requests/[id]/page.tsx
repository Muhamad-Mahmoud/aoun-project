"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
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
    MapPin,
    Users,
    Coins,
    Bot,
    Download,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { adminApi } from "@/features/admin/api/adminApi";
import {
    statusConfig,
    categoryConfig,
    resolveStatus,
    resolveCategory,
} from "@/features/requests/config/requestConfig";
import type { RequestDetailResponse } from "@/features/requests/types";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

// ===== Field Component =====
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

// ===== Section Card =====
function Section({ icon: Icon, title, iconColor = "text-sky-600", iconBg = "bg-sky-50", children }: {
    icon: LucideIcon; title: string; iconColor?: string; iconBg?: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-4 sm:p-5">
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

export default function AdminRequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [request, setRequest] = useState<RequestDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequest = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminApi.getRequestById(id);
            setRequest(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "فشل تحميل تفاصيل الطلب";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRequest();
    }, [id, fetchRequest]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
                <p className="text-slate-500 font-bold">جاري تحميل تفاصيل الطلب...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="bg-red-50 text-red-500 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-md text-center border border-red-100">
                    <AlertCircle className="w-12 h-12" />
                    <h3 className="text-lg font-black">فشل تحميل تفاصيل الطلب</h3>
                    <p className="text-sm opacity-80">{error || "تعذر العثور على الطلب"}</p>
                    <div className="flex gap-3 mt-2">
                        <Button variant="outline" onClick={() => router.back()} className="bg-white hover:bg-slate-50 text-slate-700">
                            <ArrowRight className="w-4 h-4 ml-2" /> العودة
                        </Button>
                        <Button onClick={fetchRequest} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            إعادة المحاولة
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const resolvedStatus = resolveStatus(request.status);
    const currentStatusConfig = statusConfig[resolvedStatus] || statusConfig.PENDING;
    const StatusIcon = currentStatusConfig.icon;

    const resolvedCategory = resolveCategory(request.requestType);
    const catConfig = categoryConfig[resolvedCategory] || categoryConfig.GENERAL;
    const CategoryIcon = catConfig.icon;

    const empData = request.employmentData;
    const healthData = request.healthData;
    const housingData = request.livingCondition;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            طلب رقم #{request.id}
                            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border font-bold", currentStatusConfig.color)}>
                                <StatusIcon className="w-4 h-4" />
                                {currentStatusConfig.label}
                            </span>
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> تم التقديم في: {new Date(request.createdAt).toLocaleDateString('ar-EG')}</span>
                            <span className="flex items-center gap-1.5"><CategoryIcon className="w-4 h-4" /> {catConfig.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-sky-500" />
                            بيانات الطلب الأساسية
                        </h3>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {request.description || "لم يتم توفير تفاصيل إضافية"}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-violet-500" />
                            معلومات الأسرة
                        </h3>
                        <div className="space-y-4">
                            {empData && (
                                <Section icon={Briefcase} title="العمل والدخل" iconColor="text-blue-600" iconBg="bg-blue-50">
                                    <Field label="يعمل حالياً؟" value={empData.isWorking} />
                                    {empData.isWorking && (
                                        <>
                                            <Field label="المسمى الوظيفي" value={empData.jobTitle} />
                                            <Field label="جهة العمل" value={empData.company} />
                                            <Field label="الدخل الشهري" value={empData.salaryMonthly ? `${empData.salaryMonthly} ج.م` : null} />
                                        </>
                                    )}
                                    {!empData.isWorking && (
                                        <>
                                            <Field label="سبب التعطل" value={empData.unEmploymentReason} />
                                            <Field label="يبحث عن عمل؟" value={empData.isLookingForJob} />
                                        </>
                                    )}
                                </Section>
                            )}
                            
                            {healthData && (
                                <Section icon={Heart} title="الحالة الصحية" iconColor="text-red-600" iconBg="bg-red-50">
                                    <Field label="تأمين صحي؟" value={healthData.hasInsurance} />
                                    <Field label="أمراض مزمنة؟" value={healthData.hasChronicDisease} />
                                    {healthData.hasChronicDisease && <Field label="نوع المرض" value={healthData.chronicDiseaseType} />}
                                    <Field label="تكلفة العلاج الشهري" value={healthData.medicalCostMonthly ? `${healthData.medicalCostMonthly} ج.م` : null} />
                                </Section>
                            )}
                            {housingData && (
                                <Section icon={Home} title="السكن والمعيشة" iconColor="text-orange-600" iconBg="bg-orange-50">
                                    <Field label="نوع السكن" value={housingData.housingType} />
                                    {housingData.housingType === "Rented" && <Field label="الإيجار الشهري" value={housingData.rentMonthly ? `${housingData.rentMonthly} ج.م` : null} />}
                                    <Field label="فواتير مرافق شهرية" value={housingData.utilitiesMonthly ? `${housingData.utilitiesMonthly} ج.م` : null} />
                                </Section>
                            )}
                        </div>
                    </div>

                    {/* Attachments */}
                    {request.attachments && request.attachments.length > 0 && (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <Download className="w-5 h-5 text-indigo-500" />
                                المرفقات
                                <span className="mr-auto bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">
                                    {request.attachments.length} ملفات
                               </span>
                            </h3>
                            <div className="space-y-3">
                                {request.attachments.map((file, idx) => (
                                    <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden group hover:border-primary/30 transition-colors bg-white">
                                        <a href={file.filePath} target="_blank" rel="noopener noreferrer" 
                                           className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                                            <div className="bg-indigo-50 p-2 rounded-md text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Download className="w-4 h-4" />
                                            </div>
                                            <div className="overflow-hidden flex-1">
                                                <p className="text-sm font-medium truncate text-left" dir="ltr">{file.fileName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-slate-500 truncate">{file.fileType}</p>
                                                    {file.aiOcrStatus && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                                            file.aiOcrStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                                            file.aiOcrStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            OCR: {
                                                                file.aiOcrStatus === 'Completed' ? 'تم' :
                                                                file.aiOcrStatus === 'Failed' ? 'فشل' : 'جاري'
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </a>
                                        
                                        {/* OCR Data Display */}
                                        {(file.aiOcrData || file.aiErrorMessage) && (
                                            <div className="bg-slate-50 border-t border-slate-100 p-3 text-sm">
                                                <div className="font-semibold text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                                                    <Bot className="w-3.5 h-3.5" /> استخراج البيانات (OCR)
                                                </div>
                                                {file.aiErrorMessage && (
                                                    <div className="text-red-600 bg-red-50 p-2 rounded text-xs mb-2 border border-red-100">
                                                        <span className="font-bold">خطأ:</span> {file.aiErrorMessage}
                                                    </div>
                                                )}
                                                {file.aiOcrData && Object.keys(file.aiOcrData).length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                        {Object.entries(file.aiOcrData).map(([key, val], i) => (
                                                            <div key={i} className="flex flex-col bg-white p-2 rounded border border-slate-100 shadow-sm">
                                                                <span className="text-slate-400 font-medium mb-0.5">{key}</span>
                                                                <span className="text-slate-800 font-bold">{String(val)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {file.aiOcrData && Object.keys(file.aiOcrData).length === 0 && !file.aiErrorMessage && (
                                                    <span className="text-slate-400 text-xs italic">لم يتم استخراج بيانات واضحة.</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-emerald-500" />
                            تقييم النظام (AI)
                        </h3>
                        {request.needScore != null && request.needScore > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center relative group">
                                    <div className="text-sm font-bold text-slate-500 mb-1">تصنيف مستوى الحاجة</div>
                                    <div className="text-3xl font-black text-emerald-600">{request.needScore.toFixed(0)}%</div>
                                </div>
                                {request.aiConfidence != null && (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                        <div className="text-sm font-bold text-slate-500 mb-1">نسبة التأكد (Confidence)</div>
                                        <div className="text-2xl font-black text-amber-600">{request.aiConfidence <= 1 ? Math.round(request.aiConfidence * 100) : Math.round(request.aiConfidence)}%</div>
                                        <p className="text-[10px] text-slate-400 leading-relaxed mt-2">تُعبر عن مدى يقين وتأكد الذكاء الاصطناعي من القرار</p>
                                    </div>
                                )}
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <div className="text-sm font-bold text-slate-500 mb-1">درجة الأولوية</div>
                                    <div className="text-3xl font-black text-violet-600">{(request.priorityScore || 0).toFixed(0)}%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm font-bold text-slate-500">لم يتم تقييم الطلب بعد</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
