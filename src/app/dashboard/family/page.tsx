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
    priority: "عالية",
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
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]">
                <DashboardTopBar userType="family" />
                <main className="pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="space-y-10 px-6 lg:px-10">
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">لوحة التحكم</h1>
                                <p className="text-base text-slate-500 font-medium mt-2">مرحباً بك، أسرة محمد علي. نتابع طلباتك بكل اهتمام.</p>
                            </div>
                            <Button asChild size="lg" className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 font-bold text-base transition-all active:scale-95">
                                <Link href="/dashboard/family/requests/new" className="flex items-center gap-3">
                                    <PlusCircle className="w-5 h-5" /> إنشاء طلب جديد
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
                        <div className="grid gap-10 lg:grid-cols-12 items-start">
                            <div className="lg:col-span-8 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">الطلب النشط حالياً</h2>
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

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-warm-green rounded-full" />
                                        <h2 className="text-xl font-bold text-slate-900">سجل النشاط</h2>
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
                            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-[120px]">
                                <SupportBanner />
                                <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                                    <div className="relative z-10 space-y-6 text-right">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto">
                                            <Heart className="w-6 h-6 text-primary" />
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


