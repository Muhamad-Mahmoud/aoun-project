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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: any; action?: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>}
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
        const end = typeof value === 'number' ? value : parseInt((value || '0').toString().replace(/,/g, ''));
        if (start === end || isNaN(end)) return;
        
        const startTime = performance.now();
        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * end));
            
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(end);
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
        <motion.div variants={itemVariants}>
            <Card className={cn(
                "relative overflow-hidden p-5 rounded-2xl transition-all duration-300 hover:shadow-lg group border-slate-200 bg-white",
                isPrimary && "ring-1 ring-primary/20 bg-gradient-to-br from-white to-primary/5"
            )}>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        isPrimary ? "bg-primary/10 text-primary" : bgClass
                    )}>
                        <Icon className={cn("w-5 h-5", isPrimary ? "text-primary" : colorClass)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                            trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                            <span dir="ltr">{trend.positive ? '+' : '-'}{trend.value}%</span>
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">{title}</p>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                            <NumberCounter value={value} />
                        </h4>
                    </div>
                    {sparklineData && (
                        <div className="mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={sparklineData} isPositive={trend?.positive !== false} />
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

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
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white", variants[status])}>
            <span className={cn("w-1.5 h-1.5 rounded-full", dots[status])} />
            {label}
        </span>
    );
}

export default function OrganizationDashboardPage() {
    const { undertakings, analytics, isLoading, error, refresh } = useAssociationDashboard();
    const router = useRouter();
    const { user } = useAuthContext();
    
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

    const impactData = {
        familiesHelped: (analytics?.totalRequestsApproved || 120) * 4,
        casesCompleted: analytics?.totalRequestsApproved || 120,
        totalDonations: 24500,
        volunteers: 45
    };

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden" dir="rtl">
            <div className="hidden lg:block z-40 relative">
               <OrganizationSidebar />
            </div>
            
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative scroll-smooth bg-gradient-to-br from-[#ffffff] via-[#f8fffc] to-[#eefbf5]">
                <DashboardTopBar userType="organization" />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:max-w-[1400px] mx-auto w-full">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                        
                        {/* ─── Top Meta ─── */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">{dateStr}</span>
                            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                آخر مزامنة 10:22 <RefreshCw className="w-3 h-3" />
                            </span>
                            <StatusChip status="online" label="النظام متصل" />
                        </motion.div>

                        {/* ─── Hero Section ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="relative overflow-hidden bg-slate-900 text-white rounded-2xl sm:rounded-3xl border-0 shadow-lg shadow-slate-900/10">
                                {/* Subtle Background Elements */}
                                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                                <div className="absolute left-10 top-0 bottom-0 opacity-5 pointer-events-none hidden md:flex items-center">
                                    <Heart className="w-72 h-72" />
                                </div>

                                <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center">
                                    <div className="flex-1 w-full space-y-6 lg:space-y-8">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
                                                مرحباً، <span className="text-primary-foreground">{firstName}</span> 👋
                                            </h1>
                                            <p className="text-slate-300 font-medium text-sm sm:text-base">إليك ملخص حالة المنصة اليوم.</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-bold bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md w-full max-w-3xl">
                                            <div className="flex flex-col gap-1 p-2 md:pr-4 md:border-l border-white/10">
                                                <span className="text-slate-400 text-xs">الطلبات الجديدة</span>
                                                <span className="text-xl sm:text-2xl text-white"><NumberCounter value={12} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1 p-2 md:pr-4 md:border-l border-white/10">
                                                <span className="text-slate-400 text-xs">قيد المراجعة</span>
                                                <span className="text-xl sm:text-2xl text-amber-400"><NumberCounter value={pendingCount} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1 p-2 md:pr-4 md:border-l border-white/10">
                                                <span className="text-slate-400 text-xs">حالات معتمدة</span>
                                                <span className="text-xl sm:text-2xl text-emerald-400"><NumberCounter value={analytics?.totalRequestsApproved || 0} /></span>
                                            </div>
                                            <div className="flex flex-col gap-1 p-2">
                                                <span className="text-slate-400 text-xs">AI Confidence</span>
                                                <span className="text-xl sm:text-2xl text-primary-foreground">{Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full xl:w-64 gap-2 shrink-0">
                                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-4 font-bold w-full justify-start shadow-md shadow-primary/20">
                                            <Link href="/dashboard/organization/campaigns/new">
                                                <Plus className="w-4 h-4 ml-2" />
                                                إنشاء حملة
                                            </Link>
                                        </Button>
                                        <Button asChild className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl h-11 px-4 font-bold w-full justify-start">
                                            <Link href="/dashboard/organization/pending">
                                                <Search className="w-4 h-4 ml-2 opacity-70" />
                                                مراجعة الطلبات
                                            </Link>
                                        </Button>
                                        <Button asChild className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl h-11 px-4 font-bold w-full justify-start">
                                            <Link href="/dashboard/organization/documents">
                                                <FileText className="w-4 h-4 ml-2 opacity-70" />
                                                رفع مستند
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── AI Insight Banner ─── */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-start sm:items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                                    <span className="text-blue-600 ml-1">تحليل الذكاء الاصطناعي:</span>
                                    ارتفعت نسبة الموافقات <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded mx-1 whitespace-nowrap"><TrendingUp className="w-3 h-3 ml-0.5 inline" /> 12%</span> هذا الأسبوع بفضل تحسن جودة المستندات المرفوعة.
                                </p>
                            </div>
                        </motion.div>

                        {/* ─── KPI Cards ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <MetricCard 
                                title="إجمالي الطلبات" value={analytics?.totalRequestsReceived || 142} 
                                icon={FileText} trend={{ positive: true, value: 12 }} isPrimary={true}
                                sparklineData={[10, 15, 25, 20, 35, 45, 40]}
                            />
                            <MetricCard 
                                title="قيد المراجعة" value={analytics?.totalRequestsInReview || 0} 
                                icon={Clock} colorClass="text-amber-500" bgClass="bg-amber-50"
                                sparklineData={[20, 18, 15, 10, 8, 12, 10]} trend={{ positive: false, value: 5 }}
                            />
                            <MetricCard 
                                title="حالات معتمدة" value={analytics?.totalRequestsApproved || 89} 
                                icon={ShieldCheck} trend={{ positive: true, value: 8 }} colorClass="text-emerald-500" bgClass="bg-emerald-50"
                                sparklineData={[30, 35, 40, 50, 45, 55, 60]}
                            />
                            <MetricCard 
                                title="الطلبات المرفوضة" value={analytics?.totalRequestsRejected || 12} 
                                icon={XCircle} colorClass="text-rose-500" bgClass="bg-rose-50"
                            />
                        </div>

                        {/* ─── Aoun Impact Showcase ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-slate-100 bg-white shadow-sm overflow-hidden relative">
                                <SectionHeading title="أثر منصة عون" subtitle="تأثير أعمالكم الحقيقي على المجتمع" icon={HandHeart} />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Users className="w-5 h-5 text-emerald-500 mb-1" />
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900"><NumberCounter value={impactData.familiesHelped} /></span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-500">فرد تمت مساعدتهم</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <ActivitySquare className="w-5 h-5 text-blue-500 mb-1" />
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900"><NumberCounter value={impactData.casesCompleted} /></span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-500">حالة مكتملة</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Award className="w-5 h-5 text-amber-500 mb-1" />
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900"><NumberCounter value={impactData.totalDonations} /></span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-500">التبرعات (﷼)</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Users className="w-5 h-5 text-purple-500 mb-1" />
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900"><NumberCounter value={impactData.volunteers} /></span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-500">متطوع نشط</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── Main Content Grid ─── */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left Column (Charts) */}
                            <div className="lg:col-span-2">
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm h-full flex flex-col">
                                        <SectionHeading title="معدل الطلبات" subtitle="مقارنة بين الطلبات شهرياً" icon={TrendingUp} />
                                        <div className="flex-1 min-h-[300px]">
                                            <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Right Column (Donut) */}
                            <div>
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm h-full flex flex-col">
                                        <SectionHeading title="توزيع الطلبات" subtitle="حسب نوع المساعدة" icon={PieChart} />
                                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                                            <RequestTypeChart data={analytics?.requestsByType || {}} />
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
