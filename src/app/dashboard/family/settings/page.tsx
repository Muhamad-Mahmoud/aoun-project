"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { ChangePasswordForm } from "@/features/settings/components/ChangePasswordForm";

export default function FamilySettingsPage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#fcfdfe]">
                <DashboardTopBar userType="family" />
                <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">الإعدادات</h1>
                            <p className="text-lg text-slate-500 font-bold">إدارة إعدادات حسابك وتفضيلاتك</p>
                        </div>

                        <ChangePasswordForm />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
