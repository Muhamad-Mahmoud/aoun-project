"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Users } from "lucide-react";
import { EmptyState } from "@/shared/components/common/EmptyState";

export default function OrganizationTeamPage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50" dir="rtl">
                <DashboardTopBar userType="organization" />
                <main className="py-8">
                    <div className="space-y-8 px-6 lg:px-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">فريق العمل</h1>
                            <p className="text-muted-foreground">إدارة أعضاء فريق الجمعية والمتطوعين.</p>
                        </div>

                        <EmptyState
                            icon={Users}
                            title="سيتم إطلاق ميزة الفريق قريباً"
                            description="قم بإدارة أعضاء الفريق والمتطوعين وتوزيع المهام والصلاحيات في التحديث القادم."
                        />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

