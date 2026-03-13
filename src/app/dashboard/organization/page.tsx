"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TasksCard, type Task } from "@/features/dashboard/components/TasksCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/ui/button";
import { Plus, Search, Award, Users, AlertCircle, Loader2, XCircle, Clock, Target } from "lucide-react";
import { useAssociationDashboard } from "@/features/associations";
import { type TimelineItem } from "@/shared/components/common/Timeline";
import { MonthlyTrendChart, RequestTypeChart } from "@/features/dashboard/components/AnalyticsCharts";

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, isLoading, error } = useAssociationDashboard();

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center text-destructive">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Default fallbacks in case API data is shaped differently or empty
    const tasks: Task[] = Array.isArray(undertakings?.tasks) ? undertakings.tasks : [];
    const activities: TimelineItem[] = Array.isArray(analytics?.activities) ? analytics.activities : [];

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]">
                <DashboardTopBar userType="organization" />
                <main className="pb-20 pt-6 lg:pt-8 relative z-10">
                    <div className="space-y-6 px-6 lg:px-10">
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="mb-6">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">لوحة تحكم الجمعية</h1>
                                <p className="text-sm text-slate-500 font-bold mt-1">إدارة الطلبات والحالات بفاعلية ودقة.</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                <StatsCard stat={{ 
                                    label: "طلبات جديدة", 
                                    value: String(analytics?.totalRequestsReceived || 0), 
                                    change: "إجمالي المستلم", 
                                    trend: "up", 
                                    icon: Plus, iconBg: "bg-sky-blue/10", iconColor: "text-sky-blue" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "قيد الدراسة", 
                                    value: String(analytics?.totalRequestsInReview || 0), 
                                    change: "جاري البحث", 
                                    trend: "neutral", 
                                    icon: Search, iconBg: "bg-golden-orange/10", iconColor: "text-golden-orange" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "طلبات مرفوضة", 
                                    value: String(analytics?.totalRequestsRejected || 0), 
                                    change: "لم تستوف الشروط", 
                                    trend: "down", 
                                    icon: XCircle, iconBg: "bg-red-500/10", iconColor: "text-red-500" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "مساعدات معتمدة", 
                                    value: String(analytics?.totalRequestsApproved || 0), 
                                    change: "تمت الموافقة", 
                                    trend: "up", 
                                    icon: Award, iconBg: "bg-warm-green/10", iconColor: "text-warm-green" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "متوسط الاحتياج", 
                                    value: `${Math.round(analytics?.averageMetrics?.averageNeedScore || 0)}`, 
                                    change: "من ١٠٠ نقطة", 
                                    trend: "neutral", 
                                    icon: Target, iconBg: "bg-royal-purple/10", iconColor: "text-royal-purple" 
                                }} />
                            </div>

                            {/* The Quick Actions section was removed as requested */}

                            <div className="grid gap-6 lg:grid-cols-12 space-y-0">
                                <div className="lg:col-span-8 space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-5 bg-sky-blue rounded-full" />
                                        <h2 className="text-lg font-black text-slate-900">معدل الطلبات شهرياً</h2>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                                        <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        <h2 className="text-lg font-black text-slate-900">المهام العاجلة</h2>
                                    </div>
                                    {tasks.length > 0 ? (
                                        <TasksCard tasks={tasks} />
                                    ) : (
                                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500">
                                            لا توجد مهام عاجلة حالياً.
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-5 bg-warm-green rounded-full" />
                                        <h2 className="text-lg font-black text-slate-900">توزيع الطلبات</h2>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                        <RequestTypeChart data={analytics?.requestsByType || {}} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 pt-6">
                                        <div className="w-1.5 h-6 bg-royal-purple rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">أكثر مجالات الاحتياج (المناطق)</h2>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-5 pt-6">
                                        {analytics?.topNeedAreas && analytics.topNeedAreas.length > 0 ? (
                                            analytics.topNeedAreas.map((area, idx) => {
                                                const displayArea = area.area === 'string' ? 'عام' : area.area;
                                                return (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex flex-row-reverse justify-between items-center text-sm font-medium">
                                                            <div className="flex flex-row-reverse items-center gap-2">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                                                <span className="font-semibold text-slate-700">{displayArea}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs" dir="ltr">
                                                                <span>{Math.round(area.percentage)}%</span>
                                                                <span className="text-slate-400 font-normal">({area.requestCount})</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex justify-start" dir="rtl">
                                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${area.percentage}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-4 text-slate-500 text-sm">لا توجد بيانات كافية حالياً.</div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-4 pt-6">
                                        <div className="w-1.5 h-6 bg-golden-orange rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">آخر النشاطات</h2>
                                    </div>
                                    {activities.length > 0 ? (
                                        <RecentActivityCard activities={activities} />
                                    ) : (
                                        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
                                            لا توجد نشاطات حديثة.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
