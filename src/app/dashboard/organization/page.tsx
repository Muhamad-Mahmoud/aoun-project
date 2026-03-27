"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardSkeleton } from "@/shared/components/common/DashboardSkeleton";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TasksCard, type Task } from "@/features/dashboard/components/TasksCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/ui/button";
import { Plus, Search, Award, Users, AlertCircle, Loader2, XCircle, Clock, Target } from "lucide-react";
import { useAssociationDashboard } from "@/features/associations";
import { type TimelineItem } from "@/shared/components/common/Timeline";
import { MonthlyTrendChart, RequestTypeChart } from "@/features/dashboard/components/AnalyticsCharts";
import { BrainCircuit, ActivitySquare } from "lucide-react";
import { Card } from "@/shared/ui/card";

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, isLoading, error } = useAssociationDashboard();

    if (isLoading) {
        return (
            <DashboardSkeleton userType="organization" sidebar={<OrganizationSidebar />} />
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-slate-50" dir="rtl">
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
    const activities: TimelineItem[] = Array.isArray((analytics as any)?.activities) ? (analytics as any).activities : [];

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-slate-50" dir="rtl">
                <DashboardTopBar userType="organization" />
                <main className="pb-20 pt-6 lg:pt-8 relative z-10">
                    <div className="space-y-6 px-6 lg:px-10">
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="mb-6">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">لوحة تحكم الجمعية</h1>
                                <p className="text-sm text-slate-500 font-bold mt-1">إدارة الطلبات والحالات بفاعلية ودقة.</p>
                            </div>

                            <div className="space-y-10">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <StatsCard stat={{ 
                                    label: "طلبات جديدة", 
                                    value: String(analytics?.totalRequestsReceived || 0), 
                                    change: "إجمالي المستلم", 
                                    trend: "up", 
                                    icon: Plus, iconBg: "bg-white/10", iconColor: "text-white",
                                    isPrimary: true 
                                }} />
                                <StatsCard stat={{ 
                                    label: "قيد الدراسة", 
                                    value: String(analytics?.totalRequestsInReview || 0), 
                                    change: "جاري البحث", 
                                    trend: "neutral", 
                                    icon: Search, iconBg: "bg-amber-50", iconColor: "text-amber-500" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "مساعدات معتمدة", 
                                    value: String(analytics?.totalRequestsApproved || 0), 
                                    change: "تمت الموافقة", 
                                    trend: "up", 
                                    icon: Award, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" 
                                }} />
                                <StatsCard stat={{ 
                                    label: "طلبات مرفوضة", 
                                    value: String(analytics?.totalRequestsRejected || 0), 
                                    change: "لم تستوف الشروط", 
                                    trend: "down", 
                                    icon: XCircle, iconBg: "bg-rose-50", iconColor: "text-rose-500" 
                                }} />
                            </div>

                            {/* Section: Insights AI */}
                            <div className="space-y-4">
                                <div className="section-header mt-10">
                                    <h2>توزيع الطلبات والمساعدات</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {/* AI Progress Card 1 */}
                                    <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-[24px] border border-slate-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                        <div className="w-16 h-16 rounded-[18px] bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                                            <BrainCircuit strokeWidth={2.5} className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 space-y-3 w-full">
                                            <div className="flex justify-between items-center w-full">
                                                <h4 className="text-sm font-black text-slate-500">معدل معالجة الذكاء الاصطناعي</h4>
                                                <span className="text-2xl font-black text-slate-900 tabular-nums">{Math.round(analytics?.aiProcessingRate || 0)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-sm relative" style={{ width: `${Math.round(analytics?.aiProcessingRate || 0)}%` }}>
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400">حالات منسقة وموثقة آلياً</p>
                                        </div>
                                    </Card>
                                    
                                    {/* AI Progress Card 2 */}
                                    <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-[24px] border border-slate-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                        <div className="w-16 h-16 rounded-[18px] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                                            <ActivitySquare strokeWidth={2.5} className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 space-y-3 w-full">
                                            <div className="flex justify-between items-center w-full">
                                                <h4 className="text-sm font-black text-slate-500">متوسط دقة التقييم (Confidence)</h4>
                                                <span className="text-2xl font-black text-slate-900 tabular-nums">{Math.round(analytics?.averageAiConfidence || 0)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full shadow-sm relative" style={{ width: `${Math.round(analytics?.averageAiConfidence || 0)}%` }}>
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400">درجة الوثوق الفنية بقرارات النظام</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-12 space-y-0 mt-10">
                                <div className="lg:col-span-8 space-y-4">
                                    <div className="section-header">
                                        <h2>معدل الطلبات شهرياً</h2>
                                    </div>
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-[24px]">
                                        <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                    </Card>

                                    <div className="section-header mt-10">
                                        <h2>المهام العاجلة</h2>
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
                                    <div className="section-header">
                                        <h2>توزيع الطلبات</h2>
                                    </div>
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-[24px]">
                                        <RequestTypeChart data={analytics?.requestsByType || {}} />
                                    </Card>

                                    <div className="section-header mt-10">
                                        <h2>أكثر مجالات الاحتياج (المناطق)</h2>
                                    </div>
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-[24px]">
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
                                    </Card>
                                    <div className="space-y-4">
                                    <div className="section-header mt-10">
                                        <h2>مستويات الاحتياج (الذكاء الاصطناعي)</h2>
                                    </div>
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-[24px]">
                                        {analytics?.needLevelDistribution && Object.keys(analytics.needLevelDistribution).length > 0 ? (
                                            Object.entries(analytics.needLevelDistribution).map(([level, count], idx) => {
                                                const totalRequests = analytics.totalRequestsReceived || 1;
                                                const percentage = Math.round((count / totalRequests) * 100);
                                                const displayLevel = level === 'High' ? 'مرتفع' : level === 'Medium' ? 'متوسط' : level === 'Low' ? 'منخفض' : level;
                                                const colorClass = level === 'High' ? 'bg-red-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-green-500';
                                                return (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex flex-row-reverse justify-between items-center text-sm font-medium">
                                                            <div className="flex flex-row-reverse items-center gap-2">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                                                                <span className="font-semibold text-slate-700">{displayLevel}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs" dir="ltr">
                                                                <span>{percentage}%</span>
                                                                <span className="text-slate-400 font-normal">({count})</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex justify-start" dir="rtl">
                                                            <div className={`h-full ${colorClass} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-4 text-slate-500 text-sm">لا توجد تصنيفات حالياً.</div>
                                        )}
                                    </Card>
                                    </div>
                                    
                                    <div className="section-header mt-10">
                                        <h2>آخر النشاطات</h2>
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
