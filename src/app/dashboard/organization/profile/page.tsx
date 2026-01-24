"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Building2, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function OrganizationProfilePage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="organization" />
                <main className="p-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">ملف الجمعية</h1>
                            <p className="text-muted-foreground">بيانات الجمعية الرسمية ومعلومات التواصل.</p>
                        </div>

                        <Card className="p-8 text-end">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary text-3xl font-bold mb-4">
                                    جخ
                                </div>
                                <h2 className="text-xl font-bold">جمعية الخير والأمل</h2>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold mt-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    جهة معتمدة
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <ProfileItem icon={Building2} label="رقم الإشهار" value="١٢٣٤٥ / ٢٠٢٤" />
                                <ProfileItem icon={Phone} label="رقم التواصل" value="٠١١١٢٢٢٣٣٣٤" />
                                <ProfileItem icon={MapPin} label="المقر الرئيسي" value="المنوفية، شبين الكوم" />
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
