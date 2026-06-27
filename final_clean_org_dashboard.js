const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'dashboard', 'organization', 'page.tsx');

const content = `"use client";

import { useState, useEffect } from "react";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardSkeleton } from "@/shared/components/common/DashboardSkeleton";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { 
    FileText, Users, Search, Clock, Award, XCircle, TrendingUp, Calendar, 
    Sparkles, ShieldCheck, PieChart, Plus, Heart, ChevronLeft, Activity, ArrowUpRight
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

function NumberCounter({ value }: { value: number | string }) {
    const [count, setCount] = useState(0);
    const [isFormatted, setIsFormatted] = useState(false);

    useEffect(() => {
        if (typeof value === 'string' && value.includes('M')) {
            setIsFormatted(true);
            return;
        }
        let start = 0;
        const duration = 1000;
        const end = typeof value === 'number' ? value : parseInt((value || '0').toString().replace(/,/g, ''));
        if (start === end || isNaN(end)) {
            setCount(end);
            return;
        }
        
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

    if (isFormatted) return <span>{value}</span>;
    return <span>{count.toLocaleString('en-US')}</span>;
}

function Sparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
    const color = isPositive ? "#10b981" : "#f43f5e"; 
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
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
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

function MetricCard({ title, value, icon: Icon, trend, isPrimary = false, sparklineData, colorClass }: any) {
    return (
        <motion.div variants={itemVariants}>
            <Card className={cn(
                "relative overflow-hidden p-5 rounded-2xl transition-all duration-300 hover:shadow-md border bg-white flex flex-col justify-between h-full group",
                isPrimary ? "border-primary/20 ring-1 ring-primary/5" : "border-slate-200"
            )}>
                {/* Header: Title & Icon */}
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-slate-600">{title}</p>
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        isPrimary ? "bg-primary/10" : "bg-slate-50"
                    )}>
                        <Icon className={cn("w-5 h-5", isPrimary ? "text-primary" : colorClass || "text-slate-500")} />
                    </div>
                </div>

                {/* Body: Value & Trend */}
                <div className="flex items-end justify-between z-10 relative">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                            <NumberCounter value={value} />
                        </h4>
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg",
                            trend.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}>
                            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                            <span dir="ltr">{trend.positive ? '+' : '-'}{trend.value}%</span>
                        </div>
                    )}
                </div>

                {/* Footer: Sparkline */}
                {sparklineData && (
                    <div className="mt-4 h-12 w-full opacity-70 group-hover:opacity-100 transition-opacity relative z-0">
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
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">حدث خطأ في التحميل</h2>
                        <Button onClick={refresh} className="bg-slate-900 text-white rounded-xl h-12 px-8 font-bold mt-4">
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
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden" dir="rtl">
            <div className="hidden lg:block z-40 relative">
               <OrganizationSidebar />
            </div>
            
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative scroll-smooth">
                <DashboardTopBar userType="organization" />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:max-w-[1400px] mx-auto w-full">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                        
                        {/* ─── 1. Compact Hero / Header ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
                                {/* Subtle Background Gradient & Illustration */}
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden md:block">
                                    <Heart className="w-48 h-48 text-emerald-900" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                                مرحباً، <span className="text-primary">{firstName}</span> 👋
                                            </h1>
                                            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                مباشر
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            آخر تحديث للبيانات اليوم، {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-5 font-bold shadow-sm flex-1 md:flex-none">
                                            <Link href="/dashboard/organization/campaigns/new">
                                                <Plus className="w-4 h-4 ml-2" />
                                                إنشاء حملة
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="rounded-xl h-10 px-5 font-bold border-slate-200 hover:bg-slate-50 flex-1 md:flex-none">
                                            <Link href="/dashboard/organization/pending">
                                                <Search className="w-4 h-4 ml-2 text-slate-400" />
                                                المراجعة
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── 2. KPI Cards ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <MetricCard 
                                title="الطلبات الجديدة" value={12} 
                                icon={FileText} trend={{ positive: true, value: 14 }} isPrimary={true}
                                sparklineData={[5, 10, 15, 8, 20, 25, 30]}
                            />
                            <MetricCard 
                                title="قيد المراجعة" value={pendingCount} 
                                icon={Clock} colorClass="text-amber-500"
                                sparklineData={[20, 18, 15, 10, 8, 12, 10]} trend={{ positive: false, value: 5 }}
                            />
                            <MetricCard 
                                title="الحالات المعتمدة" value={analytics?.totalRequestsApproved || 89} 
                                icon={ShieldCheck} trend={{ positive: true, value: 8 }} colorClass="text-emerald-500"
                                sparklineData={[30, 35, 40, 50, 45, 55, 60]}
                            />
                            <MetricCard 
                                title="إجمالي التبرعات (﷼)" value={"2.4M"} 
                                icon={Award} trend={{ positive: true, value: 24 }} colorClass="text-purple-500"
                                sparklineData={[10, 20, 15, 30, 40, 50, 65]}
                            />
                        </div>

                        {/* ─── 3. Analytics Charts ─── */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left Column (Line Chart) */}
                            <div className="lg:col-span-2">
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-2xl border-slate-200 bg-white shadow-sm h-full flex flex-col">
                                        <SectionHeading title="معدل الطلبات" subtitle="مقارنة بين الطلبات شهرياً خلال العام الحالي" icon={TrendingUp} />
                                        <div className="flex-1 min-h-[300px]">
                                            <MonthlyTrendChart data={analytics?.requestsByMonth || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Right Column (Donut Chart) */}
                            <div>
                                <motion.div variants={itemVariants} className="h-full">
                                    <Card className="p-6 rounded-2xl border-slate-200 bg-white shadow-sm h-full flex flex-col">
                                        <SectionHeading title="توزيع الفئات" subtitle="أنواع المساعدات المطلوبة" icon={PieChart} />
                                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                                            <RequestTypeChart data={analytics?.requestsByType || {}} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>

                        {/* ─── 4. AI Assistant Card ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-50/50 to-white shadow-sm rounded-2xl">
                                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-slate-900">AI Assistant Insight</h3>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">دقة التحليل 84%</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">
                                                ارتفعت نسبة الموافقات التلقائية <span className="font-bold text-emerald-600">12%</span> هذا الأسبوع. يمكنك تفعيل المراجعة التلقائية المتقدمة لتوفير 15 ساعة عمل.
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl h-10 px-5 font-bold shrink-0">
                                        عرض التفاصيل
                                        <ArrowUpRight className="w-4 h-4 mr-2" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── 5. Recent Activity / Charity Impact ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 rounded-2xl border-slate-200 bg-white shadow-sm">
                                <SectionHeading title="الأثر الإنساني" subtitle="تأثير منصة عون الحقيقي على المجتمع" icon={Heart} />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Users className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-0.5">أسرة تمت مساعدتها</p>
                                            <p className="text-xl font-black text-slate-900">1,250</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-0.5">حالة مكتملة</p>
                                            <p className="text-xl font-black text-slate-900">970</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-0.5">جمعية نشطة</p>
                                            <p className="text-xl font-black text-slate-900">43</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                            <Heart className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-0.5">متطوعين مسجلين</p>
                                            <p className="text-xl font-black text-slate-900">185</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
}
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Final cleaned successfully!');
