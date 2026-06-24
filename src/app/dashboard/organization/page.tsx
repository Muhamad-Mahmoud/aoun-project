"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardSkeleton } from "@/shared/components/common/DashboardSkeleton";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TasksCard, type Task } from "@/features/dashboard/components/TasksCard";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
    Plus, Search, Award, AlertCircle, XCircle, ArrowLeft,
    CheckCircle2, Clock, RefreshCw, PieChart
} from "lucide-react";
import { useAssociationDashboard } from "@/features/associations";
import { MonthlyTrendChart, RequestTypeChart } from "@/features/dashboard/components/AnalyticsCharts";
import { BrainCircuit, ActivitySquare } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ASSISTANCE_LABELS: Record<string, string> = {
    Medical: "طبي", Financial: "مالي", Food: "غذاء",
    Housing: "سكن", Education: "تعليم", Utilities: "مرافق",
    Other: "أخرى", General: "عام",
};

const ASSISTANCE_COLORS: Record<string, string> = {
    Medical: "bg-rose-500", Financial: "bg-emerald-500",
    Food: "bg-amber-500", Housing: "bg-sky-500",
    Education: "bg-violet-500", Utilities: "bg-indigo-500",
    Other: "bg-slate-400", General: "bg-slate-400",
};

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, impactReport, isLoading, error, refresh } = useAssociationDashboard();
    const router = useRouter();

    if (isLoading) {
        return <DashboardSkeleton userType="organization" sidebar={<OrganizationSidebar />} />;
    }

    if (error) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-slate-50" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center text-destructive">
                        <div className="text-center space-y-4">
                            <AlertCircle className="w-12 h-12 mx-auto opacity-50" />
                            <p className="font-bold">{error}</p>
                            <Button variant="outline" onClick={refresh}><RefreshCw className="w-4 h-4 ml-2" /> إعادة المحاولة</Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const tasks: Task[] = Array.isArray(undertakings?.tasks) ? undertakings.tasks : [];
    const pendingCount = analytics?.totalRequestsInReview ?? 0;
    const hasImpact = impactReport && (impactReport.totalFamiliesHelped > 0 || impactReport.totalRequestsCompleted > 0);

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-slate-50" dir="rtl">
                <DashboardTopBar userType="organization" />
                <main className=" pt-6 lg:pb-8 lg:pt-8">
                    <div className="space-y-10 px-6 lg:px-10 animate-in fade-in slide-in-from-top-4 duration-500">

                        {/* ── Hero Header ─────────────────────────────────── */}
                        <div className="flex justify-end">
                            <Button onClick={refresh} variant="outline" size="sm" className="shrink-0 gap-2 font-bold">
                                <RefreshCw className="w-4 h-4" /> تحديث البيانات
                            </Button>
                        </div>

                        {/* ── Pending Action Banner ────────────────────────── */}
                        {pendingCount > 0 && (
                            <div className="bg-gradient-to-l from-amber-500 to-orange-500 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg">
                                            {pendingCount} طلب {pendingCount === 1 ? "يحتاج" : "يحتاجون"} مراجعتك
                                        </p>
                                        <p className="text-white/80 text-sm font-medium">تأكد من مراجعة الطلبات المعلقة في أقرب وقت</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => router.push("/dashboard/organization/pending")}
                                    className="bg-white text-orange-600 hover:bg-orange-50 font-black shrink-0 gap-2"
                                >
                                    مراجعة الطلبات <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* ── Stats Cards ──────────────────────────────────── */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                            <StatsCard stat={{
                                label: "إجمالي الطلبات",
                                value: String(analytics?.totalRequestsReceived || 0),
                                change: "إجمالي المستلم", trend: "up",
                                icon: Plus, iconBg: "bg-white/10", iconColor: "text-white", isPrimary: true
                            }} />
                            <StatsCard stat={{
                                label: "قيد المراجعة",
                                value: String(analytics?.totalRequestsInReview || 0),
                                change: "في انتظار القرار", trend: "neutral",
                                icon: Search, iconBg: "bg-amber-50", iconColor: "text-amber-500"
                            }} />
                            <StatsCard stat={{
                                label: "مساعدات معتمدة",
                                value: String(analytics?.totalRequestsApproved || 0),
                                change: "تمت الموافقة", trend: "up",
                                icon: Award, iconBg: "bg-emerald-50", iconColor: "text-emerald-500"
                            }} />
                            <StatsCard stat={{
                                label: "طلبات مرفوضة",
                                value: String(analytics?.totalRequestsRejected || 0),
                                change: "لم تستوف الشروط", trend: "down",
                                icon: XCircle, iconBg: "bg-rose-50", iconColor: "text-rose-500"
                            }} />
                        </div>



                        {/* ── AI Processing Metrics ────────────────────────── */}
                        <div>
                            <SectionHeading title="مؤشرات الذكاء الاصطناعي" subtitle="معدل أتمتة التقييم ودقة النظام" />
                            <div className="grid grid-cols-2 gap-3 md:gap-6">
                                <Card className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-3 md:gap-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                                        <BrainCircuit strokeWidth={2.5} className="w-5 h-5 md:w-8 md:h-8" />
                                    </div>
                                    <div className="flex-1 space-y-2 md:space-y-3 w-full text-center md:text-start">
                                        <div className="flex flex-col md:flex-row md:justify-between items-center md:items-end gap-1 md:gap-0">
                                            <h4 className="text-[10px] md:text-sm font-bold text-slate-600">أتمتة التقييم</h4>
                                            <span className="text-lg md:text-2xl font-black text-slate-900 tabular-nums leading-none">{Math.round(analytics?.aiProcessingRate || 0)}%</span>
                                        </div>
                                        <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${Math.round(analytics?.aiProcessingRate || 0)}%` }} />
                                        </div>
                                        <p className="text-[8px] md:text-xs font-medium text-slate-500 hidden md:block">حالات تم تقييمها آلياً</p>
                                    </div>
                                </Card>

                                <Card className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-3 md:gap-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                                        <ActivitySquare strokeWidth={2.5} className="w-5 h-5 md:w-8 md:h-8" />
                                    </div>
                                    <div className="flex-1 space-y-2 md:space-y-3 w-full text-center md:text-start">
                                        <div className="flex flex-col md:flex-row md:justify-between items-center md:items-end gap-1 md:gap-0">
                                            <h4 className="text-[10px] md:text-sm font-bold text-slate-600">دقة النظام</h4>
                                            <span className="text-lg md:text-2xl font-black text-slate-900 tabular-nums leading-none">
                                                {Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" style={{ width: `${Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%` }} />
                                        </div>
                                        <p className="text-[8px] md:text-xs font-medium text-slate-500 hidden md:block">متوسط نسبة الثقة في النظام</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* ── Main Charts + Right Col ──────────────────────── */}
                        <div className="grid gap-6 lg:grid-cols-12">

                            {/* Left: Charts + Tasks */}
                            <div className="lg:col-span-8 space-y-8">

                                {/* Monthly Trend */}
                                <div>
                                    <SectionHeading title="معدل الطلبات شهرياً" />
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-2xl">
                                        <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                    </Card>
                                </div>

                                {/* Impact by type (if available) */}
                                <div>
                                    <SectionHeading title="توزيع المساعدات المكتملة" subtitle="حسب نوع المساعدة" />
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-2xl">
                                        {impactReport?.impactByType && Object.keys(impactReport.impactByType).length > 0 ? (
                                            <div className="space-y-4">
                                                {Object.entries(impactReport.impactByType)
                                                    .sort(([, a], [, b]) => b - a)
                                                    .map(([type, count]) => {
                                                        const total = impactReport.totalRequestsCompleted || 1;
                                                        const pct = Math.round((count / total) * 100);
                                                        const colorCls = ASSISTANCE_COLORS[type] || "bg-slate-400";
                                                        return (
                                                            <div key={type} className="space-y-1.5">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2.5 h-2.5 rounded-full ${colorCls}`} />
                                                                        <span className="font-semibold text-slate-700">{ASSISTANCE_LABELS[type] ?? type}</span>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-500" dir="ltr">{pct}% ({count})</span>
                                                                </div>
                                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden" dir="rtl">
                                                                    <div className={`h-full ${colorCls} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-slate-500 text-sm">
                                                <PieChart className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                                                لم تكتمل أي طلبات مساعدة حتى الآن لعرض توزيعها.
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                {/* Tasks */}
                                <div>
                                    <SectionHeading title="المهام العاجلة" />
                                    {tasks.length > 0 ? (
                                        <TasksCard tasks={tasks} />
                                    ) : (
                                        <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                            <p className="font-bold text-slate-500">لا توجد مهام عاجلة حالياً.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Analytics Sidebar */}
                            <div className="lg:col-span-4 space-y-8">

                                {/* Request Type Pie */}
                                <div>
                                    <SectionHeading title="توزيع الطلبات" />
                                    <Card className="p-6 border border-slate-200/60 shadow-sm rounded-2xl">
                                        <RequestTypeChart data={analytics?.requestsByType || {}} />
                                    </Card>
                                </div>

                                {/* Need Level Distribution */}
                                {analytics?.needLevelDistribution && Object.keys(analytics.needLevelDistribution).length > 0 && (
                                    <div>
                                        <SectionHeading title="مستويات الاحتياج" />
                                        <Card className="p-6 border border-slate-200/60 shadow-sm rounded-2xl space-y-4">
                                            {Object.entries(analytics.needLevelDistribution).map(([level, count], idx) => {
                                                const total = analytics.totalRequestsReceived || 1;
                                                const pct = Math.round((count / total) * 100);
                                                const label = level === "High" ? "مرتفع" : level === "Medium" ? "متوسط" : "منخفض";
                                                const colorCls = level === "High" ? "bg-red-500" : level === "Medium" ? "bg-amber-500" : "bg-green-500";
                                                return (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${colorCls}`} />
                                                                <span className="font-semibold text-slate-700">{label}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-500" dir="ltr">{pct}% ({count})</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden" dir="rtl">
                                                            <div className={`h-full ${colorCls} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </Card>
                                    </div>
                                )}





                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
