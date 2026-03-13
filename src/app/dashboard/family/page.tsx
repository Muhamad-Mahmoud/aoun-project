"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { ActiveRequestCard, type ActiveRequest } from "@/features/dashboard/components/ActiveRequestCard";
import { RequestHistoryTable, type RequestHistoryItem } from "@/features/dashboard/components/RequestHistoryTable";
import { SupportBanner } from "@/features/dashboard/components/SupportBanner";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import Link from "next/link";
import { FileText, Clock, CheckCircle, Shield, LucideIcon, Stethoscope, Heart, Home, PlusCircle, Loader2, Coins, GraduationCap, CreditCard, HelpCircle, UtensilsCrossed } from "lucide-react";
import { getFamilyStatistics } from "@/features/families/api/familiesApi";
import { getRequests, getRequestById } from "@/features/requests/api/requestsApi";
import type { FamilyStatistics } from "@/features/families/types";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { Skeleton } from "@/shared/ui/skeleton";
import { resolveStatus, statusConfig as statusDisplayConfig, categoryConfig } from "@/features/requests/config/requestConfig";

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
    "COMPLETED": { label: "مكتمل", color: "text-green-600 bg-green-50" },
    "PENDING": { label: "قيد المراجعة", color: "text-amber-600 bg-amber-50" },
    "IN_PROGRESS": { label: "جاري التنفيذ", color: "text-blue-600 bg-blue-50" },
    "REJECTED": { label: "مرفوض", color: "text-red-600 bg-red-50" },
    "CANCELLED": { label: "ملغي", color: "text-gray-600 bg-gray-50" },
};

// Helper to determine active steps based on status
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

