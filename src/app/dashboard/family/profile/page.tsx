"use client";

import { useEffect, useState } from "react";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { User, Mail, Phone, MapPin, ShieldCheck, Loader2, Edit2, Briefcase, Coins, HelpCircle, Stethoscope } from "lucide-react";
import { getFamilyProfile } from "@/features/families/api/familiesApi";
import { FamilyProfileForm } from "@/features/families/components/FamilyProfileForm";
import type { FamilyProfile } from "@/features/families/types";
import { Skeleton } from "@/shared/ui/skeleton";
import { logger } from "@/lib/logger";

export default function FamilyProfilePage() {
    const [profile, setProfile] = useState<FamilyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await getFamilyProfile();
            setProfile(data);
            setError(null);
        } catch (err) {
            logger.warn("Failed to fetch family profile");
            setError("فشل تحميل بيانات الملف الشخصي");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = (updatedProfile: FamilyProfile) => {
        setProfile(updatedProfile);
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex flex-col h-full bg-[#f8fafc]" dir="rtl">
                    <DashboardTopBar userType="family" />
                    <main className="p-8 pt-24 lg:pt-32">
                        <div className="mx-auto max-w-3xl space-y-8">
                            <Skeleton className="h-12 w-64 mb-4" />
                            <Skeleton className="h-[400px] w-full rounded-3xl" />
                        </div>
                    </main>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !profile) {
        return (
            <DashboardLayout>
                <FamilySidebar />
                <div className="flex-1 flex flex-col h-full bg-[#f8fafc]" dir="rtl">
                    <DashboardTopBar userType="family" />
                    <main className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            <p className="text-destructive font-bold text-lg">{error || "لم يتم العثور على بيانات الملف الشخصي"}</p>
                            <Button onClick={fetchProfile} variant="outline">إعادة المحاولة</Button>
                        </div>
                    </main>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8fafc]" dir="rtl">
                <DashboardTopBar userType="family" />
                <main className="p-6 lg:p-10 pt-24 lg:pt-32">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">الملف الشخصي</h1>
                                <p className="text-slate-500 mt-2 font-medium">بيانات الأسرة ومعلومات التواصل.</p>
                            </div>
                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)} className="gap-2 bg-warm-green hover:bg-warm-green/90 text-white rounded-xl shadow-lg shadow-warm-green/20 transition-all active:scale-95">
                                    <Edit2 className="w-4 h-4" />
                                    تعديل البيانات
                                </Button>
                            )}
                        </div>

                        <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white relative overflow-hidden">
                            {isEditing ? (
                                <FamilyProfileForm
                                    initialData={profile}
                                    onCancel={() => setIsEditing(false)}
                                    onSuccess={handleSuccess}
                                />
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex flex-col items-center mb-10">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-warm-green/10 to-warm-green/20 flex items-center justify-center text-warm-green text-3xl font-black mb-4 border-4 border-white shadow-lg">
                                            {profile.firstName?.[0] || ""}{profile.lastName?.[0] || ""}
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
                                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold mt-3 shadow-sm">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            حساب موثق
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 mb-8">
                                        <ProfileItem icon={User} label="الاسم الأول" value={profile.firstName} />
                                        <ProfileItem icon={User} label="اسم العائلة" value={profile.lastName} />
                                        <ProfileItem icon={Phone} label="رقم الهاتف" value={profile.phone} />
                                        <ProfileItem icon={MapPin} label="الدولة" value={profile.country} />
                                        <ProfileItem icon={MapPin} label="المحافظة" value={profile.governorate} />
                                        <ProfileItem icon={MapPin} label="المدينة" value={profile.city} />
                                        <ProfileItem icon={MapPin} label="الحي" value={profile.neighborhood} />
                                    </div>

                                    {/* Family Members Section */}
                                    {profile.familyMembers && profile.familyMembers.length > 0 && (
                                        <div className="mb-8 border-t pt-8">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5 text-warm-green" />
                                                أفراد الأسرة
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {profile.familyMembers.map((member) => (
                                                    <div key={member.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div className="font-bold">{member.firstName} {member.lastName}</div>
                                                        <div className="text-sm text-slate-500 mt-1">
                                                            {member.relation} • {member.age} سنة
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Employment Data Section */}
                                    {profile.employmentData && (
                                        <div className="mb-8 border-t pt-8">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-warm-green" />
                                                البيانات الوظيفية
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <ProfileItem icon={Briefcase} label="الحالة الوظيفية" value={profile.employmentData.isWorking ? "يعمل" : "لا يعمل"} />
                                                {profile.employmentData.isWorking && (
                                                    <>
                                                        <ProfileItem icon={Briefcase} label="المسمى الوظيفي" value={profile.employmentData.jobTitle || "-"} />
                                                        <ProfileItem icon={Briefcase} label="جهة العمل" value={profile.employmentData.company || "-"} />
                                                        <ProfileItem icon={Coins} label="الراتب الشهري" value={`${profile.employmentData.salaryMonthly || 0} ج.م`} />
                                                    </>
                                                )}
                                                {!profile.employmentData.isWorking && (
                                                    <ProfileItem icon={HelpCircle} label="سبب عدم العمل" value={profile.employmentData.unEmploymentReason || "-"} />
                                                )}
                                                <ProfileItem icon={Coins} label="الدخل التقديري" value={`${profile.employmentData.estimatedIncomeMonthly || 0} ج.م`} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Health Data Section */}
                                    {profile.healthData && (
                                        <div className="mb-8 border-t pt-8">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Stethoscope className="w-5 h-5 text-warm-green" />
                                                البيانات الصحية
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <ProfileItem icon={ShieldCheck} label="تأمين صحي" value={profile.healthData.hasInsurance ? "نعم" : "لا"} />
                                                <ProfileItem icon={Stethoscope} label="إعاقة" value={profile.healthData.hasDisability ? "نعم" : "لا"} />
                                                <ProfileItem icon={Stethoscope} label="أمراض مزمنة" value={profile.healthData.hasChronicDisease ? "نعم" : "لا"} />
                                                <ProfileItem icon={Coins} label="تكاليف علاج شهرية" value={`${profile.healthData.medicalCostMonthly || 0} ج.م`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value?: string }) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-warm-green/30 hover:bg-white hover:shadow-md transition-all duration-300 group">
            <span className="font-bold text-slate-900">{value || "غير متوفر"}</span>
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-warm-green transition-colors">{label}</span>
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 group-hover:bg-warm-green/10 group-hover:border-warm-green/20 transition-all shadow-sm">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-warm-green transition-colors" />
                </div>
            </div>
        </div>
    );
}



