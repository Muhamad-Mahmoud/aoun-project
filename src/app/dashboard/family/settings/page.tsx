"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Settings, Lock, Bell, Eye } from "lucide-react";

export default function FamilySettingsPage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="family" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
                            <p className="text-muted-foreground">تخصيص تجربة استخدامك للمنصة.</p>
                        </div>

                        <div className="grid gap-6">
                            <SettingsCard icon={Lock} title="تغيير كلمة المرور" description="قم بتحديث كلمة المرور الخاصة بك لتأمين حسابك." />
                            <SettingsCard icon={Bell} title="الإشعارات" description="تحكم في كيفية تلقي الإشعارات من المنصة." />
                            <SettingsCard icon={Eye} title="الخصوصية" description="إدارة بياناتك وما يمكن للآخرين رؤيته." />
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function SettingsCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <Card className="p-6 text-end flex flex-row-reverse items-center gap-6 hover:shadow-md transition-shadow cursor-pointer">
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
