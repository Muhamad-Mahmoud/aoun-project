"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { useAuthContext } from "@/shared/providers";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { RequestHistoryTable, type RequestHistoryItem } from "@/features/dashboard/components/RequestHistoryTable";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
    FileText, Clock, CheckCircle, Shield, LucideIcon, Stethoscope, Heart, Home, 
    PlusCircle, Loader2, Coins, GraduationCap, CreditCard, HelpCircle, ArrowLeft, 
    User, MessageCircle, MessageSquare, ChevronLeft, Plus, ShieldCheck, TrendingUp, Activity, Star
} from "lucide-react";
import { getFamilyStatistics } from "@/features/families/api/familiesApi";
import { getRequests, getRequestById } from "@/features/requests/api/requestsApi";
import type { FamilyStatistics } from "@/features/families/types";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { Skeleton } from "@/shared/ui/skeleton";
import { resolveStatus, statusConfig as statusDisplayConfig, categoryConfig, resolveCategory } from "@/features/requests/config/requestConfig";
import { cn } from "@/shared/utils";

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

// ─── Helper Components ────────────────────────────────────────────────────────

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
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg viewBox="-2 -2 104 104" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`gradient-${isPositive ? 'pos' : 'neg'}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon 
                points={`0,100 ${points} 100,100`} 
                fill={`url(#gradient-${isPositive ? 'pos' : 'neg'})`} 
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
        <motion.div variants={itemVariants} className="h-full">
            <Card className={cn(
                "relative overflow-hidden p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-md border bg-card flex flex-col h-full group",
                isPrimary ? "border-emerald-500/30 ring-1 ring-emerald-500/10" : "border-border"
            )}>
                {/* Header: Title & Icon */}
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <p className="text-xs sm:text-sm font-bold text-muted-foreground line-clamp-1">{title}</p>
                    <div className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        isPrimary ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-muted"
                    )}>
                        <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isPrimary ? "text-emerald-600 dark:text-emerald-400" : colorClass || "text-slate-500 dark:text-slate-400")} />
                    </div>
                </div>

                <div className="mt-auto">
                    {/* Body: Value & Trend */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2 z-10 relative">
                        <h4 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                            <NumberCounter value={value} />
                        </h4>
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg w-fit",
                                trend.positive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                            )}>
                                {trend.positive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                <span dir="ltr">{trend.positive ? '+' : '-'}{trend.value}%</span>
                            </div>
                        )}
                    </div>

                    {/* Footer: Sparkline */}
                    {sparklineData && (
                        <div className="mt-3 sm:mt-4 h-8 sm:h-12 w-full opacity-70 group-hover:opacity-100 transition-opacity relative z-0">
                            <Sparkline data={sparklineData} isPositive={trend?.positive !== false} />
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

// ─── Config & Types ────────────────────────────────────────────────────────

export interface ActiveRequest {
    id: string;
    title: string;
    category: string;
    location: string;
    status: string;
    requestedAmount: string;
    attachmentsCount: number;
    priority: string;
    currentStep: number;
    totalSteps: number;
    nextAction: string;
    nextActionDescription?: string;
    lastModified: string;
    createdDaysAgo: number;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "صحة": Stethoscope,
    "سكن": Home,
    "غذاء": Heart,
    "تعليم": GraduationCap,
    "مالية": Coins,
    "فواتير": CreditCard,
    "أخرى": HelpCircle,
};

const STATUS_CONFIG_MAP = {
    "COMPLETED": { label: "مكتمل", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
    "PENDING": { label: "قيد المراجعة", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
    "IN_PROGRESS": { label: "جاري التنفيذ", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
    "REJECTED": { label: "مرفوض", color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20" },
    "CANCELLED": { label: "ملغي", color: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700" },
};

const getStepsForStatus = (status: string) => {
    const isCompleted = status === "COMPLETED";
    const isInProgress = status === "IN_PROGRESS";
    const isVerified = status === "VERIFIED";

    return [
        { label: "تقديم الطلب", done: true },
        { label: "مراجعة المستندات", done: isVerified || isInProgress || isCompleted },
        { label: "زيارة ميدانية", done: isInProgress || isCompleted },
        { label: "القرار النهائي", done: isCompleted },
    ];
};

// ─── Main Page ────────────────────────────────────────────────────────

export default function FamilyDashboardPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const [stats, setStats] = useState<FamilyStatistics | null>(null);
    const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [recentRequests, setRecentRequests] = useState<RequestHistoryItem[]>([]);

    useEffect(() => {
        if (!user) return;
        const role = user.role?.toLowerCase() || "";
        const isOrganization = role.includes('organization') || role.includes('association') || role.includes('charity') || role.includes('org') || role.includes('جمعية') || role.includes('مؤسسة');
        const isAdmin = role.includes('admin') || role.includes('أدمن');
        const isDonor = role.includes('donor') || role.includes('فاعل خير') || role.includes('متبرع');

        if (isAdmin) router.replace("/dashboard/admin");
        else if (isDonor) router.replace("/dashboard/donor");
        else if (isOrganization) router.replace("/dashboard/organization");
    }, [user, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsData = await getFamilyStatistics();
                setStats(statsData);

                const requestsData = await getRequests({ pageNumber: 1, pageSize: 10 });
                const allRequests = requestsData.items || [];

                const activeReq = allRequests.find(r => !["COMPLETED", "REJECTED", "CANCELLED"].includes(resolveStatus(r.status)));
                if (activeReq) {
                    try {
                        const fullDetails = await getRequestById(activeReq.id);
                        const statusKey = resolveStatus(fullDetails.status);
                        const category = categoryConfig[resolveCategory(fullDetails.requestType)]?.label || "عام";

                        setActiveRequest({
                            id: `REQ-${fullDetails.id}`,
                            title: categoryConfig[resolveCategory(fullDetails.requestType)]?.label || "طلب مساعدة",
                            category: category,
                            location: fullDetails.location || "تم تحديده",
                            status: statusDisplayConfig[statusKey]?.label || "غير معروف",
                            requestedAmount: "قيد المراجعة",
                            attachmentsCount: fullDetails.attachmentCount,
                            priority: fullDetails.priority || "عادية",
                            currentStep: statusKey === "COMPLETED" ? 4 : statusKey === "IN_PROGRESS" ? 3 : statusKey === "VERIFIED" ? 2 : 1,
                            totalSteps: 4,
                            nextAction: statusKey === "PENDING" ? "مراجعة الطلب" : statusKey === "IN_PROGRESS" ? "دراسة الحالة" : "متابعة الطلب",
                            nextActionDescription: statusKey === "PENDING"
                                ? "طلبك حالياً قيد المراجعة. سيتم إشعارك قريباً."
                                : statusKey === "IN_PROGRESS"
                                ? "تم القبول المبدئي وجاري دراسة الحالة."
                                : "تابع التفاصيل من هنا.",
                            lastModified: new Date(fullDetails.createdAt).toLocaleDateString('ar-EG'),
                            createdDaysAgo: Math.floor((Date.now() - new Date(fullDetails.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                        });
                    } catch (err) {
                        logger.warn("Failed to fetch active request details");
                    }
                }

                const historyItems = allRequests.slice(0, 5).map(r => ({
                    id: `REQ-${r.id}`,
                    title: categoryConfig[resolveCategory(r.requestType)]?.label || "طلب",
                    description: r.description || "",
                    category: categoryConfig[resolveCategory(r.requestType)]?.label || "عام",
                    status: resolveStatus(r.status),
                    amount: "-",
                    date: new Date(r.createdAt || "").toLocaleDateString('ar-EG')
                }));
                setRecentRequests(historyItems);

            } catch (error) {
                logger.error("Failed to fetch dashboard data:", error);
                toast.error("حدث خطأ أثناء تحميل البيانات");
            } finally {
                setLoadingStats(false);
                setLoadingRequests(false);
            }
        };

        fetchDashboardData();
    }, []);

    const firstName = user?.name?.split(' ')[0] || "عائلتنا";

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background" dir="rtl">
                <DashboardTopBar userType="family" />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:max-w-[1400px] mx-auto w-full">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                        
                        {/* ─── 1. Compact Hero / Header ─── */}
                        <motion.div variants={itemVariants}>
                            <Card className="relative overflow-hidden bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none hidden md:block">
                                    <Star className="w-48 h-48 text-emerald-900 dark:text-emerald-100" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-black text-foreground tracking-tight">
                                                مرحباً بعودتك، <span className="text-emerald-600 dark:text-emerald-400">{firstName}</span> 👋
                                            </h1>
                                            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                تحديث فوري
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            لديك <strong className="text-foreground">{stats?.pendingRequests || 0} طلب</strong> قيد المراجعة. أكمل بياناتك لتعزيز فرص قبول طلباتك.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-5 font-bold shadow-sm flex-1 md:flex-none">
                                            <Link href="/dashboard/family/requests/new">
                                                <Plus className="w-4 h-4 ml-2" />
                                                طلب جديد
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="rounded-xl h-10 px-5 font-bold border-border bg-transparent hover:bg-muted text-foreground flex-1 md:flex-none">
                                            <Link href="/dashboard/family/profile">
                                                <FileText className="w-4 h-4 ml-2 text-muted-foreground" />
                                                الملف الشخصي
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* ─── 2. Premium KPI Cards ─── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {loadingStats ? (
                                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
                            ) : (
                                <>
                                    <MetricCard 
                                        title="إجمالي الطلبات" value={stats?.totalRequests || 0} 
                                        icon={FileText} trend={{ positive: true, value: 14 }} isPrimary={true}
                                        sparklineData={[2, 3, 5, 4, 6, 8, Number(stats?.totalRequests || 0) + 1]}
                                    />
                                    <MetricCard 
                                        title="قيد المراجعة" value={stats?.pendingRequests || 0} 
                                        icon={Clock} colorClass="text-amber-500 dark:text-amber-400"
                                        sparklineData={[0, 1, 0, 2, 1, 0, Number(stats?.pendingRequests || 0) + 1]} trend={{ positive: false, value: 5 }}
                                    />
                                    <MetricCard 
                                        title="مكتملة بنجاح" value={stats?.completedRequests || 0} 
                                        icon={ShieldCheck} trend={{ positive: true, value: 8 }} colorClass="text-blue-500 dark:text-blue-400"
                                        sparklineData={[1, 2, 2, 4, 3, 5, Number(stats?.completedRequests || 0) + 1]}
                                    />
                                    <MetricCard 
                                        title="الدعم المستلم (ج.م)" value={stats?.totalAidReceived || 0} 
                                        icon={Coins} trend={{ positive: true, value: 24 }} colorClass="text-violet-500 dark:text-violet-400"
                                        sparklineData={[0, 500, 200, 1000, 800, 1200, Number(stats?.totalAidReceived || 0) + 100]}
                                    />
                                </>
                            )}
                        </div>

                        {/* ─── 3. Main Layout Grid ─── */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Primary Column (Active Request & History) */}
                            <div className="xl:col-span-2 space-y-6">
                                
                                {/* Active Request Tracker */}
                                <motion.div variants={itemVariants}>
                                    {loadingRequests ? (
                                        <Skeleton className="h-64 w-full rounded-2xl" />
                                    ) : activeRequest ? (
                                        <Card className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm overflow-hidden relative">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{activeRequest.id}</span>
                                                        <span className={cn(
                                                            "text-xs font-bold px-2.5 py-1 rounded-md border",
                                                            STATUS_CONFIG_MAP[resolveStatus(activeRequest.status) as keyof typeof STATUS_CONFIG_MAP]?.color || "bg-muted text-muted-foreground"
                                                        )}>
                                                            {activeRequest.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-foreground">{activeRequest.title}</h3>
                                                </div>
                                                <Button asChild variant="ghost" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-sm font-bold h-9 px-4 shrink-0">
                                                    <Link href={`/dashboard/family/requests/${activeRequest.id.replace('REQ-', '')}`}>
                                                        التفاصيل الكاملة <ChevronLeft className="w-4 h-4 mr-1" />
                                                    </Link>
                                                </Button>
                                            </div>

                                            {/* Horizontal Progress Timeline */}
                                            <div className="relative py-8 mb-4 px-4 sm:px-8">
                                                <div className="absolute top-1/2 left-4 right-4 sm:left-8 sm:right-8 h-1 bg-muted -translate-y-1/2 rounded-full z-0"></div>
                                                <div className="absolute top-1/2 right-4 sm:right-8 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out" style={{ width: `calc(${(activeRequest.currentStep / activeRequest.totalSteps) * 100}% - 2rem)` }}></div>
                                                
                                                <div className="relative z-10 flex justify-between">
                                                    {getStepsForStatus(resolveStatus(activeRequest.status)).map((step, idx) => {
                                                        const isCompleted = step.done;
                                                        const isCurrent = idx + 1 === activeRequest.currentStep;
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center gap-2 relative">
                                                                <div className={cn(
                                                                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-[3px] border-card shadow-sm transition-colors duration-300",
                                                                    isCompleted ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-muted text-muted-foreground"
                                                                )}>
                                                                    {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current", isCurrent && "animate-ping")} />}
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[10px] sm:text-xs font-bold absolute -bottom-7 w-20 sm:w-24 text-center",
                                                                    isCompleted ? "text-foreground" : isCurrent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                                                                )}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border flex items-start gap-4">
                                                <div className="p-2 bg-card rounded-lg shadow-sm border border-border shrink-0">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-foreground mb-1">الخطوة القادمة: {activeRequest.nextAction}</h4>
                                                    <p className="text-sm text-muted-foreground">{activeRequest.nextActionDescription}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ) : (
                                        <Card className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-border bg-card/50 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all">
                                            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                                                <Shield className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2">لا توجد طلبات قيد التنفيذ حالياً</h3>
                                            <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6">
                                                <Link href="/dashboard/family/requests/new">تقديم طلب مساعدة</Link>
                                            </Button>
                                        </Card>
                                    )}
                                </motion.div>

                                {/* Request History */}
                                <motion.div variants={itemVariants}>
                                    <Card className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-border flex items-center justify-between">
                                            <h2 className="text-lg font-bold text-foreground">سجل الطلبات السابقة</h2>
                                        </div>
                                        <RequestHistoryTable
                                            requests={recentRequests}
                                            searchTerm=""
                                            onSearchChange={() => { }}
                                            categoryIcons={CATEGORY_ICONS}
                                            statusConfig={STATUS_CONFIG_MAP}
                                        />
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Secondary Column (Widgets) */}
                            <div className="space-y-6">
                                
                                {/* Profile Quality */}
                                <motion.div variants={itemVariants}>
                                    <Card className="p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">
                                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-foreground">جودة الملف الشخصي</h3>
                                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">75%</span>
                                            </div>
                                            <div className="w-full bg-muted h-2 rounded-full mb-6 overflow-hidden">
                                                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                                            </div>
                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                                                    <span className="text-sm font-bold text-foreground">البيانات الأساسية</span>
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100/50 dark:border-rose-500/20">
                                                    <span className="text-sm font-bold text-rose-800 dark:text-rose-300">إثبات الدخل</span>
                                                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 px-2 py-0.5 rounded">مطلوب فوراً</span>
                                                </div>
                                            </div>
                                            <Button asChild className="w-full text-foreground bg-muted hover:bg-muted/80 border border-border rounded-xl font-bold">
                                                <Link href="/dashboard/family/profile">تحديث البيانات</Link>
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Quick Actions Grid */}
                                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                                    <Link href="/dashboard/family/requests/new" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border rounded-2xl hover:shadow-md hover:border-emerald-500/30 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                                            <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">طلب جديد</span>
                                    </Link>
                                    <Link href="/dashboard/family/chat" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border rounded-2xl hover:shadow-md hover:border-blue-500/30 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                                            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">المساعد الذكي</span>
                                    </Link>
                                </motion.div>

                            </div>
                        </div>

                    </motion.div>
                </main>
            </div>
        </DashboardLayout>
    );
}
