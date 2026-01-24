"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function FamilyProfilePage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="family" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
                            <p className="text-muted-foreground">عرض وتعديل بيانات الأسرة.</p>
                        </div>

                        <Card className="p-8 text-end">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                                    أم
                                </div>
                                <h2 className="text-xl font-bold">أسرة محمد أحمد علي</h2>
                                <p className="text-muted-foreground">كود الأسرة: FAM-12345</p>
                            </div>

                            <div className="grid gap-6">
                                <ProfileItem icon={User} label="اسم رب الأسرة" value="محمد أحمد علي" />
                                <ProfileItem icon={Phone} label="رقم الهاتف" value="٠١٢٣٤٥٦٧٨٩٠" />
                                <ProfileItem icon={MapPin} label="العنوان" value="القاهرة، مدينة نصر، الحي السابع" />
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
