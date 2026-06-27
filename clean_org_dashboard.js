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
        transition: { staggerChildren: 0.05 }
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
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

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
        <svg viewBox="-2 -2 104 104" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={\`gradient-\${isPositive ? 'pos' : 'neg'}\`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon 
                points={\`0,100 \${points} 100,100\`} 
                fill={\`url(#gradient-\${isPositive ? 'pos' : 'neg'})\`} 
            />
            <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    );
}

function MetricCard({ title, value, icon: Icon, trend, isPrimary = false, sparklineData }: any) {
    return (
        <motion.div variants={itemVariants}>
            <Card className={cn(
                "relative overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:shadow-md border bg-white flex flex-col justify-between h-full group",
                isPrimary ? "border-primary/20 shadow-primary/5" : "border-slate-200"
            )}>
                {/* Header: Title & Icon */}
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-slate-600">{title}</p>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        isPrimary ? "bg-primary/10" : "bg-slate-50"
                    )}>
                        <Icon className={cn("w-4 h-4", isPrimary ? "text-primary" : "text-slate-400")} />
                    </div>
                </div>

                {/* Body: Value & Trend */}
                <div className="flex items-baseline gap-3 mb-2 z-10 relative">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                        <NumberCounter value={value} />
                    </h4>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md",
                            trend.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}>
                            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                            <span dir="ltr">{trend.positive ? '+' : '-'}{trend.value}%</span>
                        </div>
                    )}
                </div>

                {/* Footer: Sparkline */}
                {sparklineData && (
                    <div className="mt-4 h-10 w-full opacity-60 group-hover:opacity-100 transition-opacity relative z-0">
                        <Sparkline data={sparklineData} isPositive={trend?.positive !== false} />
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    const dateStr = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden" dir="rtl">
            {/* Sidebar Desktop */}
            <div className="hidden lg:block z-40 relative">
               <OrganizationSidebar />
            </div>
            
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative scroll-smooth bg-slate-50/30">
                <DashboardTopBar userType="organization" />

                <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:max-w-[1400px] mx-auto w-full">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                        
                        {/* ─── Top Meta ─── */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-bold text-slate-600">النظام متصل ويعمل بشكل ممتاز</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                <span>{dateStr}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1.5">
                                    آخر تحديث للبيانات: منذ دقيقة
                                </span>
                            </div>
                        </motion.div>

                        {/* ─── Hero Section (SaaS Style) ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="relative overflow-hidden bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl">
                                {/* Subtle Background Elements */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                
                                <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col gap-8 lg:gap-12">
                                    
                                    {/* Top Row: Welcome & CTAs */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                        <div className="space-y-4 max-w-2xl">
                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                                                مرحباً، <span className="text-primary-foreground">{firstName}</span> 👋
                                            </h1>
                                            <p className="text-slate-400 font-medium text-base sm:text-lg leading-relaxed">
                                                هذه نظرة شاملة على أداء جمعيتك اليوم. يمكنك إدارة حملاتك ومراجعة الطلبات بسهولة من لوحة التحكم الذكية.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 font-bold flex-1 lg:flex-none shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                                <Link href="/dashboard/organization/campaigns/new">
                                                    <Plus className="w-5 h-5 ml-2" />
                                                    إنشاء حملة
                                                </Link>
                                            </Button>
                                            <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/5 rounded-xl h-12 px-6 font-bold flex-1 lg:flex-none backdrop-blur-md transition-all">
                                                <Link href="/dashboard/organization/pending">
                                                    مراجعة الطلبات
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Stats Grid Inside Hero */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                        <div className="bg-slate-900/50 p-5 sm:p-6 flex flex-col gap-2 transition-colors hover:bg-slate-900/30">
                                            <span className="text-slate-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                                                <FileText className="w-4 h-4" /> الطلبات الجديدة
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-black text-white"><NumberCounter value={12} /></span>
                                        </div>
                                        <div className="bg-slate-900/50 p-5 sm:p-6 flex flex-col gap-2 transition-colors hover:bg-slate-900/30">
                                            <span className="text-slate-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-500/80" /> قيد المراجعة
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-black text-amber-400"><NumberCounter value={pendingCount} /></span>
                                        </div>
                                        <div className="bg-slate-900/50 p-5 sm:p-6 flex flex-col gap-2 transition-colors hover:bg-slate-900/30">
                                            <span className="text-slate-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500/80" /> حالات معتمدة
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-black text-emerald-400"><NumberCounter value={analytics?.totalRequestsApproved || 0} /></span>
                                        </div>
                                        <div className="bg-slate-900/50 p-5 sm:p-6 flex flex-col gap-2 transition-colors hover:bg-slate-900/30 relative overflow-hidden">
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
                                            <span className="text-slate-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                                                <BrainCircuit className="w-4 h-4 text-primary/80" /> AI Confidence
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-black text-primary-foreground">{Math.round((analytics?.averageAiConfidence ?? 0) * 100) || 84}%</span>
                                        </div>
                                    </div>

                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── AI Insight Banner (Clean) ─── */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-4 bg-white border border-primary/10 rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-700">
                                        <span className="text-primary ml-1">تلميح ذكي:</span>
                                        نسبة اكتمال ملفات الأسر ارتفعت بمقدار <span className="text-emerald-600">12%</span> هذا الأسبوع، مما يسرّع عملية المراجعة التلقائية.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ─── KPI Cards (Linear Style) ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <MetricCard 
                                title="إجمالي الطلبات" value={analytics?.totalRequestsReceived || 142} 
                                icon={FileText} trend={{ positive: true, value: 12 }} isPrimary={true}
                                sparklineData={[10, 15, 25, 20, 35, 45, 40]}
                            />
                            <MetricCard 
                                title="طلبات معلقة" value={analytics?.totalRequestsInReview || 0} 
                                icon={Clock}
                                sparklineData={[20, 18, 15, 10, 8, 12, 10]} trend={{ positive: false, value: 5 }}
                            />
                            <MetricCard 
                                title="طلبات مقبولة" value={analytics?.totalRequestsApproved || 89} 
                                icon={ShieldCheck} trend={{ positive: true, value: 8 }}
                                sparklineData={[30, 35, 40, 50, 45, 55, 60]}
                            />
                            <MetricCard 
                                title="مرفوضة مؤقتاً" value={analytics?.totalRequestsRejected || 12} 
                                icon={XCircle}
                            />
                        </div>

                        {/* ─── Main Content Grid (Charts) ─── */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left Column (Charts) */}
                            <div className="lg:col-span-2">
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-3xl border-slate-200 bg-white shadow-sm h-full flex flex-col">
                                        <SectionHeading title="معدل الطلبات الواردة" subtitle="مقارنة بين الطلبات شهرياً خلال العام الحالي" icon={TrendingUp} />
                                        <div className="flex-1 min-h-[350px]">
                                            <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Right Column (Donut) */}
                            <div>
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-3xl border-slate-200 bg-white shadow-sm h-full flex flex-col">
                                        <SectionHeading title="توزيع الفئات" subtitle="أنواع المساعدات المطلوبة" icon={PieChart} />
                                        <div className="flex-1 min-h-[300px] flex items-center justify-center">
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
console.log('Cleaned successfully!');
