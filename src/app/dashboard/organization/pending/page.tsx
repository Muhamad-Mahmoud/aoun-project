"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { useAssociationRequests } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function OrganizationPendingPage() {
    const { requests, isLoading, error } = useAssociationRequests({ status: RequestStatus.Pending });

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-slate-50/50">
                <DashboardTopBar userType="organization" />
                <main className="py-8">
                    <div className="space-y-8 px-6 lg:px-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">طلبات قيد المراجعة</h1>
                            <p className="text-muted-foreground mt-2">راجع الطلبات الجديدة الواردة للجمعية.</p>
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
                                <p className="text-muted-foreground">لا توجد طلبات قيد المراجعة حالياً.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {requests.map((request) => (
                                    <RequestCard key={request.id} request={request} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function RequestCard({ request }: { request: any }) {
    return (
        <Card className="p-5 flex flex-col gap-4 hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500" />
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{request.familyName || request.familyHeadName}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{request.createdAt ? format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: ar }) : 'تاريخ غير معروف'}</span>
                    </div>
                </div>
                <div className="bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-bold rounded-full">
                    قيد المراجعة
                </div>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {request.description}
            </p>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">
                    {request.requestType}
                </span>
                {request.priorityLevel && (
                    <span className="text-xs bg-red-50 px-2 py-1 rounded-md text-red-600 font-medium">
                        عاجل
                    </span>
                )}
                <Link href={`/dashboard/organization/requests/${request.id}`} className="mr-auto">
                    <Button variant="outline" size="sm" className="h-8 text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                        عرض التفاصيل
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
