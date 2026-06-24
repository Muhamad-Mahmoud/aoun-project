"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { useAssociationRequestDetail } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle, CheckCircle2, XCircle, ArrowRight, Download, FileText, User, HeartPulse, Home, Briefcase, Bot, FileJson2, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { categoryConfig, resolveCategory } from "@/features/requests/config/requestConfig";

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    console.log(`[Page] Rendering RequestDetailPage for id: ${id}`);
    
    const { request, isLoading, isActionLoading, error, acceptRequest, rejectRequest } = useAssociationRequestDetail(id);

    console.log(`[Page] Data state:`, { hasRequest: !!request, isLoading, error });
    try {
        console.log(`[Page] RequestStatus check:`, RequestStatus);
    } catch (e) {
        console.error(`[Page] RequestStatus is NOT defined!`, e);
    }

    const [showAcceptForm, setShowAcceptForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);

    // Accept Form State
    const [acceptanceNotes, setAcceptanceNotes] = useState("");
    const [approvedAmount, setApprovedAmount] = useState("");
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
    const [actionError, setActionError] = useState("");

    // Reject Form State
    const [rejectionReason, setRejectionReason] = useState("");

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
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
                <div className="flex-1 flex flex-col h-full bg-slate-50/50">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center p-8">
                        <Card className="p-8 text-center text-destructive max-w-md w-full">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-bold mb-4">{error || "تعذر العثور على الطلب"}</p>
                            <Link href="/dashboard/organization/pending">
                                <Button variant="outline">العودة للقائمة</Button>
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
            router.refresh();
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
            router.refresh();
        }
    };

    const isPending = request.status === RequestStatus.Pending || request.status === RequestStatus.InReview;

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
                <DashboardTopBar userType="organization" />
                <main className="py-8 lg:pb-8 px-4 lg:px-8 max-w-6xl mx-auto w-full">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-start gap-4">
                            <Link href="/dashboard/organization/pending" className="shrink-0 mt-1 sm:mt-0">
                                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" />
                                    طلب مساعدة
                                </p>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                                    تفاصيل الطلب <span className="text-slate-400 font-mono text-sm sm:text-base break-all">#{request.id}</span>
                                </h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    {request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : ''}
                                </p>
                            </div>
                        </div>

                        <div className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold flex items-center w-fit gap-2 border ${
                            request.status === RequestStatus.Approved ? 'bg-green-50 text-green-700 border-green-200' :
                            request.status === RequestStatus.Rejected ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            <span className="relative flex h-2 w-2">
                                {isPending && <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping" />}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                    request.status === RequestStatus.Approved ? 'bg-green-500' :
                                    request.status === RequestStatus.Rejected ? 'bg-red-500' : 'bg-amber-500'
                                }`} />
                            </span>
                            {request.status === RequestStatus.Approved && <CheckCircle2 className="w-4 h-4" />}
                            {request.status === RequestStatus.Rejected && <XCircle className="w-4 h-4" />}
                            {request.status === RequestStatus.Approved ? 'تمت الموافقة' :
                             request.status === RequestStatus.Rejected ? 'مرفوض' : 'قيد المراجعة'}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Actions / Forms (Only if pending) */}
                            {isPending && (
                                <Card className="p-4 sm:p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-900">
                                        <span className="w-1 h-5 bg-primary rounded-full" />
                                        قرار الجمعية
                                    </h3>
                                    
                                    {!showAcceptForm && !showRejectForm ? (
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <Button onClick={() => setShowAcceptForm(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                                                <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة على الطلب
                                            </Button>
                                            <Button onClick={() => setShowRejectForm(true)} variant="destructive" className="flex-1">
                                                <XCircle className="w-4 h-4 ml-2" /> رفض الطلب
                                            </Button>
                                        </div>
                                    ) : showAcceptForm ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">ملاحظات القبول (مطلوب)</label>
                                                <textarea 
                                                    className="w-full text-sm p-3 border rounded-lg focus:ring-1 focus:ring-green-500 min-h-[100px]"
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
                                                        className="w-full text-sm p-3 border rounded-lg"
                                                        placeholder="مثال: 5000"
                                                        value={approvedAmount}
                                                        onChange={(e) => setApprovedAmount(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">تاريخ التسليم المتوقع (اختياري)</label>
                                                    <input 
                                                        type="date"
                                                        className="w-full text-sm p-3 border rounded-lg"
                                                        value={expectedDeliveryDate}
                                                        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {actionError && <p className="text-red-600 text-sm font-bold">{actionError}</p>}
                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                <Button onClick={handleAccept} disabled={isActionLoading} className="bg-green-600 hover:bg-green-700 flex-1">
                                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle2 className="w-4 h-4 ml-2" />}
                                                    تأكيد الموافقة
                                                </Button>
                                                <Button onClick={() => { setShowAcceptForm(false); setActionError(""); }} disabled={isActionLoading} variant="outline" className="flex-1">
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                            <div>
                                                <label className="block text-sm font-bold text-red-700 mb-2">سبب الرفض (مطلوب)</label>
                                                <textarea 
                                                    className="w-full text-sm p-3 border-red-200 bg-red-50 rounded-lg focus:ring-1 focus:ring-red-500 min-h-[100px]"
                                                    placeholder="يرجى توضيح سبب الرفض..."
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                />
                                            </div>
                                            {actionError && <p className="text-red-600 text-sm font-bold">{actionError}</p>}
                                            <div className="flex gap-2 pt-2">
                                                <Button onClick={handleReject} disabled={isActionLoading} variant="destructive">
                                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <XCircle className="w-4 h-4 ml-2" />}
                                                    تأكيد الرفض
                                                </Button>
                                                <Button onClick={() => { setShowRejectForm(false); setActionError(""); }} disabled={isActionLoading} variant="outline">
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Contact Family Button */}
                            <Card className="p-6 border border-slate-200 shadow-sm flex items-center justify-between bg-secondary/5">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">التواصل المباشر</h3>
                                    <p className="text-sm text-slate-500 mt-1">تواصل مع الأسرة للاستفسار عن تفاصيل إضافية للطلب.</p>
                                </div>
                                <Link href={`/dashboard/organization/messages?requestId=${id}`}>
                                    <Button className="bg-secondary hover:bg-secondary/90">
                                        تواصل مع الأسرة
                                    </Button>
                                </Link>
                            </Card>

                            {/* Decision Info (if already decided) */}
                            {!isPending && request.decisionReason && (
                                <Card className={`p-6 border-l-4 ${request.status === RequestStatus.Approved ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'}`}>
                                    <h3 className="font-bold text-lg mb-2">الملاحظات والقرارات</h3>
                                    <p className="text-slate-700">{request.decisionReason}</p>
                                    {request.decisionAt && (
                                        <p className="text-xs text-slate-500 mt-4">
                                            تاريخ القرار: {format(new Date(request.decisionAt), 'dd MMMM yyyy - p', { locale: ar })}
                                        </p>
                                    )}
                                </Card>
                            )}

                            {/* Description */}
                            <Card className="p-6">
                                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-secondary" />
                                    وصف حالة الطلب
                                </h3>
                                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {request.description}
                                </p>
                            </Card>

                            {/* Family Info */}
                            {request.familyInfo && (
                                <Card className="p-6">
                                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4 border-b pb-4">
                                        <User className="w-5 h-5 text-secondary" />
                                        البيانات الأساسية للأسرة
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                        <InfoItem label="اسم الأسرة" value={request.familyInfo.familyName || `${request.familyInfo.firstName} ${request.familyInfo.lastName}`} />
                                        <InfoItem label="رب الأسرة" value={request.familyInfo.familyHeadName || `${request.familyInfo.firstName} ${request.familyInfo.lastName}`} />
                                        <InfoItem label="الرقم القومي" value={request.familyInfo.headNationalId} />
                                        <InfoItem label="رقم التواصل" value={request.familyInfo.phone} />
                                        <InfoItem label="البريد الإلكتروني" value={request.familyInfo.email || 'غير متوفر'} />
                                        <InfoItem label="عدد الأفراد" value={`${request.familyInfo.memberCount || request.familyMemberCount || 0} أفراد`} />
                                        <InfoItem label="العنوان" value={`${request.familyInfo.governorate || request.governorate || '-'} - ${request.familyInfo.city || request.city || '-'} - ${request.familyInfo.neighborhood || request.neighborhood || '-'}`} />
                                    </div>
                                </Card>
                            )}
                            
                            {/* Living & Environment */}
                            {request.livingCondition && (
                                <Card className="p-6">
                                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4 border-b pb-4">
                                        <Home className="w-5 h-5 text-secondary" />
                                        الحالة المعيشية والسكن
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                        <InfoItem label="نوع السكن" value={request.livingCondition.housingType === 'Rented' || request.livingCondition.housingType === 0 ? 'إيجار' : request.livingCondition.housingType === 'Owned' || request.livingCondition.housingType === 1 ? 'تمليك' : request.livingCondition.housingType === 'Free' ? 'استضافة / مجاني' : 'أخرى'} />
                                        {request.livingCondition.rentMonthly ? <InfoItem label="الإيجار الشهري" value={`${request.livingCondition.rentMonthly} ج.م`} /> : null}
                                        <InfoItem label="يمتلك سيارة؟" value={request.livingCondition.hasCar ? 'نعم' : 'لا'} />
                                        <InfoItem label="المصاريف الشهرية الأساسية" value={`${request.livingCondition.monthlyExpenses} ج.م`} />
                                        <InfoItem label="فواتير المرافق" value={`${request.livingCondition.utilitiesMonthly} ج.م`} />
                                        <InfoItem label="التزامات مالية أخرى" value={request.livingCondition.hasOtherCommitments ? `نعم (${request.livingCondition.otherCommitmentsType || 'غير محدد'})` : 'لا'} />
                                        {request.livingCondition.hasOtherCommitments && request.livingCondition.otherCommitmentsAmount ? (
                                            <InfoItem label="مبلغ الالتزامات الأخرى" value={`${request.livingCondition.otherCommitmentsAmount} ج.م`} />
                                        ) : null}
                                        {request.livingCondition.annualPayment ? (
                                            <InfoItem label="مصروفات سنوية" value={`${request.livingCondition.annualPayment} ج.م`} />
                                        ) : null}
                                        <InfoItem label="إجمالي الإنفاق الشهري" value={`${request.livingCondition.householdMonthlySpending || '-'} ج.م`} />
                                    </div>
                                </Card>
                            )}

                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            
                            {/* Scoring Info */}
                            <Card className="p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900">
                                        <Bot className="w-4 h-4 text-slate-500" />
                                        تقييم النظام الآلي
                                    </h3>
                                    <span className="text-[10px] font-bold text-amber-700 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">AI</span>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between items-baseline text-sm mb-2">
                                            <span className="text-slate-600 text-xs font-semibold">مؤشر الاحتياج</span>
                                            <span className="font-bold text-slate-900 tabular-nums">
                                                {request.needScore != null ? (request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)) : '—'}<span className="text-slate-400 text-xs font-normal">/100</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-l from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all" style={{ width: `${request.needScore != null ? (request.needScore <= 1 ? request.needScore * 100 : request.needScore) : 0}%` }} />
                                        </div>
                                    </div>

                                    {request.aiNeedLevel && (
                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wide">مستوى الحاجة</span>
                                            <span className={`inline-block px-2.5 py-1 border rounded-md text-sm font-semibold ${
                                                request.aiNeedLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                                                request.aiNeedLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                                {request.aiNeedLevel === 'High' ? 'عالي' : request.aiNeedLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                                            </span>
                                        </div>
                                    )}

                                    {request.aiConfidence != null && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wide">نسبة التأكد (Confidence)</span>
                                                <span className="inline-block px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold text-slate-700">
                                                    {request.aiConfidence <= 1 ? Math.round(request.aiConfidence * 100) : Math.round(request.aiConfidence)}%
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">تُعبر عن مدى يقين وتأكد الذكاء الاصطناعي من مستوى الحاجة الذي اختاره بناءً على البيانات.</p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wide">النوع المقترح</span>
                                        <span className="inline-block px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold text-slate-700">
                                            {categoryConfig[resolveCategory(request.predictedAssistanceType || request.requestType)]?.label || request.predictedAssistanceType || request.requestType || 'غير محدد'}
                                        </span>
                                    </div>

                                    {(request.aiMethod || request.aiErrorMessage) && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <span className="text-[11px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide flex items-center gap-1">
                                                <Bot className="w-3 h-3" /> طريقة التقييم
                                            </span>
                                            <p className="text-sm text-slate-700">{request.aiMethod || 'غير محدد'}</p>
                                            {request.aiPredictionStatus === 'Failed' && request.aiErrorMessage && (
                                                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-500">
                                                    <span className="font-bold flex items-center gap-1 mb-0.5"><XCircle className="w-3 h-3 text-red-500" /> تعذر التقييم الآلي:</span>
                                                    <span>{request.aiErrorMessage || 'لم يتمكن النظام من الوصول لخدمة الذكاء الاصطناعي. سيقوم الموظف المختص بالتقييم اليدوي.'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Employment */}
                            {request.employmentData && (
                                <Card className="p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-slate-900">
                                        <span className="p-1.5 bg-blue-50 rounded-md">
                                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                                        </span>
                                        العمل والدخل
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="حالة العمل" value={request.employmentData.isWorking ? 'يعمل' : 'لا يعمل'} vertical />
                                        {request.employmentData.isWorking ? (
                                            <>
                                                <InfoItem label="طبيعة العمل" value={request.employmentData.workingType === 'FullTime' ? 'دوام كامل' : request.employmentData.workingType === 'PartTime' ? 'دوام جزئي' : request.employmentData.workingType === 'Freelance' ? 'عمل حر / يومية' : request.employmentData.workingType || 'غير محدد'} vertical />
                                                <InfoItem label="القطاع" value={request.employmentData.employmentType === 'Private' ? 'قطاع خاص' : request.employmentData.employmentType === 'Public' ? 'قطاع حكومي / عام' : request.employmentData.employmentType || 'غير محدد'} vertical />
                                                <InfoItem label="جهة العمل" value={request.employmentData.company || 'غير محدد'} vertical />
                                                <InfoItem label="المسمى الوظيفي" value={request.employmentData.jobTitle || 'غير محدد'} vertical />
                                                <InfoItem label="الراتب الشهري" value={request.employmentData.salaryMonthly ? `${request.employmentData.salaryMonthly} ج.م` : 'غير محدد'} vertical />
                                                <InfoItem label="الدخل المقدر" value={request.employmentData.estimatedIncomeMonthly ? `${request.employmentData.estimatedIncomeMonthly} ج.م` : 'غير محدد'} vertical />
                                                <InfoItem label="سنوات العمل" value={request.employmentData.yearsAtJob ? `${request.employmentData.yearsAtJob} سنوات` : 'غير محدد'} vertical />
                                            </>
                                        ) : (
                                            <>
                                                <InfoItem label="سبب التعطل" value={request.employmentData.unEmploymentReason || 'غير محدد'} vertical />
                                                <InfoItem label="يبحث عن عمل؟" value={request.employmentData.isLookingForJob ? 'نعم' : 'لا'} vertical />
                                                <InfoItem label="بحاجة لتدريب؟" value={request.employmentData.needsTraining ? 'نعم' : 'لا'} vertical />
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Health */}
                            {request.healthData && (
                                <Card className="p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-slate-900">
                                        <span className="p-1.5 bg-red-50 rounded-md">
                                            <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                                        </span>
                                        الصحة والتأمين
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="أمراض مزمنة" value={request.healthData.hasChronicDisease ? `نعم (${request.healthData.chronicDiseaseType || 'غير محدد'})` : 'لا'} vertical />
                                        <InfoItem label="تأمين صحي" value={request.healthData.hasInsurance ? `نعم (${request.healthData.insuranceType || 'غير محدد'})` : 'لا'} vertical />
                                        <InfoItem label="إعاقة" value={request.healthData.hasDisability ? `نعم (${request.healthData.disabilityType || 'غير محدد'})` : 'لا'} vertical />
                                        {request.healthData.medicalCostMonthly ? (
                                            <InfoItem label="تكاليف العلاج الشهرية" value={`${request.healthData.medicalCostMonthly} ج.م`} vertical />
                                        ) : null}
                                    </div>
                                </Card>
                            )}

                            {/* Social Support */}
                            {request.socialSupport && (
                                <Card className="p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-slate-900">
                                        <span className="p-1.5 bg-indigo-50 rounded-md">
                                            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
                                        </span>
                                        الدعم الاجتماعي السابق
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="مسجل بدعم حكومي؟" value={request.socialSupport.registeredSocialSupport ? 'نعم' : 'لا'} vertical />
                                        {request.socialSupport.registeredSocialSupport && request.socialSupport.socialSupportAmount ? (
                                            <InfoItem label="قيمة الدعم الحكومي" value={`${request.socialSupport.socialSupportAmount} ج.م`} vertical />
                                        ) : null}
                                        {request.socialSupport.otherAidProviders ? (
                                            <>
                                                <InfoItem label="مساعدات من جمعيات أخرى" value={request.socialSupport.otherAidProviders} vertical />
                                                <InfoItem label="نوع المساعدة" value={request.socialSupport.otherAidType || 'غير محدد'} vertical />
                                                {request.socialSupport.otherAidAmount ? (
                                                    <InfoItem label="قيمة المساعدة" value={`${request.socialSupport.otherAidAmount} ج.م`} vertical />
                                                ) : null}
                                            </>
                                        ) : (
                                            <InfoItem label="مساعدات أخرى" value="لا يوجد" vertical />
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Attachments */}
                            {request.attachments && request.attachments.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="font-bold text-base mb-4 flex justify-between items-center">
                                        المرفقات
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                                            {request.attachments.length} ملفات
                                        </span>
                                    </h3>
                                    <div className="space-y-3">
                                        {request.attachments.map((file, idx) => (
                                            <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden group hover:border-primary/30 transition-colors bg-white">
                                                <a href={file.filePath} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors">
                                                    <div className="bg-primary/10 p-2 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                    <div className="overflow-hidden flex-1">
                                                        <p className="text-sm font-medium truncate text-left" dir="ltr">{file.fileName}</p>
                                                        <div className="flex items-center gap-2">
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
                                                                    <div key={i} className="flex flex-col bg-white p-2 rounded border border-slate-100">
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
                                </Card>
                            )}

                        </div>

                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function InfoItem({ label, value, vertical = false }: { label: string, value: string | null | undefined, vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="mb-1">
                <span className="block text-xs text-slate-500 mb-0.5">{label}</span>
                <span className="block text-sm font-semibold">{value || '-'}</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">{label}</span>
            <span className="font-semibold text-sm">{value || '-'}</span>
        </div>
    );
}
