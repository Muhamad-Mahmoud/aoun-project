"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TasksCard, type Task } from "@/features/dashboard/components/TasksCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Plus, Search, Award, Users, CheckCircle2, AlertCircle } from "lucide-react";

import { type TimelineItem } from "@/shared/components/common/Timeline";

const MOCK_TASKS: Task[] = [
    { text: "مراجعة مستندات جمعية الأمل", done: false, href: "/dashboard/organization/tasks/1", urgent: true, deadline: "اليوم" },
    { text: "تحديث بيانات التواصل", done: true, href: null, urgent: false },
    { text: "تحديد موعد زيارة ميدانية لأسرة سالم", done: false, href: "/dashboard/organization/tasks/2", urgent: false }
];

const MOCK_ACTIVITIES: TimelineItem[] = [
    {
        text: "تم قبول طلب مساعدة: تم الموافقة على طلب أسرة أحمد علي",
        time: "منذ ١٠ دقائق",
        type: "success"
    },
    {
        text: "تنبيه: مراجعة عاجلة - يوجد ٣ طلبات تحتاج مراجعة فورية",
        time: "منذ ساعة",
        type: "info"
    }
];


export default function OrganizationDashboardPage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc]">
                <DashboardTopBar userType="organization" />
                <main className="pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="space-y-10 px-6 lg:px-10">
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">لوحة تحكم الجمعية</h1>
                            <p className="text-base text-slate-500 font-medium mt-2">إدارة الطلبات والحالات بفاعلية ودقة.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCard stat={{ label: "طلبات جديدة", value: "١٢", change: "تحتاج مراجعة فورية", trend: "up", icon: Plus, iconBg: "bg-sky-blue/10", iconColor: "text-sky-blue" }} />
                            <StatsCard stat={{ label: "قيد الدراسة", value: "٨", change: "جاري البحث الميداني", trend: "neutral", icon: Search, iconBg: "bg-golden-orange/10", iconColor: "text-golden-orange" }} />
                            <StatsCard stat={{ label: "مساعدات مكتملة", value: "٤٢", change: "إجمالي الحالات المساعدة", trend: "up", icon: Award, iconBg: "bg-warm-green/10", iconColor: "text-warm-green" }} />
                            <StatsCard stat={{ label: "المتطوعين", value: "١٥", change: "نشطون حالياً", trend: "neutral", icon: Users, iconBg: "bg-royal-purple/10", iconColor: "text-royal-purple" }} />
                        </div>

                        <div className="grid gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                                    <h2 className="text-xl font-bold text-slate-900">المهام العاجلة</h2>
                                </div>
                                <TasksCard tasks={MOCK_TASKS} />
                            </div>
                            <div className="lg:col-span-4 space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-6 bg-golden-orange rounded-full" />
                                    <h2 className="text-xl font-bold text-slate-900">آخر النشاطات</h2>
                                </div>
                                <RecentActivityCard activities={MOCK_ACTIVITIES} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
