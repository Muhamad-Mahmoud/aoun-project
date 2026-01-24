"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { TasksCard } from "@/features/dashboard/components/TasksCard";
import React from "react";

export default function OrganizationPendingPage() {
    const mockTasks = [
        { text: "مراجعة مستندات أسرة أحمد علي", done: false, href: "#", urgent: true, deadline: "٢ ساعة" },
        { text: "تأكيد موعد الزيارة لمحافظة المنوفية", done: false, href: "#", urgent: false },
        { text: "تحديث تقييم حالة أسرة حسن", done: false, href: "#", urgent: true, deadline: "اليوم" }
    ];

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="organization" />
                <main className="p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">طلبات قيد المراجعة</h1>
                            <p className="text-muted-foreground">راجع الطلبات الجديدة الواردة للجمعية.</p>
                        </div>

                        <TasksCard tasks={mockTasks} title="مهام المراجعة" />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
