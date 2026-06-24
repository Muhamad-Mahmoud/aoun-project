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
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50/50">
                <DashboardTopBar userType="organization" />
                <main className="py-8">
                    <div className="space-y-8 px-6 lg:px-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">الحالات المعتمدة</h1>
                            <p className="text-muted-foreground mt-2">عرض وإدارة الحالات التي تمت الموافقة عليها.</p>
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
                            <Card className="p-12 text-center border-dashed">
                                <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4 opacity-30" />
                                <p className="text-muted-foreground">لا توجد حالات معتمدة حالياً.</p>
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
    return (
        <Card className="p-5 flex flex-col gap-4 hover:border-green-500/30 transition-colors shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${request.aiNeedLevel === 'High' ? 'bg-red-500' : request.aiNeedLevel === 'Medium' ? 'bg-amber-500' : request.aiNeedLevel === 'Low' ? 'bg-green-500' : 'bg-green-500'}`} />
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{request.familyName || request.familyHeadName}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>تم الموافقة: {request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : ''}</span>
                    </div>
                </div>
                <div className="bg-green-100 text-green-700 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    معتمدة
                </div>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {request.description}
            </p>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">
                    {request.requestType}
                </span>
                {request.aiNeedLevel && (
                    <span className={`text-xs px-2 py-1 rounded-md font-medium border flex items-center gap-1 ${
                        request.aiNeedLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                        request.aiNeedLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-green-50 text-green-700 border-green-200'
                    }`}>
                        الذكاء الاصطناعي: {request.aiNeedLevel === 'High' ? 'عالي' : request.aiNeedLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                        {request.needScore != null && <span className="text-[10px] opacity-70">({request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)}%)</span>}
                    </span>
                )}
                <Link href={`/dashboard/organization/requests/${request.id}`} className="mr-auto">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-green-700 hover:text-green-800 hover:bg-green-50 shrink-0">
                        سجل الحالة
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

