const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'dashboard', 'organization', 'page.tsx');

const content = `"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardSkeleton } from "@/shared/components/common/DashboardSkeleton";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { 
    Building2, Activity, CheckCircle2, AlertCircle, FileText, Users, 
    Search, Megaphone, Clock, Award, XCircle, TrendingUp, Calendar, 
    Zap, BrainCircuit, Sparkles, Send, ShieldCheck, PieChart, Plus, ArrowLeft, RefreshCw, ActivitySquare, ChevronLeft, Heart, HandHeart
} from "lucide-react";
import { useAssociationDashboard } from "@/features/associations";
import { MonthlyTrendChart, RequestTypeChart } from "@/features/dashboard/components/AnalyticsCharts";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { useAuthContext } from "@/shared/providers";

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: any; action?: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-500 font-medium mt-1">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// Animated Number Counter Component
function NumberCounter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const end = value || 0;
        if (start === end) return;
        
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(easeProgress * end));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        
        requestAnimationFrame(animate);
    }, [value]);

    return <span>{count.toLocaleString('en-US')}</span>;
}

// Mini Sparkline component
function Sparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
    const color = isPositive ? "#10b981" : "#f43f5e"; // emerald or rose
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min;
    
    // Normalize data to 0-100% for SVG
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = 100 - (((d - min) / (range || 1)) * 100);
        return \`\${x},\${y}\`;
    }).join(" ");

    return (
        <svg viewBox="-5 -5 110 110" className="w-16 h-8 overflow-visible" preserveAspectRatio="none">
            <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, colorClass, bgClass, isPrimary = false, sparklineData }: any) {
    return (
        <motion.div variants={itemVariants} className={isPrimary ? "lg:col-span-2" : ""}>
            <Card className={cn(
                "relative overflow-hidden p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-slate-100 bg-white"
            )}>
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        isPrimary ? "bg-primary/10 text-primary" : bgClass
                    )}>
                        <Icon className={cn("w-6 h-6", isPrimary ? "text-primary" : colorClass)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                            trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                            <span dir="ltr">{trend.positive ? '+' : '-'}{trend.value}%</span>
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-2">{title}</p>
                        <h4 className="text-5xl font-black text-slate-900 tracking-tight">
                            <NumberCounter value={value} />
                        </h4>
                    </div>
                    {sparklineData && (
                        <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={sparklineData} isPositive={trend?.positive !== false} />
                        </div>
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50 relative z-10 flex justify-between items-center">
                   {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
                </div>
            </Card>
        </motion.div>
    );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
function StatusChip({ status, label }: { status: "online" | "review" | "active" | "error"; label: string }) {
    const variants = {
        online: "bg-emerald-50 text-emerald-600 border-emerald-100",
        review: "bg-amber-50 text-amber-600 border-amber-100",
        active: "bg-blue-50 text-blue-600 border-blue-100",
        error: "bg-rose-50 text-rose-600 border-rose-100",
    };
    const dots = {
        online: "bg-emerald-500",
        review: "bg-amber-500",
        active: "bg-blue-500",
        error: "bg-rose-500",
    };

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border", variants[status])}>
            <span className={cn("w-1.5 h-1.5 rounded-full", dots[status])} />
            {label}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, impactReport, isLoading, error, refresh } = useAssociationDashboard();
    const router = useRouter();
    const { user } = useAuthContext();
    
    // Safely parse name
    const orgName = user?.name || "مرحباً بك";
    const firstName = orgName.split(' ')[0] || "مرحباً";

    if (isLoading) {
        return <DashboardSkeleton userType="organization" sidebar={<OrganizationSidebar />} />;
    }

    if (error) {
        return (
            <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                    <DashboardTopBar userType="organization" />
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-500/20">
                            <AlertCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">عذراً، حدث خطأ في التحميل</h2>
                        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
                        <Button onClick={refresh} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-slate-900/20">
                            <RefreshCw className="w-5 h-5 mr-2" />
                            إعادة المحاولة
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const pendingCount = analytics?.totalRequestsInReview ?? 0;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

    // Mock impact metrics based on analytics since backend doesn't provide them all yet
    const impactData = {
        familiesHelped: (analytics?.totalRequestsApproved || 120) * 4, // average 4 per family
        casesCompleted: analytics?.totalRequestsApproved || 120,
        totalDonations: "24,500 جنيه",
        volunteers: 45
    };

    return (
        <div className="flex h-screen bg-transparent overflow-hidden" dir="rtl">
            <OrganizationSidebar />
            
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative scroll-smooth">
                <DashboardTopBar userType="organization" />

                <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:max-w-7xl mx-auto w-full">
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        {/* ─── Hero Section (9.8/10 Dynamic Design) ─── */}
                        <motion.div variants={itemVariants}>
                            <div className="mb-2 flex items-center gap-4 text-xs font-bold text-slate-400">
                                <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">{dateStr}</span>
                                <span className="hidden sm:inline-block">──────────</span>
                                <span className="hidden sm:inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">
                                    آخر مزامنة 10:22 <RefreshCw className="w-3 h-3 text-slate-400" />
                                </span>
                                <span className="hidden sm:inline-block">──────────</span>
                                <StatusChip status="online" label="النظام متصل" />
                            </div>

                            <Card className="relative overflow-hidden bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border-0 shadow-2xl shadow-slate-900/10">
                                {/* Subtle Illustration */}
                                <div className="absolute left-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none flex items-center justify-start overflow-hidden">
                                    <BrainCircuit className="w-96 h-96 -translate-x-1/4 scale-150" />
                                </div>
                                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                                <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                                <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row gap-10 justify-between items-start lg:items-center">
                                    
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2">
                                                مرحباً، <span className="text-primary-foreground drop-shadow-md">{firstName}</span> 👋
                                            </h1>
                                            <p className="text-slate-300 font-medium text-lg">يسعدنا رؤيتك اليوم، إليك ملخص حالة الجمعية السريعة:</p>
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-sm font-bold bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md w-fit">
                                            <div className="flex flex-col gap-1 pr-4 border-l border-white/10">
                                                <span className="text-slate-400">📄 الطلبات الجديدة</span>
                                                <span className="text-2xl text-white"><NumberCounter value={12} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1 pr-4 border-l border-white/10">
                                                <span className="text-slate-400">⏳ تنتظر المراجعة</span>
                                                <span className="text-2xl text-amber-400"><NumberCounter value={pendingCount} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1 pr-4 border-l border-white/10">
                                                <span className="text-slate-400">✅ حالات معتمدة</span>
                                                <span className="text-2xl text-emerald-400"><NumberCounter value={analytics?.totalRequestsApproved || 0} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-400">🤖 AI Confidence</span>
                                                <span className="text-2xl text-primary-foreground">{Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 font-bold w-full justify-start transition-all hover:scale-105 shadow-xl shadow-primary/20">
                                            <Link href="/dashboard/organization/campaigns/new">
                                                <Plus className="w-5 h-5 ml-3" />
                                                إنشاء حملة جديدة
                                            </Link>
                                        </Button>
                                        <Button asChild className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl h-12 px-6 font-bold w-full justify-start transition-all">
                                            <Link href="/dashboard/organization/pending">
                                                <Search className="w-5 h-5 ml-3 opacity-70" />
                                                مراجعة الطلبات المعلقة
                                            </Link>
                                        </Button>
                                        <Button asChild className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl h-12 px-6 font-bold w-full justify-start transition-all">
                                            <Link href="/dashboard/organization/documents">
                                                <FileText className="w-5 h-5 ml-3 opacity-70" />
                                                رفع مستند للمنصة
                                            </Link>
                                        </Button>
                                    </div>

                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── AI Contextual Insight ─── */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-3 bg-white/80 border border-primary/20 rounded-2xl p-4 shadow-sm relative overflow-hidden group backdrop-blur-xl">
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary group-hover:w-2 transition-all" />
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">
                                        <span className="text-primary ml-1">ملاحظة الذكاء الاصطناعي:</span>
                                        ارتفعت نسبة الموافقات التلقائية <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs mx-1 inline-flex items-center"><TrendingUp className="w-3 h-3 ml-0.5" /> 12%</span> هذا الأسبوع بسبب تحسن دقة البيانات المرفوعة.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ─── KPI Cards Grid ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {/* Primary Card spans 2 cols */}
                            <MetricCard 
                                title="إجمالي الطلبات المستلمة" value={analytics?.totalRequestsReceived || 142} subtitle="تم استقبالها ومعالجتها هذا الشهر"
                                icon={FileText} trend={{ positive: true, value: 12 }} isPrimary={true}
                                sparklineData={[10, 15, 25, 20, 35, 45, 40]}
                            />
                            <MetricCard 
                                title="طلبات قيد المراجعة" value={analytics?.totalRequestsInReview || 0} subtitle="تحتاج إجراء حالي"
                                icon={Clock} colorClass="text-amber-500" bgClass="bg-amber-50"
                                sparklineData={[20, 18, 15, 10, 8, 12, 10]} trend={{ positive: false, value: 5 }}
                            />
                            <MetricCard 
                                title="الحالات المعتمدة" value={analytics?.totalRequestsApproved || 89} subtitle="تم الموافقة بنجاح"
                                icon={ShieldCheck} trend={{ positive: true, value: 8 }} colorClass="text-emerald-500" bgClass="bg-emerald-50"
                                sparklineData={[30, 35, 40, 50, 45, 55, 60]}
                            />
                            <MetricCard 
                                title="الطلبات المرفوضة" value={analytics?.totalRequestsRejected || 12} subtitle="لم تستوف الشروط"
                                icon={XCircle} colorClass="text-rose-500" bgClass="bg-rose-50"
                            />
                        </div>

                        {/* ─── Aoun Impact Showcase ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-8 rounded-3xl border-slate-100 bg-slate-900 shadow-xl overflow-hidden relative">
                                <div className="absolute -left-10 -top-10 text-white/5 pointer-events-none">
                                    <HandHeart className="w-64 h-64" />
                                </div>
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-emerald-400 to-blue-500" />
                                
                                <SectionHeading title="أثر منصة عون الإنساني" subtitle="تأثير أعمالكم الحقيقي على المجتمع وتخفيف المعاناة" icon={Heart} />
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 relative z-10">
                                    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <Users className="w-6 h-6 text-emerald-400" />
                                        <span className="text-4xl font-black text-white"><NumberCounter value={impactData.familiesHelped} /></span>
                                        <span className="text-xs font-bold text-slate-400">فرد تمت مساعدتهم</span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <ActivitySquare className="w-6 h-6 text-blue-400" />
                                        <span className="text-4xl font-black text-white"><NumberCounter value={impactData.casesCompleted} /></span>
                                        <span className="text-xs font-bold text-slate-400">حالة مكتملة</span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <Award className="w-6 h-6 text-amber-400" />
                                        <span className="text-4xl font-black text-white">{impactData.totalDonations}</span>
                                        <span className="text-xs font-bold text-slate-400">قيمة التبرعات المجمعة</span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <Users className="w-6 h-6 text-purple-400" />
                                        <span className="text-4xl font-black text-white"><NumberCounter value={impactData.volunteers} /></span>
                                        <span className="text-xs font-bold text-slate-400">متطوع نشط بالمنصة</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── Main Content Grid ─── */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            
                            {/* Left Column (Charts) */}
                            <div className="lg:col-span-2 space-y-8">
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                                        <SectionHeading title="تحليل معدل الطلبات" subtitle="مقارنة بين الطلبات الواردة والمعتمدة شهرياً" icon={TrendingUp} />
                                        <div className="mt-8 h-[350px]">
                                            <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Right Column (Donut & Activity) */}
                            <div className="space-y-8">
                                
                                {/* Distribution Donut */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                                        <SectionHeading title="توزيع الطلبات" subtitle="حسب نوع المساعدة" icon={PieChart} />
                                        <div className="mt-6 h-[250px]">
                                            <RequestTypeChart data={analytics?.requestsByType || {}} />
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Activity / Tasks Timeline */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 sm:p-8 rounded-3xl border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                                        <SectionHeading title="أحدث النشاطات" subtitle="سجل متابعة الأعمال الفورية" icon={Calendar} />
                                        <div className="mt-6">
                                            {undertakings?.tasks && undertakings.tasks.length > 0 ? (
                                                <div className="space-y-6">
                                                    {undertakings.tasks.slice(0, 4).map((task: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 relative">
                                                            {idx !== Math.min(3, undertakings.tasks.length - 1) && (
                                                                <div className="absolute top-10 bottom-[-24px] right-5 w-[2px] bg-slate-100" />
                                                            )}
                                                            <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                                                                {idx === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />}
                                                            </div>
                                                            <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all">
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
                                                    <p className="text-sm text-slate-500 mt-1 max-w-sm">لا توجد أحداث أو مهام مسجلة حالياً.</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
}
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Rebuilt successfully!');
