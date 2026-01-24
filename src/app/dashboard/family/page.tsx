"use client";

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
import { FileText, Clock, CheckCircle, Shield, LucideIcon, Stethoscope, Heart, Home, PlusCircle } from "lucide-react";


const MOCK_REQUEST: ActiveRequest = {
    id: "REQ-2024-001",
    title: "مساعدة في علاج طبي",
    category: "صحة",
    location: "القاهرة، مصر",
    status: "قيد المراجعة",
    requestedAmount: "١٥,٠٠٠ ج.م",
    attachmentsCount: 4,
    priority: "عالية", // Still in type but hidden in UI
    currentStep: 2,
    totalSteps: 4,
    nextAction: "انتظار مراجعة المستندات",
    nextActionDescription: "جاري مراجعة التقارير الطبية المقدمة من قبل الفريق المختص.",
    lastModified: "منذ ساعتين",
    createdDaysAgo: 3
};

const MOCK_HISTORY: RequestHistoryItem[] = [
    {
        id: "REQ-2023-098",
        title: "دعم إيجار سكني",
        description: "طلب مساعدة لدفع متأخرات الإيجار لمدة ٣ أشهر",
        category: "سكن",
        status: "مكتمل",
        amount: "٥,٠٠٠ ج.م",
        date: "١٥ ديسمبر ٢٠٢٣"
    },
    {
        id: "REQ-2023-085",
        title: "شنطة مواد غذائية",
        description: "دعم تمويني شهري للأسرة",
        category: "غذاء",
        status: "مكتمل",
        amount: "١,٢٠٠ ج.م",
        date: "١٠ نوفمبر ٢٠٢٣"
    }
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "صحة": Stethoscope,
    "سكن": Home,
    "غذاء": Heart,
};

const STATUS_CONFIG = {
    "مكتمل": { label: "مكتمل", color: "text-green-600 bg-green-50" },
    "قيد المراجعة": { label: "قيد المراجعة", color: "text-amber-600 bg-amber-50" },
};

export default function FamilyDashboardPage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#fcfdfe]">
                <DashboardTopBar userType="family" />
                <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                    لوحة <span className="text-primary">التحكم</span>
                                </h1>
                                <p className="text-xl text-slate-400 font-bold">مرحباً بك مجدداً، أسرة محمد علي 👋</p>
                            </div>
                            <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary-light shadow-xl shadow-primary/20 font-black text-lg transition-all active:scale-95">
                                <Link href="/dashboard/family/requests/new" className="flex items-center gap-3">
                                    <PlusCircle className="w-6 h-6" /> إنشاء طلب جديد
                                </Link>
                            </Button>
                        </div>

                        {/* KPI Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCard stat={{ label: "إجمالي الطلبات", value: "٤", change: "طلب واحد هذا الشهر", trend: "up", icon: FileText, iconBg: "bg-sky-blue/10", iconColor: "text-sky-blue" }} />
                            <StatsCard stat={{ label: "طلبات نشطة", value: "١", change: "جاري المراجعة", trend: "neutral", icon: Clock, iconBg: "bg-golden-orange/10", iconColor: "text-golden-orange" }} />
                            <StatsCard stat={{ label: "طلبات مكتملة", value: "٣", change: "تم تقديم المساعدة", trend: "neutral", icon: CheckCircle, iconBg: "bg-warm-green/10", iconColor: "text-warm-green" }} />
                            <StatsCard stat={{ label: "التنبيهات", value: "٢", change: "رسائل جديدة", trend: "up", icon: Shield, iconBg: "bg-royal-purple/10", iconColor: "text-royal-purple" }} />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-start">
                            <div className="lg:col-span-8 space-y-8 sm:space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(hsl(var(--primary)),0.4)]" />
                                        <h2 className="text-2xl font-black text-slate-900">الطلب النشط حالياً</h2>
                                    </div>
                                    <ActiveRequestCard
                                        request={MOCK_REQUEST}
                                        primaryAction={{ label: "تعديل الطلب", icon: FileText, href: "/dashboard/family/requests/edit" }}
                                        steps={[
                                            { label: "تقديم الطلب", done: true },
                                            { label: "مراجعة المستندات", done: false },
                                            { label: "زيارة ميدانية", done: false },
                                            { label: "القرار النهائي", done: false },
                                        ]}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-warm-green rounded-full shadow-[0_0_12px_rgba(hsl(var(--warm-green)),0.4)]" />
                                        <h2 className="text-2xl font-black text-slate-900">سجل النشاط</h2>
                                    </div>
                                    <RequestHistoryTable
                                        requests={MOCK_HISTORY}
                                        searchTerm=""
                                        onSearchChange={() => { }}
                                        categoryIcons={CATEGORY_ICONS}
                                        statusConfig={STATUS_CONFIG}
                                    />
                                </div>
                            </div>

                            {/* Sidebar Widgets */}
                            <div className="lg:col-span-4 space-y-10 sticky top-[120px]">
                                <SupportBanner />
                                <Card className="p-10 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group">
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                            <Heart className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-3">نصيحة اليوم</h3>
                                            <p className="text-slate-400 font-bold leading-relaxed text-sm">
                                                إكمال بيانات ملفك الشخصي بنسبة ١٠٠٪ يساعدنا على معالجة طلباتك بشكل أسرع وأكثر دقة.
                                            </p>
                                        </div>
                                        <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white hover:text-slate-900 font-black transition-all">
                                            أكمل الملف الشخصي
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

