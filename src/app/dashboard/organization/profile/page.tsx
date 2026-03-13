"use client";

import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { Card } from "@/shared/ui/card";
import { Building2, Mail, Phone, MapPin, ShieldCheck, Loader2, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useAssociationProfile } from "@/features/associations";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function OrganizationProfilePage() {
    const { profile, isLoading, error } = useAssociationProfile();

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
                                    {profile.name?.substring(0, 2) || "جم"}
                                </div>
                                <h2 className="text-xl font-bold">{profile.name}</h2>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mt-2 ${profile.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {profile.isActive ? (
                                        <>
                                            <ShieldCheck className="w-3 h-3" />
                                            حساب نشط
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-3 h-3" />
                                            حساب غير نشط
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <ProfileItem icon={Mail} label="البريد الإلكتروني" value={profile.email} />
                                {profile.phones && profile.phones.map((p, idx) => (
                                    <ProfileItem key={idx} icon={Phone} label={`رقم التواصل ${p.type ? `(${p.type})` : ''}`} value={p.number} />
                                ))}
                                {profile.locations && profile.locations.map((loc, idx) => (
                                    <ProfileItem key={idx} icon={MapPin} label={`${loc.governorate} - ${loc.city}`} value={loc.address} />
                                ))}
                                <ProfileItem icon={Calendar} label="تاريخ التسجيل" value={profile.createdAt ? format(new Date(profile.createdAt), 'dd MMMM yyyy', { locale: ar }) : "غير متوفر"} />
                                
                                {profile.capacity !== null && (
                                    <ProfileItem icon={CheckCircle2} label="الطاقة الاستيعابية للأسر" value={String(profile.capacity)} />
                                )}
                                {profile.coverageNotes && (
                                    <ProfileItem icon={FileText} label="ملاحظات التغطية الجغرافية" value={profile.coverageNotes} />
                                )}
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string }) {
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
