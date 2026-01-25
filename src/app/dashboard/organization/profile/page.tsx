"use client";

import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { Card } from "@/shared/ui/card";
import { Building2, Mail, Phone, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";

export default function OrganizationProfilePage() {
    // In a real app, we'd get this ID from the auth context or URL params
    const { profile, isLoading, error } = useProfile("ORG-12345");

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !profile) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex items-center justify-center text-destructive font-bold">
                    {error || "لم يتم العثور على بيانات الملف الشخصي"}
                </div>
            </DashboardLayout>
        );
    }

    const orgData = profile as any;

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="organization" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8 text-right">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">ملف الجمعية</h1>
                            <p className="text-muted-foreground">بيانات الجمعية الرسمية ومعلومات التواصل.</p>
                        </div>

                        <Card className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary text-3xl font-bold mb-4">
                                    {orgData.name?.substring(0, 2) || "جم"}
                                </div>
                                <h2 className="text-xl font-bold">{orgData.name || "اسم الجمعية"}</h2>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold mt-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    جهة معتمدة
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <ProfileItem icon={Building2} label="رقم الإشهار" value={orgData.registrationNumber || "غير متوفر"} />
                                <ProfileItem icon={Phone} label="رقم التواصل" value={orgData.phone} />
                                <ProfileItem icon={Mail} label="البريد الإلكتروني" value={orgData.email} />
                                <ProfileItem icon={MapPin} label="المقر الرئيسي" value={orgData.address} />
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-all">
            <span className="font-bold">{value}</span>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="p-2 rounded-lg bg-background border border-border">
                    <Icon className="w-4 h-4 text-secondary" />
                </div>
            </div>
        </div>
    );
}
