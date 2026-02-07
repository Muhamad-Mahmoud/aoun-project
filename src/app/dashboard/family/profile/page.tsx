"use client";

import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { Card } from "@/shared/ui/card";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useAuthContext } from "@/shared/providers/AuthProvider";
import { Loader2, User, Mail, Phone, MapPin } from "lucide-react";

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

    const userData = profile as any; // Cast for now based on inferred structure

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="family" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8 text-right">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
                            <p className="text-muted-foreground">عرض وتعديل بيانات الأسرة.</p>
                        </div>

                        <Card className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                                    {userData.name?.substring(0, 2) || "أس"}
                                </div>
                                <h2 className="text-xl font-bold">{userData.name || "اسم غير متوفر"}</h2>
                                <p className="text-muted-foreground">كود الأسرة: {userData.id || "FAM-000"}</p>
                            </div>

                            <div className="grid gap-6">
                                <ProfileItem icon={User} label="اسم رب الأسرة" value={userData.name} />
                                <ProfileItem icon={Phone} label="رقم الهاتف" value={userData.phone} />
                                <ProfileItem icon={Mail} label="البريد الإلكتروني" value={userData.email} />
                                <ProfileItem icon={MapPin} label="المحافظة" value={userData.governorate} />
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
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
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