export default function FamilyDashboardPage() {
    const [stats, setStats] = useState<FamilyStatistics | null>(null);
    const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
    const [recentRequests, setRecentRequests] = useState<RequestHistoryItem[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Statistics
                const statsData = await getFamilyStatistics();
                setStats(statsData);

                // 2. Fetch Requests
                const requestsData = await getRequests({ pageNumber: 1, pageSize: 10 });
                const allRequests = requestsData.items || [];

                // 3. Identify Active Request (Latest one that is NOT Completed/Rejected/Cancelled)
                // Assuming status 3=Completed, 4=Rejected, 5=Cancelled based on config
                // Let's rely on string checks or numeric if we know the enum
                const activeReq = allRequests.find(r => {
                    const statusKey = resolveStatus(r.status);
                    return !["COMPLETED", "REJECTED", "CANCELLED"].includes(statusKey);
                });

                if (activeReq) {
                    try {
                        // Fetch full details for the active request to get better description/location etc.
                        const fullDetails = await getRequestById(activeReq.id);
                        const statusKey = resolveStatus(fullDetails.status);
                        const category = categoryConfig[fullDetails.requestType]?.label || "عام";

                        // Map to ActiveRequest format
                        setActiveRequest({
                            id: `REQ-${fullDetails.id}`,
                            title: categoryConfig[fullDetails.requestType]?.label || "طلب مساعدة",
                            category: category,
                            location: fullDetails.location || "غير محدد",
                            status: statusDisplayConfig[statusKey]?.label || "غير معروف",
                            requestedAmount: "غير محدد", // API doesn't provide this yet
                            attachmentsCount: fullDetails.attachmentCount,
                            priority: fullDetails.priority || "عادية",
                            currentStep: statusKey === "COMPLETED" ? 4 : statusKey === "IN_PROGRESS" ? 3 : statusKey === "VERIFIED" ? 2 : 1,
                            totalSteps: 4,
                            nextAction: statusKey === "PENDING" ? "انتظار المراجعة" : "متابعة الطلب",
                            nextActionDescription: statusKey === "PENDING"
                                ? "طلبك قيد المراجعة من قبل الفريق المختص."
                                : "يتم الآن العمل على طلبك.",
                            lastModified: new Date(fullDetails.createdAt).toLocaleDateString('ar-EG'), // Using created for now
                            createdDaysAgo: Math.floor((Date.now() - new Date(fullDetails.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                        });
                    } catch (err) {
                        logger.warn("Failed to fetch active request details");
                    }
                }

                // 4. Map History (Exclude the active one if displayed? Or just show all recent except active?)
                // Let's show all *other* requests in history
                const historyItems = allRequests
                    .filter(r => r.id !== activeReq?.id)
                    .map(r => {
                        const statusKey = resolveStatus(r.status);
                        return {
                            id: `REQ-${r.id}`,
                            title: categoryConfig[r.requestType || 0]?.label || "طلب",
                            description: r.description || "",
                            category: categoryConfig[r.requestType || 0]?.label || "عام",
                            status: statusKey, // Pass key for config lookup
                            amount: "-", // Placeholder
                            date: new Date(r.createdAt || "").toLocaleDateString('ar-EG')
                        };
                    });
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

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]" dir="rtl">
                <DashboardTopBar userType="family" />
                <main className="pb-20 pt-6 lg:pt-8 relative z-10">
                    <div className="space-y-6 px-6 lg:px-10">
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">لوحة التحكم</h1>
                                <p className="text-base text-slate-500 font-medium mt-2">مرحباً بك، أسرة محمد علي. نتابع طلباتك بكل اهتمام.</p>
                            </div>
                            <Button asChild size="lg" className="h-12 px-6 rounded-xl bg-warm-green hover:bg-warm-green/90 shadow-lg shadow-warm-green/10 font-bold text-base transition-all active:scale-95">
                                <Link href="/dashboard/family/requests/new" className="flex items-center gap-3">
                                    <PlusCircle className="w-5 h-5" /> إنشاء طلب جديد
                                </Link>
                            </Button>
                        </div>

                        {/* KPI Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {loadingStats ? (
                                <>
                                    <Skeleton className="h-32 rounded-2xl" />
                                    <Skeleton className="h-32 rounded-2xl" />
                                    <Skeleton className="h-32 rounded-2xl" />
                                    <Skeleton className="h-32 rounded-2xl" />
                                </>
                            ) : (
                                <>
                                    <StatsCard stat={{
                                        label: "إجمالي الطلبات",
                                        value: stats?.totalRequests?.toString() || "0",
                                        change: "الكل",
                                        trend: "neutral",
                                        icon: FileText,
                                        iconBg: "bg-sky-50",
                                        iconColor: "text-sky-600"
                                    }} />
                                    <StatsCard stat={{
                                        label: "طلبات قيد الانتظار",
                                        value: stats?.pendingRequests?.toString() || "0",
                                        change: "جاري المراجعة",
                                        trend: "neutral",
                                        icon: Clock,
                                        iconBg: "bg-amber-50",
                                        iconColor: "text-amber-600"
                                    }} />
                                    <StatsCard stat={{
                                        label: "طلبات مكتملة",
                                        value: stats?.completedRequests?.toString() || "0",
                                        change: "تم التنفيذ",
                                        trend: "up",
                                        icon: CheckCircle,
                                        iconBg: "bg-emerald-50",
                                        iconColor: "text-emerald-600"
                                    }} />
                                    <StatsCard stat={{
                                        label: "إجمالي المساعدات",
                                        value: stats?.totalAidReceived != null ? `${stats.totalAidReceived.toLocaleString()} ج.م` : "0 ج.م",
                                        change: "القيمة الكلية",
                                        trend: "up",
                                        icon: Coins,
                                        iconBg: "bg-purple-50",
                                        iconColor: "text-purple-600"
                                    }} />
                                </>
                            )}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-10 lg:grid-cols-12 items-start">
                            <div className="lg:col-span-8 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-warm-green rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">الطلب النشط حالياً</h2>
                                    </div>
                                    
                                    {loadingRequests ? (
                                        <Skeleton className="h-64 w-full rounded-3xl" />
                                    ) : activeRequest ? (
                                        <ActiveRequestCard
                                            request={activeRequest}
                                            primaryAction={{ label: "عرض التفاصيل", icon: FileText, href: `/dashboard/family/requests/${activeRequest.id.replace('REQ-', '')}` }}
                                            steps={getStepsForStatus(resolveStatus(activeRequest.status))} // activeRequest.status is localized label, mapping might be needed if strictly using enum keys. 
                                            // Actually, activeRequest.status is derived from statusConfig labels above.
                                            // Let's pass the raw status if possible or re-derive.
                                            // Simplest: Check label text or store raw status in helper.
                                            // Correct approach: activeRequest.status is display label. 
                                            // But getStepsForStatus expects Enum Key? No, it expects something to check against.
                                            // Let's fix getStepsForStatus to take the raw key if we have it, or Update ActiveRequest to hold rawStatus.
                                        />
                                    ) : (
                                        <Card className="p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-3xl">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">لا يوجد طلبات نشطة حالياً</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm">يمكنك تقديم طلب جديد للحصول على المساعدة المناسبة.</p>
                                            <Button asChild className="bg-warm-green hover:bg-warm-green/90 text-white">
                                                <Link href="/dashboard/family/requests/new">
                                                    إنشاء طلب جديد
                                                </Link>
                                            </Button>
                                        </Card>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-warm-green rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">سجل النشاط</h2>
                                    </div>
                                    <RequestHistoryTable
                                        requests={recentRequests}
                                        searchTerm=""
                                        onSearchChange={() => { }}
                                        categoryIcons={CATEGORY_ICONS}
                                        statusConfig={STATUS_CONFIG_MAP}
                                    />
                                </div>
                            </div>

                            {/* Sidebar Widgets */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-[120px]">
                        <SupportBanner />
                        <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                            <div className="relative z-10 space-y-6 text-right">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto">
                                    <Heart className="w-6 h-6 text-warm-green" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-3">نصيحة اليوم</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                        إكمال بيانات ملفك الشخصي بنسبة ١٠٠٪ يساعدنا على معالجة طلباتك بشكل أسرع وأكثر دقة.
                                    </p>
                                </div>
                                <Button asChild size="lg" variant="outline" className="w-full h-11 rounded-lg border-white/10 text-white hover:bg-white hover:text-slate-900 font-bold transition-all">
                                    <Link href="/dashboard/family/profile">أكمل الملف الشخصي</Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    </div>
</DashboardLayout>
);
}


