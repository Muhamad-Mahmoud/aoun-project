"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { useAssociationRequests } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, Loader2, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function OrganizationApprovedPage() {
    const { requests, isLoading, error } = useAssociationRequests({ status: RequestStatus.Approved });

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8FAFC]" dir="rtl">
                <DashboardTopBar userType="organization" />
                <main className="py-8 sm:py-10">
                    <div className="space-y-8 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">الحالات المعتمدة</h1>
                            <p className="text-slate-500 font-medium text-base mt-2 max-w-2xl">
                                متابعة وإدارة الحالات التي تمت الموافقة عليها، وضمان سير عملية الدعم بنجاح.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <Card className="p-8 text-center text-destructive flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                                <p>{error}</p>
                            </Card>
                        ) : requests.length === 0 ? (
                            <Card className="p-16 text-center border-dashed border-2 border-slate-200 rounded-3xl bg-transparent shadow-none flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5">
                                    <CheckCircle2 className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-xl font-black text-slate-700">سجل الحالات فارغ</p>
                                <p className="text-slate-500 mt-2 font-medium">لم يتم اعتماد أي حالات حتى الآن. الطلبات المقبولة ستظهر هنا.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {requests.map((request) => (
                                    <ApprovedCard key={request.id} request={request} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function ApprovedCard({ request }: { request: any }) {
    const isHighNeed = request.aiNeedLevel === 'High';
    const isMediumNeed = request.aiNeedLevel === 'Medium';
    const isLowNeed = request.aiNeedLevel === 'Low';
    
    let lineClass = 'bg-slate-500';
    let tagBg = 'bg-slate-50';
    let tagText = 'text-slate-600';
    let tagBorder = 'border-slate-200';
    let tagLabel = 'قيد التقييم';

    if (isHighNeed) {
        lineClass = 'bg-violet-600';
        tagBg = 'bg-violet-50';
        tagText = 'text-violet-700';
        tagBorder = 'border-violet-200';
        tagLabel = 'تدخل عاجل';
    } else if (isMediumNeed) {
        lineClass = 'bg-blue-600';
        tagBg = 'bg-blue-50';
        tagText = 'text-blue-700';
        tagBorder = 'border-blue-200';
        tagLabel = 'أولوية متقدمة';
    } else if (isLowNeed) {
        lineClass = 'bg-emerald-600';
        tagBg = 'bg-emerald-50';
        tagText = 'text-emerald-700';
        tagBorder = 'border-emerald-200';
        tagLabel = 'أولوية اعتيادية';
    }

    return (
        <Card className={`group relative rounded-3xl bg-white border transition-all duration-300 overflow-hidden flex flex-col p-6 hover:shadow-xl hover:-translate-y-1 ${isHighNeed ? "border-violet-200/60 shadow-md shadow-violet-900/5" : "border-slate-200/60"}`}>
            <div className={`absolute top-0 right-0 w-1.5 h-full ${lineClass} transition-opacity duration-300 ${isHighNeed ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
            
            <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 pr-3">
                    <h3 className="font-black text-lg text-slate-900 truncate">{request.familyName || request.familyHeadName}</h3>
                    <div className="flex items-center text-xs font-medium text-slate-400 mt-1 gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">تاريخ الاعتماد: {request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : 'غير معروف'}</span>
                    </div>
                </div>
                <div className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1.5 text-[11px] font-bold rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    معتمدة
                </div>
            </div>
            
            <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5rem] mb-6">
                {request.description || "لم يتم توفير تفاصيل إضافية لهذا الطلب."}
            </p>

            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs bg-slate-100 px-2.5 py-1.5 rounded-lg text-slate-600 font-bold border border-slate-200/60">
                        {request.requestType || 'طلب عام'}
                    </span>
                    {request.aiNeedLevel && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border ${tagBg} ${tagText} ${tagBorder}`}>
                            {tagLabel}
                            {request.needScore != null && (
                                <span className="opacity-70 text-[10px] ml-0.5">
                                    ({request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)}%)
                                </span>
                            )}
                        </span>
                    )}
                </div>
                <Link href={`/dashboard/organization/requests/${request.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl shrink-0 transition-colors">
                        سجل الحالة
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

