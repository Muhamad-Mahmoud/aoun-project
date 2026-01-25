"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Users } from "lucide-react";

export default function OrganizationTeamPage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="organization" />
                <main className="py-8">
                    <div className="space-y-8 px-6 lg:px-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">فريق العمل</h1>
                            <p className="text-muted-foreground">إدارة أعضاء فريق الجمعية والمتطوعين.</p>
                        </div>

                        <Card className="p-12 text-center">
                            <Users className="w-12 h-12 text-secondary mx-auto mb-4 opacity-30" />
                            <p className="text-muted-foreground italic">سيتم عرض قائمة أعضاء الفريق هنا.</p>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
