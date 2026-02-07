"use client";

import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { Card } from "@/shared/ui/card";
import { User, Mail, Phone, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";

export default function FamilyProfilePage() {
    const { profile, isLoading, error } = useProfile();

    if (isLoading) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !profile) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex items-center justify-center text-destructive font-bold">
                    {error || "لم يتم العثور على بيانات الملف الشخصي"}
                </div>
            </DashboardLayout>
        );
    }

    const userData = profile as any;

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="family" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8 text-right">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
                            <p className="text-muted-foreground">بيانات الأسرة ومعلومات التواصل.</p>
                        </div>

                        <Card className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                                    {userData.name?.substring(0, 2) || "أس"}
                                </div>
                                <h2 className="text-xl font-bold">{userData.name || "اسم الأسرة"}</h2>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold mt-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    حساب موثق
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <ProfileItem icon={User} label="اسم رب الأسرة" value={userData.name || "غير متوفر"} />
                                <ProfileItem icon={Phone} label="رقم الهاتف" value={userData.phone || "غير متوفر"} />
                                <ProfileItem icon={Mail} label="البريد الإلكتروني" value={userData.email || "غير متوفر"} />
                                <ProfileItem icon={MapPin} label="المحافظة" value={userData.governorate || "غير متوفر"} />
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
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
            <span className="font-bold">{value}</span>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="p-2 rounded-lg bg-background border border-border">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
            </div>
        </div>
    );
}


