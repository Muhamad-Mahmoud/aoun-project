"use client";

import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { Card } from "@/shared/ui/card";
import { Mail, Phone, MapPin, ShieldCheck, Loader2, Calendar, FileText, CheckCircle2, AlertCircle, CreditCard, Building2 } from "lucide-react";
import { useAssociationProfile, EditProfileDialog } from "@/features/associations";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function OrganizationProfilePage() {
    const { profile, isLoading, error } = useAssociationProfile();

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
                <DashboardTopBar userType="organization" />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8" dir="rtl">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Header Profile Card */}
                        <Card className="p-6 md:p-8 border-none shadow-sm rounded-2xl bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-0"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center text-primary text-3xl font-black shadow-inner flex-shrink-0">
                                        {profile.name?.substring(0, 2) || "جم"}
                                    </div>
                                    <div className="text-center md:text-right">
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{profile.name}</h1>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${profile.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                                            {profile.isActive ? (
                                                <>
                                                    <ShieldCheck className="w-4 h-4" />
                                                    حساب معتمد ونشط
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    حساب غير نشط
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    <EditProfileDialog profile={profile} />
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Main Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="p-6 md:p-8 border-none shadow-sm rounded-2xl bg-white">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">بيانات التواصل الأساسية</h3>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <ProfileItem icon={Mail} label="البريد الإلكتروني" value={profile.email} />
                                        {profile.phones && profile.phones.map((p, idx) => (
                                            <ProfileItem key={idx} icon={Phone} label={`رقم التواصل ${p.type ? `(${p.type})` : ''}`} value={p.number} />
                                        ))}
                                        {profile.locations && profile.locations.map((loc, idx) => (
                                            <div key={idx} className="sm:col-span-2">
                                                <ProfileItem icon={MapPin} label={`${loc.governorate} - ${loc.city}`} value={loc.address} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 md:p-8 border-none shadow-sm rounded-2xl bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">وسائل وطرق الدفع</h3>
                                        </div>
                                    </div>

                                    {profile.paymentInstructions ? (
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                                            <p className="text-sm font-bold text-emerald-900 mb-2">التعليمات الموضحة للمتبرعين:</p>
                                            <p className="text-emerald-800 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                                {profile.paymentInstructions}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                                            <CreditCard className="w-8 h-8 text-slate-300 mb-3" />
                                            <h4 className="text-slate-700 font-bold mb-2">لم تقم بإضافة وسائل الدفع</h4>
                                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                                أضف وسائل الدفع الخاصة بالجمعية لتسهيل عملية التبرع.
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            </div>

                            {/* Extra Details */}
                            <div className="space-y-6">
                                <Card className="p-6 md:p-8 border-none shadow-sm rounded-2xl bg-white">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">معلومات إضافية</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <ProfileItem icon={Calendar} label="تاريخ التسجيل" value={profile.createdAt ? format(new Date(profile.createdAt), 'dd MMMM yyyy', { locale: ar }) : "غير متوفر"} />
                                        
                                        <ProfileItem icon={CheckCircle2} label="الطاقة الاستيعابية للأسر" value={profile.capacity ? `${profile.capacity} أسرة` : "غير محدد"} />
                                        
                                        {profile.coverageNotes && (
                                            <ProfileItem icon={FileText} label="ملاحظات التغطية" value={profile.coverageNotes} />
                                        )}
                                    </div>
                                </Card>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
            <div className="p-2.5 rounded-lg bg-white text-slate-500 shadow-sm flex-shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
            </div>
        </div>
    );
}

