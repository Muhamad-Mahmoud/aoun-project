"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Settings, Lock, Bell, Users } from "lucide-react";

export default function OrganizationSettingsPage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="organization" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">إعدادات الجمعية</h1>
                            <p className="text-muted-foreground">إدارة صلاحيات الفريق وبوابات الدفع والإشعارات.</p>
                        </div>

                        <div className="grid gap-6">
                            <SettingsCard icon={Users} title="إدارة الفريق" description="إضافة متطوعين جدد وتعديل صلاحيات الوصول." />
                            <SettingsCard icon={Lock} title="الأمان والخصوصية" description="تحديث كلمات المرور وإدارة مفاتيح الـ API." />
                            <SettingsCard icon={Bell} title="تفضيلات الإشعارات" description="ضبط إعدادات التنبيهات للطلبات الجديدة والمستعجلة." />
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function SettingsCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <Card className="p-6 text-end flex flex-row-reverse items-center gap-6 hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-secondary/20">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </Card>
    );
}
