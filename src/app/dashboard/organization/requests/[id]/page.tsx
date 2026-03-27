"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { useAssociationRequestDetail } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle, CheckCircle2, XCircle, ArrowRight, Download, FileText, User, HeartPulse, Home, Briefcase, Bot, FileJson2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

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
                <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50/50">
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
                <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
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
            <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50/50">
                <DashboardTopBar userType="organization" />
                <main className="py-8 px-4 lg:px-8 max-w-6xl mx-auto w-full">
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/organization/pending">
                                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-200">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">تفاصيل الطلب #{request.id}</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    مقدم منذ: {request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : ''}
                                </p>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                            request.status === RequestStatus.Approved ? 'bg-green-100 text-green-700' :
                            request.status === RequestStatus.Rejected ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
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
                                <Card className="p-6 border-primary/20 bg-primary/5 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-primary" />
                                        قرار الجمعية
                                    </h3>
                                    
                                    {!showAcceptForm && !showRejectForm ? (
                                        <div className="flex gap-4">
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
                                            <div className="grid grid-cols-2 gap-4">
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
                                            <div className="flex gap-2 pt-2">
                                                <Button onClick={handleAccept} disabled={isActionLoading} className="bg-green-600 hover:bg-green-700">
                                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle2 className="w-4 h-4 ml-2" />}
                                                    تأكيد الموافقة
                                                </Button>
                                                <Button onClick={() => { setShowAcceptForm(false); setActionError(""); }} disabled={isActionLoading} variant="outline">
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
                                        <InfoItem label="اسم الأسرة" value={`${request.familyInfo.firstName} ${request.familyInfo.lastName}`} />
                                        <InfoItem label="رب الأسرة" value={request.familyInfo.firstName + " " + request.familyInfo.lastName} />
                                        <InfoItem label="الرقم القومي" value={request.familyInfo.headNationalId} />
                                        <InfoItem label="رقم التواصل" value={request.familyInfo.phone} />
                                        <InfoItem label="عدد الأفراد" value={`${request.familyMemberCount || 0} أفراد`} />
                                        <InfoItem label="العنوان" value={`${request.governorate || '-'} - ${request.city || '-'} - ${request.neighborhood || '-'}`} />
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
                                        <InfoItem label="نوع السكن" value={request.livingCondition.housingType === 0 ? 'إيجار' : request.livingCondition.housingType === 1 ? 'تمليك' : 'أخرى'} />
                                        {request.livingCondition.rentMonthly ? <InfoItem label="الإيجار الشهري" value={`${request.livingCondition.rentMonthly} ج.م`} /> : null}
                                        <InfoItem label="يمتلك سيارة؟" value={request.livingCondition.hasCar ? 'نعم' : 'لا'} />
                                        <InfoItem label="المصاريف الشهرية" value={`${request.livingCondition.monthlyExpenses} ج.م`} />
                                        <InfoItem label="فواتير المرافق" value={`${request.livingCondition.utilitiesMonthly} ج.م`} />
                                        <InfoItem label="إجمالي الإنفاق" value={`${request.livingCondition.householdMonthlySpending || '-'} ج.م`} />
                                    </div>
                                </Card>
                            )}

                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            
                            {/* Scoring Info */}
                            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white/90">
                                    <AlertCircle className="w-5 h-5 text-amber-400" />
                                    تقييم النظام الآلي
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 text-white/80">
                                            <span>مؤشر الاحتياج</span>
                                            <span className="font-bold text-white">{request.needScore ?? 'غير متوفر'} / 100</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-l from-red-500 to-amber-500 rounded-full" style={{ width: `${request.needScore || 0}%` }} />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-700/50">
                                        <span className="block text-xs text-white/60 mb-1">النوع المقترح من الذكاء الاصطناعي</span>
                                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-md text-sm font-medium">
                                            {request.predictedAssistanceType || request.requestType || 'غير محدد'}
                                        </span>
                                    </div>
                                    
                                    {(request.aiMethod || request.aiErrorMessage) && (
                                        <div className="pt-4 border-t border-slate-700/50">
                                            <span className="block text-xs text-white/60 mb-1 flex items-center gap-1">
                                                <Bot className="w-3 h-3" />
                                                طريقة التقييم الآلي
                                            </span>
                                            <p className="text-sm font-medium text-white/90">
                                                {request.aiMethod || 'غير محدد'}
                                            </p>
                                            {request.aiErrorMessage && (
                                                <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded p-2 text-xs text-red-200">
                                                    <span className="font-bold flex items-center gap-1 mb-0.5"><XCircle className="w-3 h-3" /> فشل التقييم:</span>
                                                    {request.aiErrorMessage}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Employment */}
                            {request.employmentData && (
                                <Card className="p-6 border-t-4 border-t-blue-500">
                                    <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                                        <Briefcase className="w-4 h-4 text-secondary" />
                                        العمل والدخل
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="حالة العمل" value={request.employmentData.isWorking ? 'يعمل' : 'لا يعمل'} vertical />
                                        {request.employmentData.isWorking ? (
                                            <>
                                                <InfoItem label="جهة العمل" value={request.employmentData.company || 'غير محدد'} vertical />
                                                <InfoItem label="الراتب الشهري" value={`${request.employmentData.salaryMonthly} ج.م`} vertical />
                                            </>
                                        ) : (
                                            <InfoItem label="سبب التعطل" value={request.employmentData.unEmploymentReason || 'غير محدد'} vertical />
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Health */}
                            {request.healthData && (
                                <Card className="p-6 border-t-4 border-t-red-500">
                                    <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                                        <HeartPulse className="w-4 h-4 text-secondary" />
                                        الصحة والتأمين
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="أمراض مزمنة" value={request.healthData.hasChronicDisease ? `نعم (${request.healthData.chronicDiseaseType})` : 'لا'} vertical />
                                        <InfoItem label="تأمين صحي" value={request.healthData.hasInsurance ? 'نعم' : 'لا'} vertical />
                                        <InfoItem label="إعاقة" value={request.healthData.hasDisability ? `نعم (${request.healthData.disabilityType})` : 'لا'} vertical />
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
                                                
                                                {/* OCR Data Preview Inline */}
                                                {(file.aiOcrDataJson || file.aiErrorMessage) && (
                                                    <div className="bg-slate-50 border-t border-slate-100 p-3 text-xs">
                                                        {file.aiErrorMessage ? (
                                                            <div className="text-red-600 flex items-start gap-1.5">
                                                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                                <span className="font-medium">فشل الـ OCR: {file.aiErrorMessage}</span>
                                                            </div>
                                                        ) : file.aiOcrDataJson && (
                                                            <div className="relative">
                                                                <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1.5">
                                                                    <FileJson2 className="w-3.5 h-3.5" />
                                                                    <span>البيانات المستخرجة آلياً ({file.aiOcrMethod || 'Gemini Vision'})</span>
                                                                </div>
                                                                <pre className="bg-slate-800 text-slate-300 p-2.5 rounded text-[10px] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner font-mono text-left" dir="ltr">
                                                                    {file.aiOcrDataJson}
                                                                </pre>
                                                            </div>
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
