const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/app/dashboard/organization/page.tsx');

const content = `"use client";

import { useState } from "react";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardSkeleton } from "@/shared/components/common/DashboardSkeleton";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
    Plus, Search, Award, AlertCircle, XCircle, ArrowLeft,
    CheckCircle2, Clock, RefreshCw, ActivitySquare, BrainCircuit,
    Zap, Calendar, Users, Megaphone, FileText, ChevronLeft,
    TrendingUp, Sparkles, Send, ShieldCheck
} from "lucide-react";
import { useAssociationDashboard } from "@/features/associations";
import { MonthlyTrendChart, RequestTypeChart } from "@/features/dashboard/components/AnalyticsCharts";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { useAuthContext } from "@/shared/providers";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ASSISTANCE_LABELS: Record<string, string> = {
    Medical: "طبي", Financial: "مالي", Food: "غذاء",
    Housing: "سكن", Education: "تعليم", Utilities: "مرافق",
    Other: "أخرى", General: "عام",
};

const ASSISTANCE_COLORS: Record<string, string> = {
    Medical: "bg-rose-500 text-rose-500", Financial: "bg-sky-500 text-sky-500",
    Food: "bg-amber-500 text-amber-500", Housing: "bg-blue-500 text-blue-500",
    Education: "bg-yellow-500 text-yellow-500", Utilities: "bg-emerald-500 text-emerald-500",
    Other: "bg-slate-500 text-slate-500", General: "bg-slate-500 text-slate-500",
};

// ─── Animations ───────────────────────────────────────────────────────────────

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: any; action?: React.ReactNode }) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500 font-medium mt-1">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, colorClass, bgClass, isPrimary = false }: any) {
    return (
        <motion.div variants={itemVariants}>
            <Card className={cn(
                "relative overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border-slate-200",
                isPrimary ? "bg-primary text-white border-primary shadow-primary/20" : "bg-white"
            )}>
                {isPrimary && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                )}
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        isPrimary ? "bg-white/20 text-white" : bgClass
                    )}>
                        <Icon className={cn("w-6 h-6", isPrimary ? "text-white" : colorClass)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                            isPrimary ? "bg-white/20 text-white" : trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
                            {trend.value}%
                        </div>
                    )}
                </div>
                
                <div className="relative z-10 space-y-1">
                    <h3 className={cn("text-4xl font-black tracking-tight", isPrimary ? "text-white" : "text-slate-900")}>
                        {value}
                    </h3>
                    <p className={cn("text-sm font-bold", isPrimary ? "text-white/80" : "text-slate-500")}>{title}</p>
                    {subtitle && (
                        <p className={cn("text-xs mt-2", isPrimary ? "text-white/60" : "text-slate-400")}>{subtitle}</p>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

function QuickActionCard({ title, desc, icon: Icon, href, color }: any) {
    return (
        <motion.div variants={itemVariants}>
            <Link href={href}>
                <Card className="p-5 flex items-center gap-4 rounded-2xl border-slate-200 bg-white hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", color.bg)}>
                        <Icon className={cn("w-6 h-6", color.text)} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                </Card>
            </Link>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, impactReport, isLoading, error, refresh } = useAssociationDashboard();
    const router = useRouter();
    const { user } = useAuthContext();

    if (isLoading) {
        return <DashboardSkeleton userType="organization" sidebar={<OrganizationSidebar />} />;
    }

    if (error) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-slate-50" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-4 max-w-sm px-4">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">تعذر تحميل البيانات</h2>
                            <p className="font-medium text-slate-500">{error}</p>
                            <Button onClick={refresh} className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
                                <RefreshCw className="w-5 h-5 ml-2" /> إعادة المحاولة
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const pendingCount = analytics?.totalRequestsInReview ?? 0;
    const orgName = user?.name || "جمعيتنا";

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-[#F8FAFC]" dir="rtl">
                <DashboardTopBar userType="organization" />
                
                <main className="px-4 sm:px-6 lg:px-8 pt-8 pb-24 w-full max-w-[1600px] mx-auto">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                        
                        {/* ─── Hero Section ─── */}
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                            {/* Decorative Blur */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        النظام متصل ويعمل بكفاءة
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                        مرحباً بك مجدداً، <span className="text-primary">{orgName}</span>
                                    </h1>
                                    <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
                                        هذا هو ملخص أداء جمعيتك اليوم. لديك <strong className="text-amber-600">{pendingCount} طلبات</strong> بانتظار المراجعة، ونظام الذكاء الاصطناعي قام بأتمتة {Math.round(analytics?.aiProcessingRate || 0)}% من سير العمل.
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="outline" onClick={refresh} className="rounded-xl h-12 px-5 font-bold border-slate-200 hover:bg-slate-50 text-slate-600">
                                        <RefreshCw className="w-5 h-5 ml-2" /> تحديث
                                    </Button>
                                    <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                                        <Link href="/dashboard/organization/campaigns/new">
                                            <Plus className="w-5 h-5 ml-2" /> إنشاء حملة جديدة
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* ─── Urgent Action Banner ─── */}
                        {pendingCount > 0 && (
                            <motion.div variants={itemVariants} className="bg-gradient-to-l from-amber-50 to-orange-50/50 rounded-2xl p-1 border border-amber-200/60 shadow-sm relative overflow-hidden group">
                                <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-inner shadow-white/20">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 font-black text-lg">طلبات عاجلة للمراجعة</h3>
                                            <p className="text-slate-600 text-sm font-medium mt-0.5">يوجد <span className="text-amber-600 font-bold">{pendingCount} طلبات</span> تنتظر قرارك النهائي لتقديم المساعدة.</p>
                                        </div>
                                    </div>
                                    <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-500/20 shrink-0 border-0 h-11 px-6">
                                        <Link href="/dashboard/organization/pending">
                                            مراجعة الطلبات <ArrowLeft className="w-4 h-4 mr-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Quick Actions Grid ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuickActionCard 
                                title="مراجعة الطلبات" desc={\`الطلبات المعلقة: \${pendingCount}\`} href="/dashboard/organization/pending" icon={Search} 
                                color={{ bg: "bg-amber-50", text: "text-amber-600" }} 
                            />
                            <QuickActionCard 
                                title="إدارة الحملات" desc="إطلاق ومتابعة الحملات" href="/dashboard/organization/campaigns" icon={Megaphone} 
                                color={{ bg: "bg-blue-50", text: "text-blue-600" }} 
                            />
                            <QuickActionCard 
                                title="التبرعات الواردة" desc="سجل التبرعات والموارد" href="/dashboard/organization/donations" icon={Award} 
                                color={{ bg: "bg-emerald-50", text: "text-emerald-600" }} 
                            />
                            <QuickActionCard 
                                title="التواصل المباشر" desc="رسائل الأسر والجهات" href="/dashboard/organization/messages" icon={Send} 
                                color={{ bg: "bg-purple-50", text: "text-purple-600" }} 
                            />
                        </div>

                        {/* ─── KPI Cards ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard 
                                title="إجمالي الطلبات المستلمة" value={analytics?.totalRequestsReceived || 0} subtitle="منذ بداية الشهر"
                                icon={FileText} trend={{ positive: true, value: 12 }} isPrimary={true}
                            />
                            <MetricCard 
                                title="طلبات قيد المراجعة" value={analytics?.totalRequestsInReview || 0} subtitle="تحتاج إجراء"
                                icon={Clock} colorClass="text-amber-500" bgClass="bg-amber-50"
                            />
                            <MetricCard 
                                title="الحالات المعتمدة" value={analytics?.totalRequestsApproved || 0} subtitle="تم الموافقة بنجاح"
                                icon={ShieldCheck} trend={{ positive: true, value: 5 }} colorClass="text-emerald-500" bgClass="bg-emerald-50"
                            />
                            <MetricCard 
                                title="الطلبات المرفوضة" value={analytics?.totalRequestsRejected || 0} subtitle="لم تستوف الشروط"
                                icon={XCircle} trend={{ positive: false, value: 2 }} colorClass="text-rose-500" bgClass="bg-rose-50"
                            />
                        </div>

                        {/* ─── Main Content Grid ─── */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            
                            {/* Left Column (Charts & Impact) */}
                            <div className="lg:col-span-2 space-y-8">
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white shadow-sm">
                                        <SectionHeading title="تحليل معدل الطلبات" subtitle="مقارنة بين الطلبات الواردة والمعتمدة شهرياً" icon={TrendingUp} />
                                        <div className="mt-8 h-[350px]">
                                            <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Activity / Tasks Timeline */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white shadow-sm">
                                        <SectionHeading title="أحدث النشاطات والمهام" subtitle="سجل متابعة الأعمال المجدولة للجمعية" icon={Calendar} />
                                        <div className="mt-6">
                                            {undertakings?.tasks && undertakings.tasks.length > 0 ? (
                                                <div className="space-y-6">
                                                    {undertakings.tasks.slice(0, 4).map((task: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 relative">
                                                            {idx !== Math.min(3, undertakings.tasks.length - 1) && (
                                                                <div className="absolute top-10 bottom-[-24px] right-5 w-[2px] bg-slate-100" />
                                                            )}
                                                            <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                                                                <div className="w-3 h-3 rounded-full bg-primary" />
                                                            </div>
                                                            <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100/50">
                                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{task.title}</h4>
                                                                <p className="text-xs text-slate-500 font-medium">{task.description}</p>
                                                                <span className="inline-block mt-3 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                                    {new Date(task.date || Date.now()).toLocaleDateString("ar-EG")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <h3 className="font-bold text-slate-900">سجل النشاطات فارغ</h3>
                                                    <p className="text-sm text-slate-500 mt-1 max-w-sm">لا توجد أحداث أو مهام مسجلة حالياً. جميع الأعمال مكتملة.</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Right Column (AI & Distribution) */}
                            <div className="space-y-8">
                                
                                {/* AI Assistant Panel */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-0 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-black tracking-tight">الذكاء الاصطناعي</h2>
                                                    <p className="text-xs text-slate-400 font-medium">أتمتة الفرز والتقييم الذكي</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-sm font-bold text-slate-300">معدل الأتمتة العام</span>
                                                        <span className="text-2xl font-black text-white">{Math.round(analytics?.aiProcessingRate || 0)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary rounded-full relative">
                                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-sm font-bold text-slate-300">دقة التقييم والتوصيات</span>
                                                        <span className="text-xl font-bold text-white">{Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: \`\${Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%\` }} />
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-white/10">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">رؤى النظام</h4>
                                                    <ul className="space-y-3">
                                                        <li className="flex items-start gap-2.5">
                                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Zap className="w-3 h-3 text-primary-foreground" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-200 leading-snug">تمت تصفية {analytics?.totalRequestsRejected || 0} طلبات آلياً لعدم استيفاء الشروط الأساسية.</span>
                                                        </li>
                                                        <li className="flex items-start gap-2.5">
                                                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                                <BrainCircuit className="w-3 h-3 text-blue-400" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-200 leading-snug">الأولوية الحالية لطلبات "السكن" بناءً على خوارزمية الاحتياج.</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Distribution Donut */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white shadow-sm">
                                        <SectionHeading title="توزيع الطلبات" subtitle="حسب نوع المساعدة" icon={PieChart} />
                                        <div className="mt-4">
                                            <RequestTypeChart data={analytics?.requestsByType || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>

                    </motion.div>
                </main>
            </div>
        </DashboardLayout>
    );
}
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Rebuilt successfully!');
